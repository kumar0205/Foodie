import express from "express"
import { addFood, getFoodByRestaurant, removeFood, listFood, updateFood, toggleAvailability } from "../controllers/foodController.js"
import multer from "multer"

const foodRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single('image'), addFood);
foodRouter.post("/remove", removeFood)
foodRouter.get("/list", listFood);
foodRouter.get("/restaurant/:restaurantId", getFoodByRestaurant);
foodRouter.post("/update", upload.single('image'), updateFood);
foodRouter.post("/toggle-availability", toggleAvailability);
export default foodRouter;