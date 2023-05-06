const mongoose = require('mongoose')
const uuid = require('uuid')

const WindowPrice = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: false
  },
  free: {
    type: String,
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
  },
  price: {
    type: Number,
    required: false
  }
})

module.exports = mongoose.model('windowprice', WindowPrice)
