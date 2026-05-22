const EmployeeReport = require('../model/EmployeeReport')
const { caseInsensitiveRegex } = require('../utils/regex')

exports.getAll = async (req, res) => {
  const list = await EmployeeReport.find({})
  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const employee = await EmployeeReport.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: employee })
}

exports.getSingle = async (req, res) => {
  const employee = await EmployeeReport.find({
    employeeId: req.params.employee
  })
  return res.json({ status: 'ok', data: employee })
}

exports.getMonth = async (req, res) => {
  const { yearmonth } = req.query

  const list = await EmployeeReport.find({
    date: caseInsensitiveRegex(yearmonth)
  })

  return res.json({ status: 'ok', data: list })
}

exports.update = async (req, res) => {
  const employee = await EmployeeReport.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: employee })
}

exports.create = async (req, res) => {
  const _id = req.body?._id

  if (_id) {
    let emp = await EmployeeReport.findOneAndUpdate(
      { _id: req.body?._id },
      { $set: req.body },
      { upsert: false }
    )
    emp = await EmployeeReport.findOne({ _id: req.body?._id })
    return res.json({ status: 'ok', data: emp })
  }
  const emp = new EmployeeReport(req.body)
  await emp.save()
  return res.json({ status: 'ok', data: emp })
}

exports.delete = async (req, res) => {
  await EmployeeReport.deleteOne({ _id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}
