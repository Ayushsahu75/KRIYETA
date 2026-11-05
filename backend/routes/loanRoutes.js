const express = require("express");
const router  = express.Router();

const { createLoan, getAllLoans, closeLoan, getStats } = require("../controllers/loanController");
const upload = require("../middleware/upload");
const protect = require("../middleware/authMiddleware");

// Apply protect middleware to all routes
router.use(protect);

router.get("/stats", getStats);            // GET  /api/loans/stats
router.get("/", getAllLoans);              // GET  /api/loans
router.post("/", upload.single("image"), createLoan); // POST /api/loans
router.put("/:id/close", closeLoan);      // PUT  /api/loans/:id/close

module.exports = router;
