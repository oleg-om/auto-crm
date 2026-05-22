const Autopart = require('../model/autoparts')
const { caseInsensitiveRegex } = require('../utils/regex')

exports.getAll = async (req, res) => {
  const list = await Autopart.find({})
  return res.json({ status: 'ok', data: list })
}

exports.getLastOneHundred = async (req, res) => {
  const list = await Autopart.find().sort({ id_autoparts: -1 }).limit(20)
  return res.json({ status: 'ok', data: list.reverse() })
}

exports.getByPage = async (req, res) => {
  const { page } = req.params

  try {
    const LIMIT = 14
    const startIndex = (Number(page) - 1) * LIMIT // get the starting index of every page

    const total = await Autopart.countDocuments({})
    const posts = await Autopart.find().sort({ id_autoparts: -1 }).limit(LIMIT).skip(startIndex)

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
  const { page, number, place, status, process, phone, reg } = req.query

  try {
    const LIMIT = 14
    const startIndex = (Number(page) - 1) * LIMIT // get the starting index of every page

    const orderStatField =
      req.query.status && req.query.status === 'itemsInStock'
        ? {
            'order.stat': `Получен на складе`
          }
        : {}

    const processField = req.query.process ? { process: caseInsensitiveRegex(process) } : {}

    const total = await Autopart.countDocuments({
      id_autoparts: req.query.number ? number : { $exists: true },
      place: req.query.place ? `${place.toString()}` : { $exists: true },
      status:
        req.query.status && req.query.status !== 'itemsInStock'
          ? `${decodeURIComponent(status).toString()}`
          : { $exists: true },
      ...processField,
      phone: req.query.phone ? caseInsensitiveRegex(phone) : { $exists: true },
      regnumber: req.query.reg ? caseInsensitiveRegex(reg) : { $exists: true },
      ...orderStatField
    })

    const posts = await Autopart.find({
      // status: `${decodeURIComponent(req.query.status ? status : '').toString()}`,
      id_autoparts: req.query.number ? number : { $exists: true },
      place: req.query.place ? `${place.toString()}` : { $exists: true },
      status:
        req.query.status && req.query.status !== 'itemsInStock'
          ? `${decodeURIComponent(status).toString()}`
          : { $exists: true },
      ...processField,
      phone: req.query.phone ? caseInsensitiveRegex(phone) : { $exists: true },
      regnumber: req.query.reg ? caseInsensitiveRegex(reg) : { $exists: true },
      ...orderStatField

      // {
      //   process: req.query.process ? `${process.toString()}` : 'smth'
      // },
      // { phone: { $regex: req.query.phone ? `${phone.toString()}` : 'smth', $options: 'i' } },

      // upsert: false,
      // useFindAndModify: false
    })
      .sort({ id_autoparts: -1 })
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

exports.getOne = async (req, res) => {
  const autopart = await Autopart.findOne({ id_autoparts: req.params.id })
  return res.json({ status: 'ok', data: autopart })
}

exports.update = async (req, res) => {
  const autopart = await Autopart.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, new: true }
  )
  return res.json({ status: 'ok', data: autopart })
}

exports.create = async (req, res) => {
  const autopart = new Autopart(req.body)
  await autopart.save()
  return res.json({ status: 'ok', data: autopart })
}

exports.delete = async (req, res) => {
  await Autopart.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}

exports.getMonth = async (req, res) => {
  const { yearmonth } = req.query

  const list = await Autopart.find({
    'order.come': caseInsensitiveRegex(yearmonth)
  })

  return res.json({ status: 'ok', data: list })
}

exports.removeOld = async (req, res) => {
  const now = new Date()
  const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const list = await Autopart.deleteMany({ dateStart: { $lt: startOfPreviousMonth } })
  return res.json({ status: 'ok', data: list })
}
