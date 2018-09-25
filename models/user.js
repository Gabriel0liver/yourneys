'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: 'a brief description about me'
  },
  profilepic: {
    type: String,
    default: 'https://image.flaticon.com/icons/png/512/146/146005.png'

  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
