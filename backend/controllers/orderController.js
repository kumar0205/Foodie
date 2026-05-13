import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Food from "../models/foodModel.js";
import Restaurant from "../models/restaurantModel.js";
import User from "../models/userModel.js";

import fs from "fs";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    fs.appendFileSync("order_debug.log", `User: ${userId}\nBody: ${JSON.stringify(req.body, null, 2)}\n`);
    const { firstName, lastName, email, street, city, state, zipCode, country, phone } = req.body;

    let cart = await Cart.findOne({ userId });
    if (cart) {
      cart = await cart.populate("items.foodId items.restaurantId");
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      fs.writeFileSync("order_error.log", JSON.stringify({ message: "Cart is empty", cart }));
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Filter out items where foodId is null (e.g., food item deleted)
    const validItems = cart.items.filter(item => item.foodId && typeof item.foodId === 'object' && item.foodId.price !== undefined);
    fs.appendFileSync("order_debug.log", `Valid Items Count: ${validItems.length}\n`);

    if (validItems.length === 0) {
      fs.writeFileSync("order_error.log", JSON.stringify({ message: "No valid food items in cart", cart_items: cart.items }));
      return res.status(400).json({ message: "No valid food items in cart" });
    }

    const totalAmount = validItems.reduce(
      (acc, item) => acc + (Number(item.foodId.price) || 0) * item.quantity,
      0
    ) + 2; // Adding delivery fee flat $2 as in frontend

    const order = new Order({
      userId,
      items: validItems.map(item => ({
        foodId: item.foodId._id,
        quantity: item.quantity,
        restaurantId: (item.restaurantId && item.restaurantId._id) ? item.restaurantId._id : null
      })),
      totalAmount,
      address: { ...req.body }, // Use spread to capture all address fields (name, doorNo, etc.)
      status: "Pending",
      paymentStatus: "Pending",
      paymentMethod: req.body.paymentMethod || "COD",
      date: Date.now(),
      createdAt: new Date()
    });

    fs.appendFileSync("order_debug.log", `Saving Order for user: ${userId}\n`);
    await order.save();
    fs.appendFileSync("order_debug.log", `Order saved in Firestore! ID: ${order._id}\n`);
    
    await Cart.deleteMany({ userId });
    fs.appendFileSync("order_debug.log", `Cart cleared for user\n`);

    const populatedOrder = await order.populate("items.foodId items.restaurantId");
    fs.appendFileSync("order_debug.log", `Order populated for response\n`);

    const io = req.app.get("io");
    if (io) {
      fs.appendFileSync("order_debug.log", `Emitting newOrder to admin\n`);
      io.to("admin").emit("newOrder", populatedOrder);
    }

    res.status(201).json({ success: true, order: populatedOrder });
  } catch (error) {
    fs.writeFileSync("order_error.log", JSON.stringify({ message: error.message, stack: error.stack }));
    console.error("Order Placement Error:", error);
    res.status(500).json({ success: false, message: "Error placing order", error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    // Sort by date or createdAt to ensure latest is always first
    const orders = await Order.find({ userId }).populate("items.foodId items.restaurantId").sort({ date: -1 });
    // Secondary sort in memory if needed (modelFactory already does one level, but let's be sure)
    const sortedOrders = orders.sort((a, b) => {
        const dateA = a.date || (a.createdAt ? new Date(a.createdAt).getTime() : 0);
        const dateB = b.date || (b.createdAt ? new Date(b.createdAt).getTime() : 0);
        return dateB - dateA;
    });
    res.status(200).json(sortedOrders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

export const listOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [
        { paymentStatus: "Success" },
        { paymentMethod: "COD" }
      ]
    }).populate("items.foodId items.restaurantId userId").sort({ date: -1 });
    
    const sortedOrders = orders.sort((a, b) => {
        const dateA = a.date || (a.createdAt ? new Date(a.createdAt).getTime() : 0);
        const dateB = b.date || (b.createdAt ? new Date(b.createdAt).getTime() : 0);
        return dateB - dateA;
    });
    
    res.status(200).json({ success: true, data: sortedOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching orders", error: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await Order.findByIdAndUpdate(orderId, { status });

    const io = req.app.get("io");
    if (io) {
      const updatedOrder = await Order.findById(orderId);
      io.to("admin").emit("statusUpdated", updatedOrder);
      if (updatedOrder && updatedOrder.userId) {
        io.to(updatedOrder.userId.toString()).emit("statusUpdated", updatedOrder);
      }
    }

    res.status(200).json({ success: true, message: "Status updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating status", error: error.message });
  }
};
