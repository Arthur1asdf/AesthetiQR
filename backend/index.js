import express from "express";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import openaiRoutes from "./routes/openai.js";
import profilepic from "./routes/profilepicRoute.js";
import qrcodeRoute from "./routes/qrcodeRoute.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// parse clerk session JWT and attach 'req.auth'
app.use(clerkMiddleware());

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Mount the auth routes on the /api/auth path
// Protected routes — only authenticated users
//    `requireAuth()` will reject unauthenticated requests.
app.use("/api/openai", openaiRoutes); // Mount the OpenAI routes on the /api/openai path
app.use("/api/profilepic", profilepic); // Mount the profile picture routes on the /api/profilepic path
app.use("/api/qrcode", qrcodeRoute); // Mount the QR code routes on the /api/qrcode path

// Retrieve the MongoDB connection string and port from the environment variables
const DB = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      DB,
    );
    console.log("Connected to MongoDB");

    // Start the server only after a successful connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
};

startServer();
