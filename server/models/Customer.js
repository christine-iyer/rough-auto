const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const customerSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, default: 'customer' },
  vehicles: [{
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true }
  }],
  serviceRequests: { type: [mongoose.Schema.Types.ObjectId], ref: 'ServiceRequest', default: [] }
});

customerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('Customer', customerSchema);
