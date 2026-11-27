// models/Loan.js

const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    jewelleryType: { type: String, required: true },
    weight:        { type: Number, required: true },
    carat:         { type: Number, required: true },
    amount:        { type: Number, required: true },
    interestRate:  { type: Number, required: true },
    startDate:     { type: Date, default: Date.now },
    imageUrl:      { type: String, default: "" },

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },

    // Loan close hone par store hoga
    closeDate:   { type: Date, default: null },
    paidAmount:  { type: Number, default: null }, // Final amount customer ne diya
  },
  { timestamps: true }
);

module.exports = mongoose.model("Loan", loanSchema);
