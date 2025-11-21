const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "Server is running",
    port: PORT,
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development',
    mongoUri: process.env.MONGO_URI ? 'Set' : 'Missing',
    timestamp: new Date().toISOString()
  });
});

app.get("/api", (req, res) => {
  res.send("✅ API is working fine!");
});

app.get("/test-db", async (req, res) => {
  try {
    if (!process.env.MONGO_URI) {
      return res.status(500).json({ 
        error: "MONGO_URI environment variable is missing" 
      });
    }

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "SkdData",
    });

    res.json({ 
      status: "MongoDB connection successful",
      database: "SkdData"
    });
  } catch (error) {
    res.status(500).json({ 
      error: "MongoDB connection failed",
      message: error.message 
    });
  }
});

async function startServer() {
  try {
    console.log("🚀 Starting diagnostic server...");
    console.log("📍 Port:", PORT);
    console.log("🌍 Environment:", process.env.NODE_ENV || 'development');
    console.log("🔗 MongoDB URI:", process.env.MONGO_URI ? 'Set' : 'Missing');
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Diagnostic server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server startup error:", err.message);
    process.exit(1);
  }
}

startServer();