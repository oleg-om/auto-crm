const mongoose = require('mongoose')
const uuid = require('uuid')

const Organization = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: false
  },
  id: {
    type: String,
    unique: true,
    default: () => uuid.v4()
  }
})

module.exports = mongoose.model('organizations', Organization)
