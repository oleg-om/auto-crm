const Tyre = require('../model/tyres')

exports.getAll = async (req, res) => {
  const list = await Tyre.find({})
  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const tyre = await Tyre.findOne({ id: req.params.id }, { upsert: false, useFindAndModify: false })
  return res.json({ status: 'ok', data: tyre })
}

exports.update = async (req, res) => {
  let tyre = await Tyre.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, useFindAndModify: false }
  )
  tyre = await Tyre.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: tyre })
}

exports.create = async (req, res) => {
  const tyre = new Tyre(req.body)
  await tyre.save()
  return res.json({ status: 'ok', data: tyre })
}

exports.delete = async (req, res) => {
  await Tyre.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}
