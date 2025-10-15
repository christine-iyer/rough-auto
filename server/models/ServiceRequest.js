const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  mechanicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mechanic' },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true }, // <-- add this
  mechanicName: { type: String },
  service: { type: String, required: true },
  vehicle: {
    vehicleMake: { type: String, required: true },
    vehicleModel: { type: String, required: true },
    vehicleYear: { type: Number, required: true }
  },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'question'], default: 'pending' },
  question: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
