const mongoose = require('mongoose')
const uuid = require('uuid')
const AutoIncrement = require('mongoose-sequence')(mongoose)
const statusTypes = require('../../common/enums/shinomontazh-statuses')

const Shinomontazh = new mongoose.Schema({
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
  kuzov: {
    type: String,
    required: false
  },
  diametr: {
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
  // datePreentry: {
  //   type: Date,
  //   required: false
  // },
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
  // for preentry
  box: {
    type: Number,
    required: false
  },
  access: {
    type: String,
    required: false
    // default: 'true'
  },
  datePreentry: {
    type: Date,
    required: false
  },
  employeeplace: {
    type: String,
    required: false
  },
  employeePreentry: {
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
  storage: {
    type: Number,
    required: false
  },
  customerId: {
    type: String,
    required: false
  },
  groupCount: {
    type: Number,
    required: false
  },
  beznalPaid: {
    type: Date,
    required: false
  },
  organizationId: {
    type: String,
    required: false
  }
})

Shinomontazh.plugin(AutoIncrement, { inc_field: 'id_shinomontazhs' })

// Составной индекс для оптимизации запросов getFiltered
Shinomontazh.index({
  place: 1,
  id_shinomontazhs: 1,
  regnumber: 1,
  'employee.id': 1,
  dateStart: -1
})

// Индекс для быстрого поиска по dateStart
Shinomontazh.index({ dateStart: -1 })

// Индекс для поиска по месту
Shinomontazh.index({ place: 1, dateStart: -1 })

module.exports = mongoose.model('shinomontazhs', Shinomontazh)
