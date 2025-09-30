const express = require('express');
const ServiceRequest = require('../models/ServiceRequest');
const Customer = require('../models/Customer');
const Mechanic = require('../models/Mechanic');
const auth = require('../middleware/auth');

const router = express.Router();

// Customer creates a service request
router.post('/', auth, async (req, res) => {
  try {
    const { mechanicId, vehicle, description } = req.body;
    const customerId = req.user.id;
    const serviceRequest = new ServiceRequest({
      customer: customerId,
      mechanic: mechanicId,
      vehicle,
      description,
      status: 'pending'
    });
    await serviceRequest.save();
    // Add to customer's serviceRequests
    await Customer.findByIdAndUpdate(customerId, { $push: { serviceRequests: serviceRequest._id } });
    // Add to mechanic's serviceRequests
    await Mechanic.findByIdAndUpdate(mechanicId, { $push: { serviceRequests: serviceRequest._id } });
    res.json(serviceRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mechanic updates service request status (accept/reject/question)
router.patch('/:id', auth, async (req, res) => {
  try {
    const { status, question } = req.body;
    const serviceRequest = await ServiceRequest.findById(req.params.id);
    if (!serviceRequest) return res.status(404).json({ error: 'Service request not found' });
    // Only mechanic assigned to request can update
    if (serviceRequest.mechanic.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    if (status) serviceRequest.status = status;
    if (question) serviceRequest.question = question;
    await serviceRequest.save();
    res.json(serviceRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all service requests for a mechanic
router.get('/mechanic/:mechanicId', auth, async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ mechanic: req.params.mechanicId }).populate('mechanic').populate('vehicle');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all service requests for a customer
router.get('/customer/:customerId', auth, async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ customer: req.params.customerId }).populate('customer').populate('vehicle');
    console.log(requests);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
