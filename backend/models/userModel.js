import { createModelClass } from "./modelFactory.js";

const User = createModelClass("users", {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'customer', enum: ['customer', 'admin', 'delivery'] },
    cartData: { type: Object, default: {} },
    address: {
        name: { type: String },
        phoneNumber: { type: String },
        doorNo: { type: String },
        street: { type: String },
        village: { type: String },
        town: { type: String },
        pincode: { type: String }
    }
});
export default User;
