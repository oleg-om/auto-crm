const mongoose = require('mongoose')

const EmployeeReport = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: false
  },
  date: {
    type: String,
    required: false
  },
  month: {
    type: String,
    required: false
  },
  val: {
    type: Number,
    required: false
  },
  type: {
    type: String,
    required: false
  },
  comment: {
    type: String,
    required: false
  }
})

module.exports = mongoose.model('employee_report', EmployeeReport)
