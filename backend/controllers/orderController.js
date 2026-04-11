import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Food from "../models/foodModel.js";
import Restaurant from "../models/restaurantModel.js";
import User from "../models/userModel.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { firstName, lastName, email, street, city, state, zipCode, country, phone } = req.body;

    const cart = await Cart.findOne({ userId }).populate("items.foodId items.restaurantId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Filter out items where foodId is null (e.g., food item deleted)
    const validItems = cart.items.filter(item => item.foodId);

    if (validItems.length === 0) {
      return res.status(400).json({ message: "No valid food items in cart" });
    }

    const totalAmount = validItems.reduce(
      (acc, item) => acc + item.foodId.price * item.quantity,
      0
    ) + 2; // Adding delivery fee flat $2 as in frontend

    const order = new Order({
      userId,
      items: validItems.map(item => ({
        foodId: item.foodId._id,
        quantity: item.quantity,
        restaurantId: item.restaurantId ? item.restaurantId._id : null
      })),
      totalAmount,
      address: { firstName, lastName, email, street, city, state, zipCode, country, phone }
    });

    await order.save();
    await Cart.findOneAndDelete({ userId });

    res.status(201).json({ success: true, order: await order.populate("items.foodId items.restaurantId") });
  } catch (error) {
    console.error("Order Placement Error:", error);
    res.status(500).json({ success: false, message: "Error placing order", error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId }).populate("items.foodId items.restaurantId");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

export const listOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("items.foodId items.restaurantId userId");
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching orders", error: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await Order.findByIdAndUpdate(orderId, { status });
    res.status(200).json({ success: true, message: "Status updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating status", error: error.message });
  }
};
