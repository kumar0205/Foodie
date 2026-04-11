import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      foodId: { type: mongoose.Schema.Types.ObjectId, ref: "food", required: true },
      quantity: { type: Number, required: true },
      restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: false }
    }
  ],
  totalAmount: { type: Number, required: true },
  address: {
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    email: { type: String, required: false },
    street: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    zipCode: { type: String, required: false },
    country: { type: String, required: false },
    phone: { type: String, required: false }
  },
  status: { type: String, default: "Pending" },
  payment: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("Order", orderSchema);
