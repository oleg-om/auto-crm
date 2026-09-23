const mongoose = require('mongoose')
const uuid = require('uuid')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const dateNow = new Date()
const Employee = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: false
  },
  role: {
    type: Array,
    required: false
  },
  address: {
    type: Array,
    required: false
  },
  numberId: {
    type: String,
    required: false
  },
  // Number tapped on the electronic journal kiosk grid (client/features/journal-kiosk) to open
  // this employee's simplified journal screen - distinct from numberId above (used for tagging
  // this employee on service order rows).
  journalNumber: {
    type: Number,
    required: false
  },
  class: {
    type: String,
    required: false
  },
  id: {
    type: String,
    unique: true,
    default: () => uuid.v4()
  },
  stoPercent: {
    type: Number,
    required: false
  },
  shinomontazhPercent: {
    type: Number,
    required: false
  },
  oformlen: {
    type: Boolean,
    required: false
  },
  oformlenNalog: {
    type: Number,
    required: false
  },
  // есть карта у сотрудника или нет
  // card: {
  //   type: Boolean,
  //   required: false
  // },
  cardSum: {
    type: Number,
    required: false
  },
  positionId: {
    type: String,
    required: false
  },
  positionIdAdditional: {
    type: String,
    required: false
  },
  active: {
    type: Boolean,
    required: false,
    default: true
  },
  date: {
    type: String,
    default: () =>
      `${dateNow.getDate()}.${
        dateNow.getMonth() + 1
      }.${dateNow.getFullYear()} ${dateNow.getHours()}:${dateNow
        .getMinutes()
        .toString()
        .replace(/^(\d)$/, '0$1')}`
  }
})

// journalNumber is optional, so uniqueness only applies to employees that actually have one -
// a plain unique index would treat every null/missing value as a duplicate.
Employee.index(
  { journalNumber: 1 },
  { unique: true, partialFilterExpression: { journalNumber: { $type: 'number' } } }
)

Employee.plugin(AutoIncrement, { inc_field: 'id_employee' })

module.exports = mongoose.model('employees', Employee)
