const mongoose = require('mongoose')
const uuid = require('uuid')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const Storage = new mongoose.Schema({
  employee: {
    type: String,
    required: true
  },
  place: {
    type: String,
    required: true
  },
  currentplace: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: false
  },
  regnumber: {
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
  // date: {
  //   type: String,
  //   default: () =>
  //     `${dateNow.getDate()}.${
  //       dateNow.getMonth() + 1
  //     }.${dateNow.getFullYear()} ${dateNow.getHours()}:${dateNow
  //       .getMinutes()
  //       .toString()
  //       .replace(/^(\d)$/, "0$1")}`,
  // },
  date: {
    type: Date,
    required: false
  },
  dateInWork: {
    type: String,
    required: false
  },
  dateStart: {
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
  datePrint: {
    type: String,
    required: false
  },
  statusDates: {
    type: Array,
    required: false
  },
  payment: {
    type: String,
    required: false
  },
  cancelReason: {
    type: String,
    required: false
  }
})

Storage.plugin(AutoIncrement, { inc_field: 'id_storages' })

module.exports = mongoose.model('storages', Storage)
