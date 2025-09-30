const express = require('express');
const router = express.Router();
const Mechanic = require('../models/Mechanic');

// Edit mechanic profil

router.patch(`/:mechanicId`, async (req, res) => {
	try {
		const mechanicId = req.params.mechanicId;
		const updateFields = {};
		// Only update allowed fields
		['mechanicName', 'email', 'services', 'notes', 'files'].forEach(field => {
			if (req.body[field] !== undefined) updateFields[field] = req.body[field];
		});
		const updated = await Mechanic.findByIdAndUpdate(mechanicId, updateFields, { new: true });
		if (!updated) return res.status(404).json({ error: 'Mechanic not found' });
		res.json(updated);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;
