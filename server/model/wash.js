const mongoose = require('mongoose')
const uuid = require('uuid')
const AutoIncrement = require('mongoose-sequence')(mongoose)
const statusTypes = require('../../common/enums/shinomontazh-statuses')

const Wash = new mongoose.Schema({
  employee: {
    type: Array,
    required: false
  },
  place: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: statusTypes,
    default: statusTypes[0]
  },
  regnumber: {
    type: String,
    required: false
  },
  class: {
    type: String,
    required: false
  },
  category: {
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
  discount: {
    type: String,
    required: false
  },
  tyre: {
    type: Array,
    required: false
  },
  services: {
    type: Array,
    required: false
  },
  material: {
    type: Array,
    required: false
  },
  comment: {
    type: String,
    required: false
  },
  id: {
    type: String,
    unique: true,
    default: () => uuid.v4()
  },
  date: {
    type: Date
  },
  dateStart: {
    type: Date
  },
  dateFinish: {
    type: Date
  },
  payment: {
    type: String,
    required: false
  },
  combTerm: {
    type: String,
    required: false
  },
  combCash: {
    type: String,
    required: false
  },
  box: {
    type: Number,
    required: false
  },
  customerId: {
    type: String,
    required: false
  }
})

Wash.plugin(AutoIncrement, { inc_field: 'id_washs' })

module.exports = mongoose.model('washs', Wash)
