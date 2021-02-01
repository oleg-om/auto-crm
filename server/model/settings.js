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
  id: {
    type: String,
    unique: true,
    default: () => uuid.v4()
  }
})

module.exports = mongoose.model('settings', Setting)
