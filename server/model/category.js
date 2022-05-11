const mongoose = require('mongoose')
const uuid = require('uuid')

const Category = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: false
  },
  id: {
    type: String,
    unique: true,
    default: () => uuid.v4()
  }
})

module.exports = mongoose.model('categorys', Category)
