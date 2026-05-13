import "dotenv/config";
import foodModel from "./models/foodModel.js";

const seedData = async () => {
    try {
        console.log("Seeding Cloud Firestore...");

        // Sample Data
        const sampleFoods = [
            {
                name: "Greek Salad",
                description: "Fresh vegetables with feta cheese and olives",
                price: 12,
                image: "food_1.png",
                category: "Salad",
                restaurantId: "dummy_rest_id_1"
            },
            {
                name: "Lasagna",
                description: "Classic Italian meat lasagna with cheese",
                price: 18,
                image: "food_2.png",
                category: "Pasta",
                restaurantId: "dummy_rest_id_2"
            }
        ];

        // 1. Clear existing
        await foodModel.deleteMany({});
        
        // 2. Insert items
        for (const food of sampleFoods) {
            await foodModel.create(food);
        }
        console.log("✅ Seeded 2 items successfully into Firestore!");

        // 3. Read
        const allFoods = await foodModel.find({});
        console.log("🔍 Found foods in Firestore:", allFoods.length);

        // 4. Update
        const salad = await foodModel.findOne({ name: "Greek Salad" });
        if (salad) {
            await foodModel.findByIdAndUpdate(salad._id, { price: 15 });
            console.log("Update check: Greek Salad price is now 15");
        }

        console.log("\nTutorial complete! You can now view these items in your Firebase console under Cloud Firestore.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seedData();
