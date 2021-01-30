const mongoose = require('mongoose')
const uuid = require('uuid')
const AutoIncrement = require('mongoose-sequence')(mongoose)
const statusTypes = require('../../common/enums/task-statuses')

const Tyre = new mongoose.Schema({
  employee: {
    type: String,
    required: false
  },
  place: {
    type: String,
    required: false
  },
  process: {
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
  vinnumber: {
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
  gen: {
    type: String,
    required: false
  },
  mod: {
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
  preorder: {
    type: Array,
    required: false
  },
  order: {
    type: Array,
    required: false
  },
  prepay: {
    type: String,
    required: false
  },
  comment: {
    type: String,
    required: false
  },
  commentOrder: {
    type: String,
    required: false
  },
  id: {
    type: String,
    unique: true,
    default: () => uuid.v4()
  },
  date: {
    type: Date,
    required: false
  },
  dateInWork: {
    type: String,
    required: false
  },
  dateFinish: {
    type: String,
    required: false
  },
  dateMiscall: {
    type: String,
    required: false
  },
  dateCancel: {
    type: String,
    required: false
  },
  cancelReason: {
    type: String,
    required: false
  },
  siteNumber: {
    type: String,
    required: false
  }
})

Tyre.plugin(AutoIncrement, { inc_field: 'id_tyres' })

module.exports = mongoose.model('tyres', Tyre)
