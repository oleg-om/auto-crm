const mongoose = require('mongoose')
const uuid = require('uuid')

const Material = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  artikul: {
    type: String,
    required: false
  },
  price: {
    type: String,
    required: false
  },
  quantity: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  date: {
    type: String,
    required: false
  },
  id: {
    type: String,
    unique: true,
    default: () => uuid.v4()
  }
})

module.exports = mongoose.model('material', Material)
