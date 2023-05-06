const CondPrice = require('../model/cond.price')

exports.getAll = async (req, res) => {
  const list = await CondPrice.find({})
  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const condprice = await CondPrice.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: condprice })
}

exports.update = async (req, res) => {
  let condprice = await CondPrice.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, useFindAndModify: false }
  )
  condprice = await CondPrice.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: condprice })
}

exports.create = async (req, res) => {
  const condprice = new CondPrice(req.body)
  await condprice.save()
  return res.json({ status: 'ok', data: condprice })
}

exports.import = async (req, res) => {
  await req.body.forEach((it) => new CondPrice(it).save())
  return res.json({ status: 'ok', data: req.body })
}

exports.delete = async (req, res) => {
  await CondPrice.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}

exports.deleteAll = async (req, res) => {
  await CondPrice.deleteMany({})
  return res.json({ status: 'ok' })
}
