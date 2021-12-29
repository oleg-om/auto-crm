const Shinomontazh = require('../model/shinomontazh')

exports.getAll = async (req, res) => {
  const list = await Shinomontazh.find({})
  return res.json({ status: 'ok', data: list })
}

exports.getLastTwoDays = async (req, res) => {
  const date = new Date()
  const yerstaday = new Date(date.setDate(date.getDate() - 2))
  const list = await Shinomontazh.find({
    dateFinish: { $gte: new Date(yerstaday).toString() }
    // dateStart: { $gte: new Date(Date.now().getTime() - 24 * 60 * 60 * 1000).toISOString() }
  })

  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const shinomontazh = await Shinomontazh.findOne(
    { id_shinomontazhs: req.params.id },
    { upsert: false, useFindAndModify: false }
  )
  return res.json({ status: 'ok', data: shinomontazh })
}

exports.update = async (req, res) => {
  let shinomontazh = await Shinomontazh.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, useFindAndModify: false }
  )
  shinomontazh = await Shinomontazh.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: shinomontazh })
}

exports.create = async (req, res) => {
  const shinomontazh = new Shinomontazh(req.body)
  await shinomontazh.save()
  return res.json({ status: 'ok', data: shinomontazh })
}

exports.delete = async (req, res) => {
  await Shinomontazh.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}
exports.getByPage = async (req, res) => {
  const { page } = req.params

  try {
    const LIMIT = 14
    const startIndex = (Number(page) - 1) * LIMIT // get the starting index of every page

    const total = await Shinomontazh.countDocuments({})
    const posts = await Shinomontazh.find()
      .sort({ id_shinomontazhs: -1 })
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
exports.getFiltered = async (req, res) => {
  const { page, number, place } = req.query

  try {
    const LIMIT = 14
    const startIndex = (Number(page) - 1) * LIMIT // get the starting index of every page

    const posts = await Shinomontazh.find({
      id_shinomontazhs: req.query.number ? `${number.toString()}` : { $exists: true },
      place: req.query.place ? `${place.toString()}` : { $exists: true }
    })
      .sort({ id_shinomontazhs: -1 })
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
exports.getMonth = async (req, res) => {
  const { month, year } = req.query

  const list = await Shinomontazh.find({
    $expr: {
      $and: [
        { $eq: [{ $year: '$dateFinish' }, Number(year)] },
        { $eq: [{ $month: '$dateFinish' }, Number(month)] }
      ]
    }
  })

  return res.json({ status: 'ok', data: list })
}
