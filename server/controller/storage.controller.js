const Storage = require('../model/storage')

exports.getAll = async (req, res) => {
  const list = await Storage.find({})
  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const storage = await Storage.findOne(
    { id_storages: req.params.id },
    { upsert: false, useFindAndModify: false }
  )
  return res.json({ status: 'ok', data: storage })
}

exports.update = async (req, res) => {
  let storage = await Storage.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, useFindAndModify: false }
  )
  storage = await Storage.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: storage })
}

exports.create = async (req, res) => {
  const storage = new Storage(req.body)
  await storage.save()
  return res.json({ status: 'ok', data: storage })
}

exports.delete = async (req, res) => {
  await Storage.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}

exports.getByPage = async (req, res) => {
  const { page } = req.params

  try {
    const LIMIT = 14
    const startIndex = (Number(page) - 1) * LIMIT // get the starting index of every page

    const total = await Storage.countDocuments({})
    const posts = await Storage.find().sort({ id_storages: -1 }).limit(LIMIT).skip(startIndex)

    res.json({
      status: 'ok',
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT)
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
exports.getFiltered = async (req, res) => {
  const { page, number, place, status, phone } = req.query

  try {
    const LIMIT = 14
    const startIndex = (Number(page) - 1) * LIMIT // get the starting index of every page

    const posts = await Storage.find({
      id_storages: req.query.number ? `${number.toString()}` : { $exists: true },
      place: req.query.place ? `${place.toString()}` : { $exists: true },
      status: req.query.status ? `${status.toString()}` : { $exists: true },
      phone: req.query.phone ? { $regex: `${phone.toString()}`, $options: 'i' } : { $exists: true }
    })
      .sort({ id_storages: -1 })
      .limit(LIMIT)
      .skip(startIndex)

    res.json({
      status: 'ok',
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(posts.length / LIMIT)
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
