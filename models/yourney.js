'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const yourneySchema = new Schema({
  owner: {
    type: ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  snippet: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: Date
  },
  days: {
    type: String,
    enum: ['1', '2', '3', '4', '5+'],
    required: true
  },
  dayOne: {
    type: String
  },
  addedBy: {
    type: ObjectId,
    ref: 'User'
  }
})

const Yourney = mongoose.model('Yourney', yourneySchema)

module.exports = Yourney
