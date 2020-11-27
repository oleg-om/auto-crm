const Customer = require('../model/customer')

exports.getAll = async (req, res) => {
  const list = await Customer.find({})
  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const customer = await Customer.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: customer })
}

exports.update = async (req, res) => {
  let customer = await Customer.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, useFindAndModify: false }
  )
  customer = await Customer.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: customer })
}

exports.create = async (req, res) => {
  const customer = new Customer(req.body)
  await customer.save()
  return res.json({ status: 'ok', data: customer })
}

exports.delete = async (req, res) => {
  await Customer.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}
