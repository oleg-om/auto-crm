const Diskpainting = require('../model/diskpainting')
const Customer = require('../model/customer')
const { getBasicMonth } = require('../utils/controller')
const { caseInsensitiveRegex } = require('../utils/regex')

exports.getAll = async (req, res) => {
  const list = await Diskpainting.find({ dateStart: { $exists: true } })
  return res.json({ status: 'ok', data: list })
}

exports.getLastTwoDays = async (req, res) => {
  const date = new Date()
  const yesterday = new Date(date.setDate(date.getDate() - 2))
  const list = await Diskpainting.find({
    dateFinish: { $gte: new Date(yesterday).toString() },
    dateStart: { $exists: true }
  })
  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const diskpainting = await Diskpainting.findOne({ id_diskpaintings: req.params.id })
  return res.json({ status: 'ok', data: diskpainting })
}

exports.update = async (req, res) => {
  const diskpainting = await Diskpainting.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, new: true }
  )
  if (req.body.customerId && req.body.organizationId) {
    await Customer.findOneAndUpdate(
      { id: req.body.customerId },
      { $set: { organizationId: req.body.organizationId } },
      { upsert: false }
    )
  }
  return res.json({ status: 'ok', data: diskpainting })
}

exports.create = async (req, res) => {
  const diskpainting = new Diskpainting(req.body)
  await diskpainting.save()
  if (req.body.customerId && req.body.organizationId) {
    await Customer.findOneAndUpdate(
      { id: req.body.customerId },
      { $set: { organizationId: req.body.organizationId } },
      { upsert: false }
    )
  }
  return res.json({ status: 'ok', data: diskpainting })
}

exports.delete = async (req, res) => {
  await Diskpainting.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}

exports.getByPage = async (req, res) => {
  const { page } = req.params
  try {
    const LIMIT = 14
    const startIndex = (Number(page) - 1) * LIMIT
    const total = await Diskpainting.countDocuments({ dateStart: { $exists: true } })
    const posts = await Diskpainting.find({ dateStart: { $exists: true } })
      .sort({ dateStart: -1 })
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
  const { page, number, place, reg, employee, organization } = req.query
  try {
    const LIMIT = 14
    const startIndex = (Number(page) - 1) * LIMIT
    const query = { dateStart: { $exists: true } }
    if (req.query.number) query.id_diskpaintings = number.toString()
    if (req.query.place && place.trim() !== '') query.place = place.toString()
    if (req.query.reg) query.regnumber = caseInsensitiveRegex(reg)
    if (req.query.employee) query['employee.id'] = employee.toString()
    if (req.query.status) query.status = req.query.status.toString()
    if (req.query.organization) query.organizationId = organization.toString()

    const total = await Diskpainting.countDocuments(query)
    const posts = await Diskpainting.find(query)
      .sort({ dateStart: -1 })
      .limit(LIMIT)
      .skip(startIndex)
      .lean()
    res.json({
      status: 'ok',
      data: posts,
      currentPage: Number(page),
      num: posts.length,
      numberOfPages: Math.ceil(total / LIMIT)
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

exports.getMonth = async (req, res) => {
  return getBasicMonth(req, res, Diskpainting)
}

exports.getRange = async (req, res) => {
  const { month, year, secMonth, secYear } = req.query
  const getMonth = (mn) => (Number(mn) < 10 ? `0${mn}` : mn)
  const getDate = (mon, yer) => `${yer}-${getMonth(mon)}-01T00:00:00.000Z`
  const getDateSec = (mon, yer) => `${yer}-${getMonth(mon)}-31T23:59:00.000Z`
  const list = await Diskpainting.find({
    dateStart: { $exists: true },
    dateFinish: { $gte: getDate(month, year), $lt: getDateSec(secMonth, secYear) }
  })
  return res.json({ status: 'ok', data: list })
}
