const mongoose = require('mongoose')
const uuid = require('uuid')

const Customer = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  mark: {
    type: String,
    required: false
  },
  model: {
    type: String,
    required: false
  },
  gen: {
    type: String,
    required: false
  },
  mod: {
    type: String,
    required: false
  },
  regnumber: {
    type: String,
    required: false
  },
  vinnumber: {
    type: String,
    required: false
  },
  id: {
    type: String,
    unique: true,
    default: () => uuid.v4()
  }
})

module.exports = mongoose.model('customers', Customer)
