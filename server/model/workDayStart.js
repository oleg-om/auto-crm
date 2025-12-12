const mongoose = require('mongoose')
const uuid = require('uuid')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const dateNow = new Date()
const WorkDayStart = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true,
    default: () =>
      `${dateNow.getDate()}.${
        dateNow.getMonth() + 1
      }.${dateNow.getFullYear()} ${dateNow.getHours()}:${dateNow
        .getMinutes()
        .toString()
        .replace(/^(\d)$/, '0$1')}`
  },
  endTime: {
    type: String,
    required: false
  },
  id: {
    type: String,
    unique: true,
    default: () => uuid.v4()
  }
})

WorkDayStart.index({ employeeId: 1, date: 1 }, { unique: true })
WorkDayStart.plugin(AutoIncrement, { inc_field: 'id_work_day_start' })

module.exports = mongoose.model('workDayStarts', WorkDayStart)

