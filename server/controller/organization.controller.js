const Organization = require('../model/organization')

exports.getAll = async (req, res) => {
  const list = await Organization.find({})
  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const organization = await Organization.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: organization })
}

exports.update = async (req, res) => {
  let organization = await Organization.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, useFindAndModify: false }
  )
  organization = await Organization.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: organization })
}

exports.create = async (req, res) => {
  const organization = new Organization(req.body)
  await organization.save()
  return res.json({ status: 'ok', data: organization })
}

exports.delete = async (req, res) => {
  await Organization.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}
