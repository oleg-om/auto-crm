const mongoose = require('mongoose')
const uuid = require('uuid')

const Customer = new mongoose.Schema({
  name: {
    type: String,
    required: false
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
    required: true
  },
  model: {
    type: String,
    required: true
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
  kuzov: {
    type: String,
    required: false
  },
  diametr: {
    type: String,
    required: false
  },
  class: {
    type: String,
    required: false
  },
  category: {
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
