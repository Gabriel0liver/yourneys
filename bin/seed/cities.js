'use strict';

require('dotenv').config();

const mongoose = require('mongoose');
const data = require('../../data/cities');

const City = require('../../models/city.js');

mongoose.connect(process.env.MONGODB_URI, {
  keepAlive: true,
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE
})
  .then(() => {
    console.log('Connected to Mongo!');
    return City.remove({});
  })
  .then(() => {
    console.log('Empty db');
    return City.insertMany(data);
  })
  .then((results) => {
    console.log('You have some cities', results.length);
    mongoose.connection.close();
  })
  .catch((error) => {
    console.log('There is a problem', error);
  });
