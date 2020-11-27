const mongoose = require('mongoose')
const uuid = require('uuid')
const AutoIncrement = require('mongoose-sequence')(mongoose)
const statusTypes = require('../../common/enums/task-statuses')

const dateNow = new Date()
const Task = new mongoose.Schema({
  employee: {
    type: String,
    required: true
  },
  place: {
    type: String,
    required: false
  },
  process: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: statusTypes,
    default: statusTypes[0]
  },
  regnumber: {
    type: String,
    required: true
  },
  vinnumber: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  engine: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: false
  },
  preorder: {
    type: String,
    required: true
  },
  prepay: {
    type: String,
    required: false
  },
  comment: {
    type: String,
    required: false
  },
  uuid: {
    type: String,
    unique: true,
    default: () => uuid.v4()
  },
  date: {
    type: String,
    default: () =>
      `${dateNow.getDate()}.${
        dateNow.getMonth() + 1
      }.${dateNow.getFullYear()} ${dateNow.getHours()}:${dateNow.getMinutes()}`
  }
})

Task.plugin(AutoIncrement, { inc_field: 'id_task' })

module.exports = mongoose.model('tasks', Task)
