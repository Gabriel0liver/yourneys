'use strict';

require('dotenv').config();

const mongoose = require('mongoose');
const data = require('../../data/yourneys');

const Yourney = require('../../models/yourney.js');

mongoose.connect(process.env.MONGODB_URI, {
  keepAlive: true,
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE
})

// Yourney.remove({})
//   .then(() => {
//     return Yourney.create(data)
//   })
//   .then((data) => {
//     console.log('Data inserted')
//   })
//   .then(() => {
//     mongoose.connection.close()
//   })
//   .catch((err) => {
//     console.log(err)
//   })

  .then(() => {
    console.log('Connected to Mongo!');
    return Yourney.remove({});
  })
  .then(() => {
    // user1 = users.find();
    console.log('Empty db');
    return Yourney.insertMany(data);
  })
  .then((results) => {
    console.log('You have some yourneys', results.length);
    mongoose.connection.close();
  })
  .catch((error) => {
    console.log('There is a problem', error);
  });
