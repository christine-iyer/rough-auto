const express = require('express');
const router = express.Router();        
// GET /api/services - List all services
router.get('/', (req, res) => {
  res.json([
    "Oil Change",
    "Brake Repair",
    "Engine Diagnostics",
    "Transmission",
    "Tire Service"
  ]);
});

module.exports = router;