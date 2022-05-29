const mongoose = require('mongoose')
const uuid = require('uuid')

const WashPrice = new mongoose.Schema({
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
  legk: {
    type: Number,
    required: false
  },
  parketnik: {
    type: Number,
    required: false
  },
  jeep: {
    type: Number,
    required: false
  },
  microbus: {
    type: Number,
    required: false
  },
  legkCom: {
    type: Number,
    required: false
  },
  gruzPersonal: {
    type: Number,
    required: false
  },
  gruzCom: {
    type: Number,
    required: false
  },
  gruzSpec: {
    type: Number,
    required: false
  }
})

module.exports = mongoose.model('washprice', WashPrice)
