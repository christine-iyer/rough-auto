const express = require('express');
const Customer = require('../models/Customer');
const Mechanic = require('../models/Mechanic');
const Service = require('../models/Service');
const auth = require('../middleware/auth');

const router = express.Router();
// /api/list/mechanics

// List all mechanics
router.get('/mechanics', auth, async (req, res) => {
  try {
    const mechanics = await Mechanic.find({}, '-password');
    res.json(mechanics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// api/list/customers
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
