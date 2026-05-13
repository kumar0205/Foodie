import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase.js";
import Food from "../models/foodModel.js";

// Add food item
const addFood = async (req, res) => {
  try {
    const body = { ...req.body };

    let imageUrl = "";
    if (req.file) {
      const filename = `${Date.now()}_${req.file.originalname}`;
      const storageRef = ref(storage, `food_images/${filename}`);
      await uploadBytes(storageRef, req.file.buffer);
      imageUrl = await getDownloadURL(storageRef);
    } else if (body.image) {
      imageUrl = body.image;
    }

    const newFood = new Food({
      name: body.name,
      price: Number(body.price),
      description: body.description,
      category: body.category,
      restaurantId: body.restaurantId,
      image: imageUrl,
    });

    await newFood.save();

    res.status(201).json({ success: true, food: newFood });
  } catch (error) {
    console.error("❌ Add food error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get food by restaurant
const getFoodByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const foodList = await Food.find({ restaurantId });
    res.status(200).json({ success: true, food: foodList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove food item
const removeFood = async (req, res) => {
  try {
    const food = await Food.findById(req.body.id);
    await Food.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food item removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error removing food item" });
  }
};

// List all food items
const listFood = async (req, res) => {
  try {
    const foods = await Food.find({});
    res.status(200).json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error fetching food list" });
  }
};

// Update food item
const updateFood = async (req, res) => {
  try {
    const { id, name, price, description, category, available } = req.body;
    const updateData = {
      name,
      price: Number(price),
      description,
      category,
      available: available === 'true' || available === true
    };

    if (req.file) {
      const filename = `${Date.now()}_${req.file.originalname}`;
      const storageRef = ref(storage, `food_images/${filename}`);
      await uploadBytes(storageRef, req.file.buffer);
      updateData.image = await getDownloadURL(storageRef);
    }

    await Food.findByIdAndUpdate(id, updateData);
    res.json({ success: true, message: "Food item updated" });
  } catch (error) {
    console.error("❌ Update food error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle food availability
const toggleAvailability = async (req, res) => {
  try {
    const { id, available } = req.body;
    await Food.findByIdAndUpdate(id, { available });
    res.json({ success: true, message: `Food is now ${available ? 'Available' : 'Unavailable'}` });
  } catch (error) {
    console.error("❌ Toggle availability error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addFood, getFoodByRestaurant, removeFood, listFood, updateFood, toggleAvailability };
