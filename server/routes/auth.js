const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Customer = require('../models/Customer');
const Mechanic = require('../models/Mechanic');
const Admin = require('../models/Admin');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'thisisasecret';

// Customer Signup
router.post('/signup/customer', async (req, res) => {
  try {
    const { customerName, email, password } = req.body;
    const existing = await Customer.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });
    const customer = new Customer({ customerName, email, password });
    await customer.save();
    const token = jwt.sign({ id: customer._id, userType: 'customer' }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    console.error('Customer signup error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Mechanic Signup
router.post('/signup/mechanic', async (req, res) => {
  try {
    const { mechanicName, email, password } = req.body;
    const existing = await Mechanic.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });
    const mechanic = new Mechanic({ mechanicName, email, password });
    await mechanic.save();
    const token = jwt.sign({ id: mechanic._id, userType: 'mechanic' }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Signup
router.post('/signup/admin', async (req, res) => {
  try {
    const { adminUserName, email, password } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });
    const admin = new Admin({ adminUserName, email, password });
    await admin.save();
    const token = jwt.sign({ id: admin._id, userType: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login (all users)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await Customer.findOne({ email });
    let userType = 'customer';
    if (!user) {
      user = await Mechanic.findOne({ email });
      userType = 'mechanic';
    }
    if (!user) {
      user = await Admin.findOne({ email });
      userType = 'admin';
    }
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    // Add this line before signing the token
    console.log('JWT_SECRET in login:', JWT_SECRET);

    const token = jwt.sign({ id: user._id, userType }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
