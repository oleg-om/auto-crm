const Tyre = require('../model/tyres')

exports.getAll = async (req, res) => {
  const list = await Tyre.find({})
  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const tyre = await Tyre.findOne(
    { id_tyres: req.params.id },
    { upsert: false, useFindAndModify: false }
  )
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

exports.getFiltered = async (req, res) => {
  const { page, number, place, status, vin, phone } = req.query

  try {
    const LIMIT = 14
    const startIndex = (Number(page) - 1) * LIMIT // get the starting index of every page

    const total = await Tyre.countDocuments({
      id_tyres: req.query.number ? `${number.toString()}` : { $exists: true },
      place: req.query.place ? `${place.toString()}` : { $exists: true },
      status: req.query.status ? `${decodeURIComponent(status).toString()}` : { $exists: true },
      vinnumber: req.query.vin ? `${vin.toString()}` : { $exists: true },
      phone: req.query.phone ? { $regex: `${phone.toString()}`, $options: 'i' } : { $exists: true }
    })

    const posts = await Tyre.find({
      id_tyres: req.query.number ? `${number.toString()}` : { $exists: true },
      place: req.query.place ? `${place.toString()}` : { $exists: true },
      status: req.query.status ? `${decodeURIComponent(status).toString()}` : { $exists: true },
      vinnumber: req.query.vin ? `${vin.toString()}` : { $exists: true },
      phone: req.query.phone ? { $regex: `${phone.toString()}`, $options: 'i' } : { $exists: true }
    })
      .sort({ id_tyres: -1 })
      .limit(LIMIT)
      .skip(startIndex)

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
exports.getByPage = async (req, res) => {
  const { page } = req.params

  try {
    const LIMIT = 14
    const startIndex = (Number(page) - 1) * LIMIT // get the starting index of every page

    const total = await Tyre.countDocuments({})
    const posts = await Tyre.find().sort({ id_tyres: -1 }).limit(LIMIT).skip(startIndex)

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
