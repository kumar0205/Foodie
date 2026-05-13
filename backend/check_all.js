import { db } from "./config/firebase.js";
import { collection, getDocs } from "firebase/firestore";

async function check() {
  const collections = ["users", "foods", "restaurants", "orders", "carts"];
  for (const col of collections) {
    try {
      const s = await getDocs(collection(db, col));
      console.log(`Collection ${col}: ${s.docs.length} documents`);
    } catch (e) {
      console.log(`Collection ${col}: Error ${e.message}`);
    }
  }
}
check();
