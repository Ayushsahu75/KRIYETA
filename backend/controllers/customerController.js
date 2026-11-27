// controllers/customerController.js

const Customer = require("../models/Customer");
const Loan = require("../models/Loan");

// ✅ Create Customer
const createCustomer = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    if (!phone || phone.toString().length !== 10)
      return res.status(400).json({ message: "Phone number 10 digits ka hona chahiye" });

    const existing = await Customer.findOne({ userId: req.user.id, phone });
    if (existing)
      return res.status(400).json({ message: `Customer already exists: ${existing.name} (${existing.phone})` });

    const customer = await Customer.create({ userId: req.user.id, name, phone, address });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ userId: req.user.id });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Customer
const updateCustomer = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    if (phone && phone.toString().length !== 10)
      return res.status(400).json({ message: "Phone number 10 digits ka hona chahiye" });

    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name, phone, address },
      { new: true }
    );

    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Customer (loan check ke saath)
const deleteCustomer = async (req, res) => {
  try {
    const loans = await Loan.find({
      customerId: req.params.id,
      userId: req.user.id,
      status: "active",
    });
    if (loans.length > 0)
      return res.status(400).json({ message: `Cannot delete — customer ke ${loans.length} active loan(s) hain` });

    const customer = await Customer.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCustomer, getAllCustomers, updateCustomer, deleteCustomer };
