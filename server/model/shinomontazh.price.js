const mongoose = require('mongoose')
const uuid = require('uuid')

const ShinomontazhPrice = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  R13: {
    type: Number,
    required: false
  },
  R14: {
    type: Number,
    required: false
  },
  R15: {
    type: Number,
    required: false
  },
  R16: {
    type: Number,
    required: false
  },
  R17: {
    type: Number,
    required: false
  },
  R18: {
    type: Number,
    required: false
  },
  R19: {
    type: Number,
    required: false
  },
  R20: {
    type: Number,
    required: false
  },
  R21: {
    type: Number,
    required: false
  },
  R22: {
    type: Number,
    required: false
  },
  R23: {
    type: Number,
    required: false
  },
  R24: {
    type: Number,
    required: false
  },
  number: {
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

module.exports = mongoose.model('shinomontazhprice', ShinomontazhPrice)
