const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// --- Middleware ---
app.use(cors());                 // Enable CORS
app.use(express.json());         // Parse JSON request bodies

// --- MongoDB Connection Function ---
const connectDB = async () => {
  if (!MONGO_URI) {
    console.error("❌ FATAL ERROR: MONGO_URI is not defined in the .env file.");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// --- Routes ---
const goalRoutes = require("./routes/goalRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const insightRoutes = require("./routes/insightRoutes");
const authRoutes = require("./routes/authRoutes"); // <--- NEW

app.use("/api/goals", goalRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/insights", insightRoutes);
app.use("/api/auth", authRoutes); // <--- NEW (login/register)

// Simple root route for testing
app.get("/", (req, res) => {
  res.send("Finance App Backend API is running... 💰");
});

// --- Start Server and Connect to DB ---
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
});
