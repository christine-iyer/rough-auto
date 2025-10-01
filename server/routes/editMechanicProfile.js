// TEMP DEBUG: List all mechanics and their _id values
router.get('/debug/all', async (req, res) => {
	try {
		const mechanics = await Mechanic.find({}, 'mechanicName _id');
		res.json(mechanics);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});
const express = require('express');
const router = express.Router();
const Mechanic = require('../models/Mechanic');

// Edit mechanic profil
router.get('/:_id', async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(req.params._id, '-password');
    if (!mechanic) return res.status(404).json({ error: 'Mechanic not found' });
    res.json(mechanic);
    console.log('Fetching mechanic:', req.params._id);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch(`/:_id`, async (req, res) => {
	try {
		const _id = req.params._id;
		const updateFields = {};
		// Only update allowed fields
		['mechanicName', 'email', 'services', 'notes', 'files'].forEach(field => {
			if (req.body[field] !== undefined) updateFields[field] = req.body[field];
		});
		const updated = await Mechanic.findByIdAndUpdate(_id, updateFields, { new: true });
		if (!updated) return res.status(404).json({ error: 'Mechanic not found' });
		res.json(updated);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;
