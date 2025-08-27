const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  mechanic: { type: mongoose.Schema.Types.ObjectId, ref: 'Mechanic' },
  vehicle: {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true }
  },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'question'], default: 'pending' },
  question: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
