const ShinomontazhPrice = require('../model/shinomontazh.price')

exports.getAll = async (req, res) => {
  const list = await ShinomontazhPrice.find({})
  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const shinomontazhprice = await ShinomontazhPrice.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: shinomontazhprice })
}

exports.update = async (req, res) => {
  let shinomontazhprice = await ShinomontazhPrice.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, useFindAndModify: false }
  )
  shinomontazhprice = await ShinomontazhPrice.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: shinomontazhprice })
}

exports.create = async (req, res) => {
  const shinomontazhprice = new ShinomontazhPrice(req.body)
  await shinomontazhprice.save()
  return res.json({ status: 'ok', data: shinomontazhprice })
}

exports.import = async (req, res) => {
  await req.body.forEach((it) => new ShinomontazhPrice(it).save())
  return res.json({ status: 'ok', data: req.body })
}

exports.delete = async (req, res) => {
  await ShinomontazhPrice.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}

exports.deleteAll = async (req, res) => {
  await ShinomontazhPrice.deleteMany({})
  return res.json({ status: 'ok' })
}
