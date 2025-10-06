const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rough-auto', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB (Data baseconnected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
// for api/auth/signup/customer, api/auth/signup/mechanic, api/auth/signup/admin, api/auth/login
app.use('/api/auth', require('./routes/auth'));
// for  /api/service-request/mechanic/:mechanicId, /api/service-request/customer/:customerId,  /api/service-request, /api/service-request/:id
app.use('/api/service-request', require('./routes/serviceRequest'));
// for /api/list/customers, /api/list/mechanics
app.use('/api/list', require('./routes/list'));
// for /api/edit-mechanic/:mechanicId
app.use('/api/edit-mechanic', require('./routes/editMechanicProfile'));
// for /api/edit-customer/:customerId
app.use('/api/edit-customer', require('./routes/editCustomerProfile'));               
// for /api/services
app.use('/api/services', require('./routes/services'));
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
