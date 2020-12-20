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
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: false
  },
  type: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: String,
    default: new Date()
  },
  id: {
    type: String,
    unique: true,
    default: () => uuid.v4()
  }
})

module.exports = mongoose.model('material', Material)
