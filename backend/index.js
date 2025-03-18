import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Retrieve the MongoDB connection string from the environment variables
const DB = process.env.MONGO_URI;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Start the server only after a successful connection
    app.listen(8080, () => {
      console.log("Server is running on port 8080");
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
};

startServer();
