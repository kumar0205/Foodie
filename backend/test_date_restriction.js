import axios from "axios";

async function test() {
  const url = "http://localhost:4000";
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFOWURsdW11TnNiYVFvcXQ0M0VZa0tRckQ5QjIiLCJpYXQiOjE3Nzg1ODEzMjMsImV4cCI6MTc3OTE4NjEyM30.7vydh3pLEwK33Rn3agRznB9S3eehRJN__hJorBT1Q-s";
  
  try {
    console.log("Testing next day booking (should fail)...");
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    const dateStr = nextDay.toISOString().split('T')[0];

    const res = await axios.post(url + "/api/booking/place", {
      name: "Fail Test",
      email: "fail@test.com",
      phone: "000",
      date: dateStr,
      time: "12:00",
      guests: 2,
      tableId: "some-id",
      tableNo: 1
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Result:", res.data);
  } catch (e) {
    console.log("Caught expected error:", e.response?.data?.message || e.message);
  }
}
test();
