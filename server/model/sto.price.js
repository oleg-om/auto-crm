const mongoose = require('mongoose')
const uuid = require('uuid')

const StoPrice = new mongoose.Schema({
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
  R210107first: {
    type: Number,
    required: false
  },
  R210107second: {
    type: Number,
    required: false
  },
  R210107third: {
    type: Number,
    required: false
  },
  R210809first: {
    type: Number,
    required: false
  },
  R210809second: {
    type: Number,
    required: false
  },
  R210809third: {
    type: Number,
    required: false
  },
  R2110PrioraFirst: {
    type: Number,
    required: false
  },
  R2110PrioraSecond: {
    type: Number,
    required: false
  },
  R2110PrioraThird: {
    type: Number,
    required: false
  },
  foreignFirst: {
    type: Number,
    required: false
  },
  foreignSecond: {
    type: Number,
    required: false
  },
  foreignThird: {
    type: Number,
    required: false
  },
  cardAmbulanceForeign: {
    type: Number,
    required: false
  },
  cardAmbulanceOur: {
    type: Number,
    required: false
  },
  minGazel: {
    type: Number,
    required: false
  },
  minLoganDuster: {
    type: Number,
    required: false
  }
})

module.exports = mongoose.model('stoprice', StoPrice)
