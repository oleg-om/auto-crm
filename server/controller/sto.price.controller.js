const StoPrice = require('../model/sto.price')

exports.getAll = async (req, res) => {
  const list = await StoPrice.find({})
  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const stoprice = await StoPrice.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: stoprice })
}

exports.update = async (req, res) => {
  let stoprice = await StoPrice.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, useFindAndModify: false }
  )
  stoprice = await StoPrice.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: stoprice })
}

exports.create = async (req, res) => {
  const stoprice = new StoPrice(req.body)
  await stoprice.save()
  return res.json({ status: 'ok', data: stoprice })
}

exports.import = async (req, res) => {
  await req.body.forEach((it) => new StoPrice(it).save())
  return res.json({ status: 'ok', data: req.body })
}

exports.delete = async (req, res) => {
  await StoPrice.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}

exports.deleteAll = async (req, res) => {
  await StoPrice.deleteMany({})
  return res.json({ status: 'ok' })
}
