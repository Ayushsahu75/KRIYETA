const express = require("express");
const router  = express.Router();

const { createCustomer, getAllCustomers, updateCustomer, deleteCustomer } = require("../controllers/customerController");
const protect = require("../middleware/authMiddleware");

// Apply protect middleware to all routes
router.use(protect);

router.get("/",    getAllCustomers);   // GET    /api/customers
router.post("/",   createCustomer);   // POST   /api/customers
router.put("/:id", updateCustomer);   // PUT    /api/customers/:id
router.delete("/:id", deleteCustomer);// DELETE /api/customers/:id

module.exports = router;
