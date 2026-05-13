import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import fs from "fs";
import cors from "cors";
import foodRouter from "./routes/foodRoute.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import paymentRoute from "./routes/paymentRoute.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import authRoutes from './routes/authRoute.js';
import userRoutes from './routes/userRoute.js';
import cookieParser from 'cookie-parser';
import "dotenv/config";
import foodModel from "./models/foodModel.js";

const app = express();
const port = 4000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    methods: ["GET", "POST"]
  }
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("joinUserRoom", (userId) => {
    socket.join(userId);
    console.log(`Socket ${socket.id} joined user room: ${userId}`);
  });

  socket.on("joinAdminRoom", () => {
    socket.join("admin");
    console.log(`Socket ${socket.id} joined admin room`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://127.0.0.1:5175"],
  credentials: true
}));

app.use("/images", express.static("uploads"));

import bookingRoutes from "./routes/bookingRoutes.js";
import { seedTables, getTables, updateTableStatus } from "./controllers/tableController.js";
import Table from "./models/tableModel.js";

const tableRouter = express.Router();
tableRouter.get("/list", getTables);
tableRouter.post("/status", updateTableStatus);

app.use("/api/food", foodRouter);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/table", tableRouter);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payment", paymentRoute);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("api working");
});

app.get("/test-write", (req, res) => {
  try {
    fs.writeFileSync("test_write.log", "write test success");
    res.send("Write success");
  } catch (err) {
    res.status(500).send("Write failed: " + err.message);
  }
});

httpServer.listen(port, async () => {
  console.log(`server started on port ${port}`);
  await seedTables();

  // Table Lock Cleanup Interval (every minute)
  setInterval(async () => {
    try {
      const fiveMinsAgo = Date.now() - 5 * 60 * 1000;
      const lockedTables = await Table.find({ status: "Locked" });
      for (const table of lockedTables) {
        if (table.lockedAt && table.lockedAt < fiveMinsAgo) {
          await Table.findByIdAndUpdate(table._id, { status: "Available", lockedAt: null });
          io.emit("tableStatusChanged", { tableId: table._id, status: "Available" });
          console.log(`🔓 Auto-released expired lock for Table #${table.tableNo}`);
        }
      }
    } catch (err) {
      console.error("Lock cleanup error:", err);
    }
  }, 60000);

  try {
    const count = await foodModel.countDocuments({});
    if (count === 0) {
      console.log("Database empty. Auto-seeding initial sample data...");
      const initialFoods = [
        { name: "Greek salad", price: 12, category: "Salad", image: "food_1.png", description: "Food provides essential nutrients for overall health", restaurantId: "67da10363734e701734b5899" },
        { name: "Veg salad", price: 18, category: "Salad", image: "food_2.png", description: "Food provides essential nutrients for overall health", restaurantId: "67da10363734e701734b5899" },
        { name: "Clover Salad", price: 16, category: "Salad", image: "food_3.png", description: "Food provides essential nutrients for overall health", restaurantId: "67da10363734e701734b5899" },
        { name: "Chicken Salad", price: 24, category: "Salad", image: "food_4.png", description: "Food provides essential nutrients for overall health", restaurantId: "67da10363734e701734b5899" }
      ];
      for (const item of initialFoods) {
        await foodModel.create(item);
      }
      console.log("✅ Auto-seeded fallback items successfully!");
    }
  } catch (err) {
    console.log("Auto-seed error:", err.message);
  }
});
