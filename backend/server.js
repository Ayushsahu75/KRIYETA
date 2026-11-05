// server.js
// This is the main entry point of your backend server

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware: allows Express to read JSON from request body
app.use(express.json());

// Middleware: allows the React frontend (on a different port) to talk to this server
app.use(cors());

// Serve uploaded images statically — accessible at /uploads/filename.jpg
app.use("/uploads", require("express").static("uploads"));

// Routes: any request to /api/auth goes to authRoutes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Routes: any request to /api/customers goes to customerRoutes
app.use("/api/customers", require("./routes/customerRoutes"));

// Routes: any request to /api/loans goes to loanRoutes
app.use("/api/loans", require("./routes/loanRoutes"));

// A simple test route to confirm the server is running
app.get("/", (req, res) => {
  res.send("KRIYETA Backend is Running!");
});

// Start the server on the port from .env, or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
