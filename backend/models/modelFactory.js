import { db } from "../config/firebase.js";
import fs from "fs";
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  setDoc, 
  deleteDoc, 
  query, 
  where,
  documentId 
} from "firebase/firestore";

// In-memory fallback DB in case Cloud Firestore API isn't enabled yet or network fails
const inMemoryDB = {};

class QueryChain {
  constructor(collectionName, filter = {}) {
    this.collectionName = collectionName;
    this.filter = filter;
    this._populate = [];
    this._sort = null;
    this._limit = null;
    this._skip = 0;
  }

  populate(path, select) {
    this._populate.push({ path, select });
    return this;
  }

  sort(sortObj) {
    this._sort = sortObj;
    return this;
  }

  limit(limitVal) {
    this._limit = Number(limitVal);
    return this;
  }

  skip(skipVal) {
    this._skip = Number(skipVal);
    return this;
  }

  select(selectStr) {
    return this;
  }

  async exec() {
    let results = [];
    try {
      if (this.filter.$or && Array.isArray(this.filter.$or)) {
        // Firestore doesn't support complex $or easily in the same query object
        // For this mock model, we'll fetch all and filter in memory if $or is present
        // OR we can implement it as multiple queries joined (too complex for now)
        const snap = await getDocs(collection(db, this.collectionName));
        results = snap.docs.map(docSnap => ({
          _id: docSnap.id,
          id: docSnap.id,
          ...docSnap.data()
        })).filter(item => {
          return this.filter.$or.some(cond => {
            const [k, v] = Object.entries(cond)[0];
            return item[k] === v;
          });
        });
      } else {
        let q = query(collection(db, this.collectionName));
        for (const key in this.filter) {
          if (this.filter[key] !== undefined) {
            if (typeof this.filter[key] === "object" && this.filter[key] !== null) {
              const keys = Object.keys(this.filter[key]);
              if (keys.includes("$ne")) {
                q = query(q, where(key === "_id" || key === "id" ? documentId() : key, "!=", this.filter[key]["$ne"]));
              } else if (keys.includes("$gt")) {
                q = query(q, where(key === "_id" || key === "id" ? documentId() : key, ">", this.filter[key]["$gt"]));
              } else if (keys.includes("$in")) {
                q = query(q, where(key === "_id" || key === "id" ? documentId() : key, "in", this.filter[key]["$in"]));
              }
            } else {
              q = query(q, where(key === "_id" || key === "id" ? documentId() : key, "==", this.filter[key]));
            }
          }
        }
        const snap = await getDocs(q);
        results = snap.docs.map(docSnap => ({
          _id: docSnap.id,
          id: docSnap.id,
          ...docSnap.data()
        }));
      }
    } catch (error) {
      console.warn(`⚠️ Firestore ${this.collectionName} failed: ${error.message}. Using in-memory fallback.`);
      if (!inMemoryDB[this.collectionName]) inMemoryDB[this.collectionName] = [];
      results = inMemoryDB[this.collectionName].filter(item => {
        for (const k in this.filter) {
          if (this.filter[k] !== undefined) {
            if (typeof this.filter[k] === "object" && this.filter[k] !== null) {
              const keys = Object.keys(this.filter[k]);
              if (keys.includes("$ne") && item[k] === this.filter[k]["$ne"]) return false;
              if (keys.includes("$in") && !this.filter[k]["$in"].includes(item[k])) return false;
            } else if (item[k] !== this.filter[k]) {
              return false;
            }
          }
        }
        return true;
      });
    }

    if (this._sort) {
      const sortKeys = Object.keys(this._sort);
      if (sortKeys.length > 0) {
        const key = sortKeys[0];
        const dir = this._sort[key] === -1 ? -1 : 1;
        results.sort((a, b) => {
          const valA = a[key];
          const valB = b[key];
          if (valA < valB) return -1 * dir;
          if (valA > valB) return 1 * dir;
          return 0;
        });
      }
    }

    if (this._skip > 0) {
      results = results.slice(this._skip);
    }
    if (this._limit !== null) {
      results = results.slice(0, this._limit);
    }

    for (const pop of this._populate) {
      const pathParts = pop.path.split(".");
      for (const item of results) {
        const fieldName = pathParts[0];
        if (item[fieldName] && typeof item[fieldName] === "string") {
          let colName = null;
          if (fieldName === "userId" || fieldName === "user") colName = "users";
          else if (fieldName === "restaurantId" || fieldName === "favoriteRestaurant") colName = "restaurants";
          else if (fieldName === "foodId" || fieldName === "food") colName = "foods";
          else if (fieldName === "favoriteFoods") {
            if (Array.isArray(item[fieldName])) {
              const fetchedArr = await Promise.all(item[fieldName].map(async fid => {
                const docSnap = await getDoc(doc(db, "foods", fid));
                return docSnap.exists() ? { _id: docSnap.id, id: docSnap.id, ...docSnap.data() } : null;
              }));
              item[fieldName] = fetchedArr.filter(Boolean);
            }
          }

          if (colName) {
            try {
              const docSnap = await getDoc(doc(db, colName, item[fieldName]));
              if (docSnap.exists()) {
                item[fieldName] = { _id: docSnap.id, id: docSnap.id, ...docSnap.data() };
              }
            } catch (err) {
              if (inMemoryDB[colName]) {
                const found = inMemoryDB[colName].find(x => x._id === item[fieldName]);
                if (found) item[fieldName] = found;
              }
            }
          }
        } else if ((fieldName === "items" || fieldName.startsWith("items.")) && Array.isArray(item.items)) {
          for (const nestedItem of item.items) {
            const subFields = fieldName.startsWith("items.") ? [fieldName.split(".")[1]] : ["foodId", "restaurantId"];
            
            for (const subField of subFields) {
              if (nestedItem[subField] && typeof nestedItem[subField] === "string") {
                let nestedCol = subField === "foodId" ? "foods" : (subField === "restaurantId" ? "restaurants" : null);
                if (nestedCol) {
                  try {
                    fs.appendFileSync("populate_debug.log", `Looking up ${nestedCol}/${nestedItem[subField]} for path ${fieldName}\n`);
                    const docSnap = await getDoc(doc(db, nestedCol, nestedItem[subField]));
                    if (docSnap.exists()) {
                      fs.appendFileSync("populate_debug.log", `Found ${nestedCol}/${nestedItem[subField]}!\n`);
                      nestedItem[subField] = { _id: docSnap.id, id: docSnap.id, ...docSnap.data() };
                    } else {
                      fs.appendFileSync("populate_debug.log", `NOT FOUND: ${nestedCol}/${nestedItem[subField]}\n`);
                      console.warn(`Doc ${nestedItem[subField]} not found in ${nestedCol}`);
                    }
                  } catch (err) {
                    fs.appendFileSync("populate_debug.log", `ERROR: ${err.message}\n`);
                    console.error(`Error populating ${nestedCol}/${nestedItem[subField]}:`, err.message);
                    if (inMemoryDB[nestedCol]) {
                      const found = inMemoryDB[nestedCol].find(x => x._id === nestedItem[subField]);
                      if (found) nestedItem[subField] = found;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    return results;
  }

  then(onFulfilled, onRejected) {
    return this.exec().then(onFulfilled, onRejected);
  }
}

class ModelInstance {
  constructor(collectionName, data) {
    this._collectionName = collectionName;
    Object.assign(this, data);
    if (!this._id && this.id) this._id = this.id;
  }

  async save() {
    const clean = (val) => {
      if (Array.isArray(val)) return val.map(clean);
      if (val !== null && typeof val === 'object' && !(val instanceof Date)) {
        const c = {};
        for (const k in val) {
          c[k] = val[k] === undefined ? null : clean(val[k]);
        }
        return c;
      }
      return val === undefined ? null : val;
    };

    const dataToSave = {};
    const id = this._id;
    for (const key in this) {
      if (typeof this[key] !== 'function' && !key.startsWith('_') && key !== 'id') {
        dataToSave[key] = clean(this[key]);
      }
    }

    try {
      if (id) {
        const docRef = doc(db, this._collectionName, id);
        await setDoc(docRef, dataToSave);
        this._id = id;
        this.id = id;
      } else {
        const docRef = await addDoc(collection(db, this._collectionName), dataToSave);
        fs.appendFileSync("order_debug.log", `Firestore write success! Doc ID: ${docRef.id} in collection ${this._collectionName}\n`);
        this._id = docRef.id;
        this.id = docRef.id;
      }
    } catch (error) {
      fs.appendFileSync("firestore_error.log", `Write failed for ${this._collectionName}: ${error.message}\nData: ${JSON.stringify(dataToSave)}\n`);
      console.warn(`⚠️ Firestore write failed for ${this._collectionName}. Using in-memory.`);
      const currentId = id || Math.random().toString(36).substr(2, 9);
      this._id = currentId;
      this.id = currentId;
      if (!inMemoryDB[this._collectionName]) inMemoryDB[this._collectionName] = [];
      const idx = inMemoryDB[this._collectionName].findIndex(x => x._id === currentId);
      if (idx > -1) inMemoryDB[this._collectionName][idx] = { _id: currentId, id: currentId, ...dataToSave };
      else inMemoryDB[this._collectionName].push({ _id: currentId, id: currentId, ...dataToSave });
    }
    return this;
  }

  async populate(path) {
    if (this._id) {
      const fresh = await new QueryChain(this._collectionName, { _id: this._id }).populate(path).exec();
      if (fresh && fresh[0]) {
        Object.assign(this, fresh[0]);
      }
    }
    return this;
  }
}

export function createModelClass(collectionName) {
  function Model(data) {
    return new ModelInstance(collectionName, data);
  }

  Model.collectionName = collectionName;

  Model.find = function(filter) {
    return new QueryChain(collectionName, filter);
  };

  Model.findOne = async function(filter) {
    const chain = new QueryChain(collectionName, filter);
    const res = await chain.exec();
    return res[0] ? new ModelInstance(collectionName, res[0]) : null;
  };

  Model.findById = async function(id) {
    if (!id) return null;
    try {
      const docRef = doc(db, collectionName, id.toString());
      const snap = await getDoc(docRef);
      if (snap.exists()) return new ModelInstance(collectionName, { _id: snap.id, id: snap.id, ...snap.data() });
    } catch (error) {
      // ignore
    }
    if (inMemoryDB[collectionName]) {
      const found = inMemoryDB[collectionName].find(x => x._id === id.toString());
      if (found) return new ModelInstance(collectionName, found);
    }
    return null;
  };

  Model.findByIdAndUpdate = async function(id, updateData, options = {}) {
    if (!id) return null;
    const current = await Model.findById(id);
    if (!current) return null;

    let finalData = { ...current };
    delete finalData._id;
    delete finalData.id;
    delete finalData._collectionName;
    delete finalData.save;
    delete finalData.populate;

    for (const k in updateData) {
      if (k === "$unset") {
        for (const unsetKey in updateData[k]) delete finalData[unsetKey];
      } else if (k === "$addToSet") {
        for (const addKey in updateData[k]) {
          if (!finalData[addKey]) finalData[addKey] = [];
          const val = updateData[k][addKey];
          if (!finalData[addKey].includes(val)) finalData[addKey].push(val);
        }
      } else if (k === "$pull") {
        for (const pullKey in updateData[k]) {
          if (finalData[pullKey]) {
            const val = updateData[k][pullKey];
            finalData[pullKey] = finalData[pullKey].filter(item => item !== val);
          }
        }
      } else {
        finalData[k] = updateData[k];
      }
    }

    try {
      const docRef = doc(db, collectionName, id.toString());
      await setDoc(docRef, finalData);
    } catch (error) {
      if (!inMemoryDB[collectionName]) inMemoryDB[collectionName] = [];
      const idx = inMemoryDB[collectionName].findIndex(x => x._id === id);
      if (idx > -1) inMemoryDB[collectionName][idx] = { _id: id, id: id, ...finalData };
      else inMemoryDB[collectionName].push({ _id: id, id: id, ...finalData });
    }

    const ret = new ModelInstance(collectionName, { _id: id, id: id, ...finalData });
    if (options.populate) {
      await ret.populate(options.populate);
    }
    return ret;
  };

  Model.findByIdAndDelete = async function(id) {
    if (!id) return null;
    const current = await Model.findById(id);
    if (!current) return null;
    try {
      await deleteDoc(doc(db, collectionName, id.toString()));
    } catch (err) {
      if (inMemoryDB[collectionName]) {
        inMemoryDB[collectionName] = inMemoryDB[collectionName].filter(x => x._id !== id);
      }
    }
    return current;
  };

  Model.deleteMany = async function(filter) {
    const items = await new QueryChain(collectionName, filter).exec();
    for (const item of items) {
      await Model.findByIdAndDelete(item.id);
    }
    return { deletedCount: items.length };
  };

  Model.updateMany = async function(filter, updateData) {
    const items = await new QueryChain(collectionName, filter).exec();
    for (const item of items) {
      await Model.findByIdAndUpdate(item.id, updateData);
    }
    return { modifiedCount: items.length };
  };

  Model.create = async function(data) {
    const inst = new ModelInstance(collectionName, data);
    return await inst.save();
  };

  Model.countDocuments = async function(filter) {
    const items = await new QueryChain(collectionName, filter).exec();
    return items.length;
  };

  Model.aggregate = async function(pipeline) {
    const items = await new QueryChain(collectionName, {}).exec();
    let result = [...items];
    for (const step of pipeline) {
      if (step.$match) {
        result = result.filter(item => {
          for (const k in step.$match) {
            if (item[k] !== step.$match[k]) return false;
          }
          return true;
        });
      } else if (step.$unwind) {
        const path = step.$unwind.replace('$', '');
        let unwound = [];
        for (const item of result) {
          const arr = item[path];
          if (Array.isArray(arr)) {
            for (const sub of arr) unwound.push({ ...item, [path]: sub });
          }
        }
        result = unwound;
      } else if (step.$group) {
        const keys = Object.keys(step.$group);
        let total = 0;
        for (const k of keys) {
          if (k === '_id') continue;
          const opObj = step.$group[k];
          if (opObj.$sum) {
            const field = opObj.$sum.replace('$', '');
            for (const item of result) {
              const val = field === '1' ? 1 : Number(item[field] || 0);
              total += val;
            }
            return [{ totalItems: total, total: total }];
          }
        }
      }
    }
    return result;
  };

  return Model;
}
