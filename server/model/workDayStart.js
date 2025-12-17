const mongoose = require('mongoose')
const uuid = require('uuid')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const WorkDayStart = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime: {
    type: Date,
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

