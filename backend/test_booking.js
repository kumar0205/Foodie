import axios from "axios";

async function test() {
  const url = "http://localhost:4000";
  // Token from e2e_test.js
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFOWURsdW11TnNiYVFvcXQ0M0VZa0tRckQ5QjIiLCJpYXQiOjE3Nzg1ODEzMjMsImV4cCI6MTc3OTE4NjEyM30.7vydh3pLEwK33Rn3agRznB9S3eehRJN__hJorBT1Q-s";
  
  try {
    console.log("Placing booking...");
    const res = await axios.post(url + "/api/booking/place", {
      name: "Test User",
      email: "test@example.com",
      phone: "1234567890",
      date: "2026-05-20",
      time: "19:00",
      guests: 4
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Booking result:", res.data.success ? "Success" : "Fail");
    console.log("Booking ID:", res.data.booking?._id);

    const listRes = await axios.get(url + "/api/booking/list");
    console.log("Admin list count:", listRes.data.data.length);

  } catch (e) {
    console.error("Test failed:", e.message);
  }
}
test();
