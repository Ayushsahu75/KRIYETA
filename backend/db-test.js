require('dotenv').config();
const mongoose = require('mongoose');

console.log("--- MongoDB Auth Diagnostic ---");
console.log("MONGO_URI detected:", process.env.MONGO_URI ? "YES (Found)" : "NO (Empty)");

const uri = process.env.MONGO_URI;
// Masking password for security in console
const maskedUri = uri ? uri.replace(/:([^@]+)@/, ":****@") : "N/A";
console.log("Connecting to:", maskedUri);

mongoose.connect(uri)
  .then(() => {
    console.log("✅ SUCCESS: Connected to MongoDB!");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ FAILURE: Connection failed.");
    console.error("Error Name:", err.name);
    console.error("Error Message:", err.message);
    if (err.message.includes("authentication failed") || err.message.includes("bad auth")) {
      console.log("\n⚠️ SUGGESTION: Your password or username in .env is WRONG.");
    }
    process.exit(1);
  });
