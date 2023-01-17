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

Employee.plugin(AutoIncrement, { inc_field: 'id_employee' })

module.exports = mongoose.model('employees', Employee)
