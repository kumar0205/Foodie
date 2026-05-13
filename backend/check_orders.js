import { db } from "./config/firebase.js";
import { collection, getDocs } from "firebase/firestore";

async function check() {
  const s = await getDocs(collection(db, "orders"));
  console.log("Orders count:", s.docs.length);
  console.log("Last order:", JSON.stringify(s.docs[s.docs.length-1]?.data(), null, 2));
}
check();
