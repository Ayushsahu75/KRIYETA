// models/Customer.js
// This defines the shape of a Customer document in MongoDB

const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Name is mandatory
    },
    phone: {
      type: String,
      required: true, // Phone number is mandatory
    },
    address: {
      type: String,
      required: true, // Address is mandatory
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Export the model so routes/controllers can use it
module.exports = mongoose.model("Customer", customerSchema);
