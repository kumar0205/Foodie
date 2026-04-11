import mongoose from "mongoose";
import "dotenv/config";

const testDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            console.error("❌ MONGODB_URI is not defined in .env file");
            return;
        }
        console.log("Connecting to:", mongoURI.split("@")[1] || "Localhost"); // Hide credentials
        await mongoose.connect(mongoURI, {
            tlsAllowInvalidCertificates: true
        });
        console.log("✅ Successfully connected to MongoDB!");
        process.exit(0);
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

testDB();
