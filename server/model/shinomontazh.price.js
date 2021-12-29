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
  R13C: {
    type: Number,
    required: false
  },
  R14C: {
    type: Number,
    required: false
  },
  R15C: {
    type: Number,
    required: false
  },
  R16C: {
    type: Number,
    required: false
  },
  R16Camb: {
    type: Number,
    required: false
  },
  R17C: {
    type: Number,
    required: false
  },
  R175: {
    type: Number,
    required: false
  },
  R195: {
    type: Number,
    required: false
  },
  R20240: {
    type: Number,
    required: false
  },
  R20280: {
    type: Number,
    required: false
  },
  R20320: {
    type: Number,
    required: false
  },
  R225: {
    type: Number,
    required: false
  },
  R245: {
    type: Number,
    required: false
  },
  R8: {
    type: Number,
    required: false
  },
  R9: {
    type: Number,
    required: false
  },
  R10: {
    type: Number,
    required: false
  },
  R12: {
    type: Number,
    required: false
  },
  R165: {
    type: Number,
    required: false
  },
  R25: {
    type: Number,
    required: false
  },
  R26: {
    type: Number,
    required: false
  },
  R28: {
    type: Number,
    required: false
  },
  R30: {
    type: Number,
    required: false
  },
  R32: {
    type: Number,
    required: false
  },
  R33: {
    type: Number,
    required: false
  },
  R34: {
    type: Number,
    required: false
  },
  R38: {
    type: Number,
    required: false
  },
  R42: {
    type: Number,
    required: false
  }
})

module.exports = mongoose.model('shinomontazhprice', ShinomontazhPrice)
