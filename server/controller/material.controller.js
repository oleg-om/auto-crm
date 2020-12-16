const Material = require('../model/materials')

exports.getAll = async (req, res) => {
  const list = await Material.find({})
  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const material = await Material.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: material })
}

exports.update = async (req, res) => {
  let material = await Material.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, useFindAndModify: false }
  )
  material = await Material.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: material })
}

exports.create = async (req, res) => {
  const material = new Material(req.body)
  await material.save()
  return res.json({ status: 'ok', data: material })
}

exports.delete = async (req, res) => {
  await Material.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}
