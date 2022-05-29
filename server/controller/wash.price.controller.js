const WashPrice = require('../model/wash.price')

exports.getAll = async (req, res) => {
  const list = await WashPrice.find({})
  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const washprice = await WashPrice.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: washprice })
}

exports.update = async (req, res) => {
  let washprice = await WashPrice.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, useFindAndModify: false }
  )
  washprice = await WashPrice.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: washprice })
}

exports.create = async (req, res) => {
  const washprice = new WashPrice(req.body)
  await washprice.save()
  return res.json({ status: 'ok', data: washprice })
}

exports.import = async (req, res) => {
  await req.body.forEach((it) => new WashPrice(it).save())
  return res.json({ status: 'ok', data: req.body })
}

exports.delete = async (req, res) => {
  await WashPrice.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}

exports.deleteAll = async (req, res) => {
  await WashPrice.deleteMany({})
  return res.json({ status: 'ok' })
}
