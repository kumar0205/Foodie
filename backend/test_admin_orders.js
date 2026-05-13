import axios from "axios";

async function test() {
  const url = "http://localhost:4000";
  try {
    const res = await axios.get(url + "/api/order/list");
    console.log("Admin Orders found:", res.data.data.length);
  } catch (e) {
    console.error("Admin Fetch failed:", e.message);
  }
}
test();
