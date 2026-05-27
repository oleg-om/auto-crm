const DiskpaintingPrice = require('../model/diskpainting.price')

exports.getAll = async (req, res) => {
  const list = await DiskpaintingPrice.find({})
  const normalized = list.map((item) => {
    const obj = item.toObject()
    if (!obj.free || obj.free === '') obj.free = 'no'
    return obj
  })
  return res.json({ status: 'ok', data: normalized })
}

exports.getOne = async (req, res) => {
  const diskpaintingprice = await DiskpaintingPrice.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: diskpaintingprice })
}

exports.update = async (req, res) => {
  const diskpaintingprice = await DiskpaintingPrice.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, new: true }
  )
  return res.json({ status: 'ok', data: diskpaintingprice })
}

exports.create = async (req, res) => {
  const diskpaintingprice = new DiskpaintingPrice(req.body)
  await diskpaintingprice.save()
  return res.json({ status: 'ok', data: diskpaintingprice })
}

exports.delete = async (req, res) => {
  await DiskpaintingPrice.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}

exports.deleteAll = async (req, res) => {
  await DiskpaintingPrice.deleteMany({})
  return res.json({ status: 'ok' })
}
