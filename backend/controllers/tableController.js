import Table from "../models/tableModel.js";
import Booking from "../models/bookingModel.js";

export const getTables = async (req, res) => {
  try {
    // Sync table status with active bookings to ensure consistency
    const activeBookings = await Booking.find({ status: { $in: ["Pending", "Confirmed"] } });
    const bookedTableIds = activeBookings.filter(b => b.tableId).map(b => b.tableId.toString());

    const tables = await Table.find({});
    
    // Optional: Perform a one-time fix if inconsistencies are found
    // For performance, we'll just return the current state but we could update them here.
    // However, the most robust way is to ensure all fetch operations show the correct state.
    
    const syncedTables = tables.map(table => {
      if (bookedTableIds.includes(table._id.toString()) && table.status === "Available") {
        // This table should be booked
        table.status = "Booked";
      }
      return table;
    });

    res.status(200).json({ success: true, data: syncedTables });
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ success: false, message: "Error fetching tables" });
  }
};

export const updateTableStatus = async (req, res) => {
  try {
    const { tableId, status } = req.body;
    console.log(`Updating table ${tableId} to status: ${status}`);
    await Table.findByIdAndUpdate(tableId, { status });

    let bookingUpdateResult = null;
    // If admin manually makes table available, mark associated online "Pending" or "Confirmed" bookings as "Completed"
    if (status === "Available") {
      // String matching is standard for this Firebase-backed implementation
      bookingUpdateResult = await Booking.updateMany(
        { tableId, status: { $in: ["Pending", "Confirmed"] } },
        { status: "Completed" }
      );
      
      if (bookingUpdateResult && bookingUpdateResult.modifiedCount > 0) {
        console.log(`✅ Online booking for table ${tableId} marked as Completed.`);
      } else {
        console.log(`ℹ️ Table ${tableId} was marked as Available (offline occupancy cleared).`);
      }
    }
    
    const io = req.app.get("io");
    if (io) {
      io.emit("tableStatusChanged", { tableId, status });
    }
    
    res.status(200).json({ 
      success: true, 
      message: "Table status updated", 
      bookingUpdated: bookingUpdateResult ? bookingUpdateResult.modifiedCount : 0 
    });
  } catch (error) {
    console.error("Error updating table status:", error);
    res.status(500).json({ success: false, message: "Error updating table status" });
  }
};

// Utility to seed tables
export const seedTables = async () => {
  const count = await Table.countDocuments({});
  if (count === 0) {
    const initialTables = [];
    for (let i = 1; i <= 24; i++) {
      initialTables.push({
        tableNo: i,
        capacity: i <= 8 ? 2 : i <= 16 ? 4 : 6,
        status: "Available"
      });
    }
    for (const t of initialTables) {
      const table = new Table(t);
      await table.save();
    }
    console.log("✅ Seeded 24 tables");
  }
};
