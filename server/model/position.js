const mongoose = require('mongoose')
const uuid = require('uuid')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const dateNow = new Date()

const DutySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  isQuantitative: {
    type: Boolean,
    required: false,
    default: false
  },
  order: {
    type: Number,
    required: false,
    default: 0
  }
})

const Position = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  id: {
    type: String,
    unique: true,
    default: () => uuid.v4()
  },
  duties: {
    type: [DutySchema],
    required: false,
    default: []
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

Position.plugin(AutoIncrement, { inc_field: 'id_position' })

module.exports = mongoose.model('positions', Position)

