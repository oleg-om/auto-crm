const Employee = require('../model/employee')

exports.getAll = async (req, res) => {
  const list = await Employee.find({})
  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const employee = await Employee.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: employee })
}

exports.update = async (req, res) => {
  let employee = await Employee.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, useFindAndModify: false }
  )
  employee = await Employee.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: employee })
}

exports.create = async (req, res) => {
  const employee = new Employee(req.body)
  await employee.save()
  return res.json({ status: 'ok', data: employee })
}

exports.delete = async (req, res) => {
  await Employee.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}
