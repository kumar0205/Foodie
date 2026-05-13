import { db } from "./config/firebase.js";
import { collection, addDoc } from "firebase/firestore";

async function test() {
  try {
    console.log("Attempting to write to test_writes collection...");
    const docRef = await addDoc(collection(db, "test_writes"), {
      test: "data",
      time: new Date().toISOString()
    });
    console.log("Write success! ID:", docRef.id);
  } catch (e) {
    console.error("WRITE FAILED:", e.code, e.message);
  }
}
test();
