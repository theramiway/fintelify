const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// const path = require("path"); // <--- REMOVE: Not strictly needed for basic config
const cors = require("cors");

// Load environment variables
// Change: Simplified config. In production, this does nothing (as it should), 
// but locally it looks for standard .env
dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// --- Middleware ---

// Change: CORS Configuration for Production
// This allows your React app to talk to this backend once deployed.
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "https://YOUR-FRONTEND-URL.onrender.com"],
    credentials: true // Important if you use cookies/sessions
}));

app.use(express.json());

// --- MongoDB Connection Function ---
const connectDB = async () => {
  if (!MONGO_URI) {
    console.error("❌ FATAL ERROR: MONGO_URI is not defined.");
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
const authRoutes = require("./routes/authRoutes");

app.use("/api/goals", goalRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/insights", insightRoutes);
app.use("/api/auth", authRoutes);

// Simple root route for testing
app.get("/", (req, res) => {
  res.send("Finance App Backend API is running... 💰");
});

// --- Start Server ---
connectDB().then(() => {
  app.listen(PORT, () =>
    // Change: Removed 'localhost' to avoid confusion in cloud logs
    console.log(`🚀 Server running on port ${PORT}`)
  );
});
