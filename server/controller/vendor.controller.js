const Vendor = require('../model/vendor')

exports.getAll = async (req, res) => {
  const list = await Vendor.find({})
  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const vendor = await Vendor.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: vendor })
}

exports.update = async (req, res) => {
  let vendor = await Vendor.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, useFindAndModify: false }
  )
  vendor = await Vendor.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: vendor })
}

exports.create = async (req, res) => {
  const vendor = new Vendor(req.body)
  await vendor.save()
  return res.json({ status: 'ok', data: vendor })
}

exports.delete = async (req, res) => {
  await Vendor.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}
