const express = require('express');
const Customer = require('../models/Customer');
const Mechanic = require('../models/Mechanic');
const auth = require('../middleware/auth');

const router = express.Router();

// List all mechanics
router.get('/mechanics', auth, async (req, res) => {
  try {
    const mechanics = await Mechanic.find({}, '-password');
    res.json(mechanics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all customers
router.get('/customers', auth, async (req, res) => {
  try {
    const customers = await Customer.find({}, '-password');
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
