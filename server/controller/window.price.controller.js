const WindowPrice = require('../model/window.price')

exports.getAll = async (req, res) => {
  const list = await WindowPrice.find({})
  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const windowprice = await WindowPrice.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: windowprice })
}

exports.update = async (req, res) => {
  let windowprice = await WindowPrice.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, useFindAndModify: false }
  )
  windowprice = await WindowPrice.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: windowprice })
}

exports.create = async (req, res) => {
  const windowprice = new WindowPrice(req.body)
  await windowprice.save()
  return res.json({ status: 'ok', data: windowprice })
}

exports.import = async (req, res) => {
  await req.body.forEach((it) => new WindowPrice(it).save())
  return res.json({ status: 'ok', data: req.body })
}

exports.delete = async (req, res) => {
  await WindowPrice.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}

exports.deleteAll = async (req, res) => {
  await WindowPrice.deleteMany({})
  return res.json({ status: 'ok' })
}
