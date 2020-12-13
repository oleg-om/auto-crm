const mongoose = require('mongoose')
const uuid = require('uuid')
const razvalList = require('../../client/lists/razval.statuses')

const Oil = new mongoose.Schema({
  employee: {
    type: String,
    required: false
  },
  place: {
    type: String,
    required: false
  },
  employeeplace: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  date: {
    type: String,
    required: false
  },
  mark: {
    type: String,
    required: false
  },
  model: {
    type: String,
    required: false
  },
  status: {
    type: String,
    default: razvalList[0]
  },
  time: {
    type: String,
    required: false
  },
  dateofcreate: {
    type: String,
    required: false
  },
  id: {
    type: String,
    unique: true,
    default: () => uuid.v4()
  },
  access: {
    type: String,
    default: 'true'
  }
})

module.exports = mongoose.model('oil', Oil)
