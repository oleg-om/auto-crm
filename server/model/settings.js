const mongoose = require('mongoose')
const uuid = require('uuid')

const Setting = new mongoose.Schema({
  helpphone: {
    type: String,
    required: false
  },
  lastKerchshina: {
    type: String,
    required: false
  },
  tyresAndWhellsSmallSeason: {
    type: String,
    required: false
  },
  tyresAndWhellsSmallMonth: {
    type: String,
    required: false
  },
  tyresSmallSeason: {
    type: String,
    required: false
  },
  tyresSmallMonth: {
    type: String,
    required: false
  },
  tyresAndWhellsBigSeason: {
    type: String,
    required: false
  },
  tyresAndWhellsBigMonth: {
    type: String,
    required: false
  },
  tyresBigSeason: {
    type: String,
    required: false
  },
  tyresBigMonth: {
    type: String,
    required: false
  },
  id: {
    type: String,
    unique: true,
    default: () => uuid.v4()
  }
})

module.exports = mongoose.model('settings', Setting)
