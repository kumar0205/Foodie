import axios from "axios";

async function test() {
  const url = "http://localhost:4000";
  // Token from e2e_test.js
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFOWURsdW11TnNiYVFvcXQ0M0VZa0tRckQ5QjIiLCJpYXQiOjE3Nzg1ODEzMjMsImV4cCI6MTc3OTE4NjEyM30.7vydh3pLEwK33Rn3agRznB9S3eehRJN__hJorBT1Q-s";
  
  try {
    const tableRes = await axios.get(url + "/api/table/list");
    const table = tableRes.data.data[0];
    console.log(`Booking Table #${table.tableNo}...`);

    const res = await axios.post(url + "/api/booking/place", {
      name: "Visual Test",
      email: "visual@test.com",
      phone: "99999",
      date: "2026-06-01",
      time: "20:00",
      guests: table.capacity,
      tableId: table._id,
      tableNo: table.tableNo
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("Booking Success:", res.data.success);
    
    // Update table status
    await axios.post(url + "/api/table/status", { tableId: table._id, status: "Booked" });
    console.log("Table status updated to Booked");

    const checkTable = await axios.get(url + "/api/table/list");
    console.log("Table status now:", checkTable.data.data[0].status);

  } catch (e) {
    console.error("Test failed:", e.message);
  }
}
test();
