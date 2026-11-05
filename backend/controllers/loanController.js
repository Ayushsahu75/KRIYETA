// controllers/loanController.js

const Loan = require("../models/Loan");

// Interest Calculation Helper
function calculateInterest(amount, rate, startDate) {
  const now = new Date();
  const start = new Date(startDate);
  const diffDays = Math.max(0, (now - start) / (1000 * 60 * 60 * 24));
  const months = diffDays / 30;
  const interest = (amount * rate * months) / 100;
  return {
    months: Number(months.toFixed(1)),
    interest: Math.round(interest),
    total: Math.round(amount + interest),
  };
}

// ✅ Create Loan
const createLoan = async (req, res) => {
  try {
    const { customerId, jewelleryType, weight, carat, amount, interestRate, startDate } = req.body;

    let imageUrl = "";
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const loan = await Loan.create({
      customerId, jewelleryType, weight, carat, amount, interestRate,
      startDate: startDate || new Date(),
      imageUrl,
    });

    res.status(201).json(loan);
  } catch (error) {
    console.error("CREATE LOAN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Loans + Live Interest
const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().populate("customerId", "name phone address");

    const updatedLoans = loans.map((loan) => {
      const calc = calculateInterest(Number(loan.amount), Number(loan.interestRate), loan.startDate);
      return { ...loan.toObject(), months: calc.months, interest: calc.interest, total: calc.total };
    });

    res.status(200).json(updatedLoans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Close Loan (with closeDate + paidAmount)
const closeLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const { paidAmount } = req.body; // Frontend se final amount aayega

    const loan = await Loan.findById(id);
    if (!loan) return res.status(404).json({ message: "Loan not found" });
    if (loan.status === "closed") return res.status(400).json({ message: "Loan already closed" });

    loan.status    = "closed";
    loan.closeDate = new Date();
    loan.paidAmount = paidAmount || null;

    await loan.save();
    res.json({ message: "Loan closed successfully", loan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Dashboard Stats
const getStats = async (req, res) => {
  try {
    const loans = await Loan.find();

    let totalAmount   = 0;
    let totalInterest = 0;
    let activeLoans   = 0;
    let closedLoans   = 0;

    loans.forEach((loan) => {
      totalAmount += loan.amount;
      if (loan.status === "active") {
        activeLoans++;
        const calc = calculateInterest(loan.amount, loan.interestRate, loan.startDate);
        totalInterest += calc.interest;
      } else {
        closedLoans++;
      }
    });

    res.json({
      totalLoans: loans.length,
      activeLoans,
      closedLoans,
      totalAmount,
      totalInterest: Math.round(totalInterest),
      totalRecoverable: Math.round(totalAmount + totalInterest),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createLoan, getAllLoans, closeLoan, getStats };
