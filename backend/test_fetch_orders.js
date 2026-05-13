import axios from "axios";

async function test() {
  const url = "http://localhost:4000";
  // Token from e2e_test.js
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFOWURsdW11TnNiYVFvcXQ0M0VZa0tRckQ5QjIiLCJpYXQiOjE3Nzg1ODEzMjMsImV4cCI6MTc3OTE4NjEyM30.7vydh3pLEwK33Rn3agRznB9S3eehRJN__hJorBT1Q-s";
  
  try {
    const res = await axios.get(url + "/api/order", {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Orders found:", res.data.length);
    console.log("First order ID:", res.data[0]?._id);
  } catch (e) {
    console.error("Fetch failed:", e.message);
  }
}
test();
