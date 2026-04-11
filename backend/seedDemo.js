import mongoose from "mongoose";
import "dotenv/config";
import foodModel from "./models/foodModel.js";

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB for seeding...");

        // Sample Data
        const sampleFoods = [
            {
                name: "Greek Salad",
                description: "Fresh vegetables with feta cheese and olives",
                price: 12,
                image: "food_1.png",
                category: "Salad",
                restaurantId: new mongoose.Types.ObjectId() // Dummy ID for demo
            },
            {
                name: "Lasagna",
                description: "Classic Italian meat lasagna with cheese",
                price: 18,
                image: "food_2.png",
                category: "Pasta",
                restaurantId: new mongoose.Types.ObjectId()
            }
        ];

        // 1. Create (Insert)
        await foodModel.deleteMany({}); // Clear existing
        const inserted = await foodModel.insertMany(sampleFoods);
        console.log("✅ Seeded 2 items successfully!");

        // 2. Read (Query)
        const allFoods = await foodModel.find();
        console.log("🔍 Found foods in DB:", allFoods.length);

        // 3. Update
        await foodModel.updateOne({ name: "Greek Salad" }, { price: 15 });
        console.log("Update check: Greek Salad price is now 15");

        console.log("\nTutorial complete! You can now see these items in your Atlas dashboard under 'Data Explorer'.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seedData();
