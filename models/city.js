'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const citySchema = new Schema({
  location: {
    type: String,
    required: true,
    lowercase: true
  },
  img: {
    type: String,
    required: true
  }
});

const City = mongoose.model('City', citySchema);

module.exports = City;
