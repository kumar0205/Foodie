import { db } from "./config/firebase.js";
import { collection, getDocs } from "firebase/firestore";

async function check() {
  const s = await getDocs(collection(db, "foods"));
  console.log("IDs in foods collection:", s.docs.map(d => d.id));
}
check();
