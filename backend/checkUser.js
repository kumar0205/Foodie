import User from './models/userModel.js'

const checkUser = async () => {
    try {
        const user = await User.findOne({ email: "delivery@foodie.com" });
        if (user) {
            console.log("Found user:", user.email);
            console.log("Role:", user.role);
            console.log("Name:", user.name);
            if (!user.name) {
                console.log("Updating name...");
                await User.findByIdAndUpdate(user._id, { name: 'Delivery Partner' });
            }
            if (!user.role || user.role !== 'delivery') {
                console.log("Updating role to delivery...");
                await User.findByIdAndUpdate(user._id, { role: 'delivery' });
                console.log("Updated!");
            }
        } else {
            console.log("User not found!");
        }
    } catch (err) {
        console.error(err);
    }
}

checkUser();
