const mongoose = require('mongoose')
const uuid = require('uuid')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const dateNow = new Date()

const ChecklistItemSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      required: false,
      default: 0
    }
  },
  { _id: true }
)

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
  hasChecklist: {
    type: Boolean,
    required: false,
    default: false
  },
  checklistItems: {
    type: [ChecklistItemSchema],
    required: false,
    default: []
  },
  completionTimeMinutes: {
    type: Number,
    required: false,
    default: null
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
  workDayStartTime: {
    type: String,
    required: false,
    default: null
  },
  workDayEndTime: {
    type: String,
    required: false,
    default: null
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

