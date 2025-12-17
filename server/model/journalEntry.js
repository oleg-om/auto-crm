const mongoose = require('mongoose')
const uuid = require('uuid')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const dateNow = new Date()
const JournalEntry = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true
  },
  positionId: {
    type: String,
    required: true
  },
  dutyId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  },
  comment: {
    type: String,
    required: false
  },
  startTime: {
    type: Date,
    required: false
  },
  endTime: {
    type: Date,
    required: false
  },
  id: {
    type: String,
    unique: true,
    default: () => uuid.v4()
  },
  createdAt: {
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

JournalEntry.plugin(AutoIncrement, { inc_field: 'id_journal_entry' })

module.exports = mongoose.model('journalEntries', JournalEntry)

