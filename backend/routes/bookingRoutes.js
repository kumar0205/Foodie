import express from "express";
import { placeBooking, getUserBookings, listBookings, updateBookingStatus } from "../controllers/bookingController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/place", protect, placeBooking);
router.get("/user", protect, getUserBookings);
router.get("/list", listBookings);
router.post("/status", updateBookingStatus);

export default router;
