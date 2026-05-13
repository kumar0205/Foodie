import Booking from "../models/bookingModel.js";
import Table from "../models/tableModel.js";

export const placeBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, phone, date, time, guests, tableId, tableNo } = req.body;

    const today = new Date().toISOString().split('T')[0];
    if (date !== today) {
      return res.status(400).json({ success: false, message: "Bookings are only allowed for today" });
    }

    const booking = new Booking({
      userId,
      name,
      email,
      phone,
      date,
      time,
      guests: Number(guests),
      tableId,
      tableNo,
      status: "Pending",
      createdAt: new Date().toISOString()
    });

    await booking.save();

    const io = req.app.get("io");
    if (io) {
      io.to("admin").emit("newBooking", booking);
    }

    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating booking", error: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching bookings", error: error.message });
  }
};

export const listBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching all bookings", error: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;
    const booking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true });

    if (booking && booking.tableId) {
      if (status === "Confirmed") {
        await Table.findByIdAndUpdate(booking.tableId, { status: "Booked" });
      } else if (status === "Completed" || status === "Cancelled") {
        await Table.findByIdAndUpdate(booking.tableId, { status: "Available" });
      }

      const io = req.app.get("io");
      if (io) {
        io.emit("tableStatusChanged", { tableId: booking.tableId, status: status === "Confirmed" ? "Booked" : "Available" });
        if (booking.userId) {
          io.to(booking.userId.toString()).emit("bookingStatusUpdated", booking);
        }
      }
    }

    res.status(200).json({ success: true, message: "Booking status updated", booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating booking status", error: error.message });
  }
};
