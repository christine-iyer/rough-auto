const mongoose = require('mongoose');
const Customer = require('./models/Customer');
const Mechanic = require('./models/Mechanic');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const customers = [
  {
    customerName: 'Alice Smith',
    email: 'alice@example.com',
    password: 'password123',
    vehicles: [
      { make: 'Toyota', model: 'Camry', year: 2018 },
      { make: 'Honda', model: 'Civic', year: 2020 }
    ]
  },
  {
    customerName: 'Bob Johnson',
    email: 'bob@example.com',
    password: 'password123',
    vehicles: [
      { make: 'Ford', model: 'Focus', year: 2015 }
    ]
  },
  {
    customerName: 'Carol Lee',
    email: 'carol@example.com',
    password: 'password123',
    vehicles: [
      { make: 'Chevrolet', model: 'Malibu', year: 2017 }
    ]
  },
  {
    customerName: 'David Kim',
    email: 'david@example.com',
    password: 'password123',
    vehicles: [
      { make: 'Nissan', model: 'Altima', year: 2019 }
    ]
  },
  {
    customerName: 'Eva Brown',
    email: 'eva@example.com',
    password: 'password123',
    vehicles: [
      { make: 'Hyundai', model: 'Elantra', year: 2021 }
    ]
  }
];

const mechanics = [
  {
    mechanicName: 'Mike Miller',
    email: 'mike@example.com',
    password: 'password123'
  },
  {
    mechanicName: 'Nina Patel',
    email: 'nina@example.com',
    password: 'password123'
  },
  {
    mechanicName: 'Oscar Gomez',
    email: 'oscar@example.com',
    password: 'password123'
  },
  {
    mechanicName: 'Paul White',
    email: 'paul@example.com',
    password: 'password123'
  },
  {
    mechanicName: 'Quinn Black',
    email: 'quinn@example.com',
    password: 'password123'
  }
];

async function seed() {
  await Customer.deleteMany({});
  await Mechanic.deleteMany({});
  await Customer.insertMany(customers);
  await Mechanic.insertMany(mechanics);
  console.log('Dummy data inserted');
  mongoose.disconnect();
}

seed();
