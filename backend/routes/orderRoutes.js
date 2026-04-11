import express from "express";
import { placeOrder, getOrders, listOrders, updateStatus } from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/place", protect, placeOrder);
router.get("/", protect, getOrders);
router.get("/list", listOrders);
router.post("/status", updateStatus);

export default router