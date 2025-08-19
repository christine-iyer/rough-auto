const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const mechanicSchema = new mongoose.Schema({
  mechanicName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, default: 'mechanic' },
  serviceRequests: { type: [mongoose.Schema.Types.ObjectId], ref: 'ServiceRequest', default: [] }
});

mechanicSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('Mechanic', mechanicSchema);
