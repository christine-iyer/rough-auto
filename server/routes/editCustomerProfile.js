const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Edit customer profile
router.patch('/api/list/customers/:id', async (req, res) => {
	try {
		const customerId = req.params.id;
		const updateFields = {};
		// Only update allowed fields
		['customerName', 'email', 'password'].forEach(field => {
			if (req.body[field] !== undefined) updateFields[field] = req.body[field];
		});
		const updated = await Customer.findByIdAndUpdate(customerId, updateFields, { new: true });
		if (!updated) return res.status(404).json({ error: 'Customer not found' });
		res.json(updated);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;
