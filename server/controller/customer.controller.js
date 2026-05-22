const Customer = require('../model/customer')
const Sto = require('../model/sto')
const Wash = require('../model/wash')
const Window = require('../model/window')
const Cond = require('../model/cond')
const Shinomontazh = require('../model/shinomontazh')
const Autopart = require('../model/autoparts')
const Tyre = require('../model/tyres')
const Tool = require('../model/tools')
const { escapeRegex, caseInsensitiveRegex } = require('../utils/regex')

function legacyOrderMatchConditions(customer) {
  const parts = []
  const phone = customer.phone && String(customer.phone).trim()
  const reg = customer.regnumber && String(customer.regnumber).trim()
  const vin = customer.vinnumber && String(customer.vinnumber).trim()
  if (phone) {
    const re = new RegExp(escapeRegex(phone), 'i')
    parts.push({ phone: re })
    parts.push({ phoneSecond: re })
  }
  if (reg) {
    parts.push({ regnumber: new RegExp(`^${escapeRegex(reg)}$`, 'i') })
  }
  if (vin) {
    parts.push({ vinnumber: new RegExp(`^${escapeRegex(vin)}$`, 'i') })
  }
  return parts
}

function legacyOrderQuery(customer) {
  const parts = legacyOrderMatchConditions(customer)
  if (parts.length === 0) return null
  return { $or: parts }
}

function workOrderHistoryQuery(customerId, customer) {
  const parts = [{ customerId }, ...legacyOrderMatchConditions(customer)]
  return { $or: parts }
}

exports.getHistory = async (req, res) => {
  try {
    const customer = await Customer.findOne({ id: req.params.id }).lean()
    if (!customer) {
      return res.status(404).json({ status: 'error', message: 'Клиент не найден' })
    }

    const cid = customer.id
    const sortStoFamily = { date: -1, dateStart: -1, dateFinish: -1 }
    const workQ = workOrderHistoryQuery(cid, customer)

    const [stos, washs, windows, conds, shinomontazhs] = await Promise.all([
      Sto.find(workQ).sort(sortStoFamily).limit(400).lean(),
      Wash.find(workQ).sort(sortStoFamily).limit(400).lean(),
      Window.find(workQ).sort(sortStoFamily).limit(400).lean(),
      Cond.find(workQ).sort(sortStoFamily).limit(400).lean(),
      Shinomontazh.find(workQ).sort(sortStoFamily).limit(400).lean()
    ])

    const legacyQ = legacyOrderQuery(customer)

    const [autoparts, tyres, tools] = await Promise.all([
      legacyQ ? Autopart.find(legacyQ).sort({ date: -1 }).limit(400).lean() : [],
      legacyQ ? Tyre.find(legacyQ).sort({ date: -1 }).limit(400).lean() : [],
      legacyQ ? Tool.find(legacyQ).sort({ date: -1 }).limit(400).lean() : []
    ])

    return res.json({
      status: 'ok',
      data: {
        customer,
        history: {
          shinomontazh: shinomontazhs,
          sto: stos,
          wash: washs,
          window: windows,
          cond: conds,
          autoparts,
          tyres,
          tools
        }
      }
    })
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message })
  }
}

exports.getAll = async (req, res) => {
  const list = await Customer.find({})
  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const customer = await Customer.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: customer })
}

exports.getByFind = async (req, res) => {
  try {
    const regString =
      req.params.regnumber && req.params.regnumber !== 'reg'
        ? { regnumber: caseInsensitiveRegex(req.params.regnumber) }
        : null
    const vinString =
      req.params.vinnumber && req.params.vinnumber !== 'vin'
        ? { vinnumber: caseInsensitiveRegex(req.params.vinnumber) }
        : null
    const phoneString =
      req.params.phone && req.params.phone !== 'phone'
        ? { phone: caseInsensitiveRegex(req.params.phone) }
        : null

    const filters = [regString, vinString, phoneString].filter((it) => it)
    const customer =
      filters.length > 0 ? await Customer.find({ $and: filters }) : await Customer.find({}).limit(0)

    return res.json({ status: 'ok', data: customer })
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message })
  }
}

exports.update = async (req, res) => {
  const customer = await Customer.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, new: true }
  )
  return res.json({ status: 'ok', data: customer })
}

exports.create = async (req, res) => {
  const customer = new Customer(req.body)
  await customer.save()
  return res.json({ status: 'ok', data: customer })
}

exports.delete = async (req, res) => {
  await Customer.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}
exports.getFiltered = async (req, res) => {
  const { page, reg, vin, phone, organization } = req.query

  try {
    const LIMIT = 14
    const startIndex = (Number(page) - 1) * LIMIT

    const andConditions = []

    // Добавляем условия поиска по phone/vin/reg только если хотя бы одно из них указано
    const hasTextFilters = phone || vin || reg
    if (hasTextFilters) {
      const orConditions = []
      if (phone) {
        orConditions.push({ phone: caseInsensitiveRegex(phone) })
      }
      if (vin) {
        orConditions.push({ vinnumber: caseInsensitiveRegex(vin) })
      }
      if (reg) {
        orConditions.push({ regnumber: caseInsensitiveRegex(reg) })
      }
      if (orConditions.length > 0) {
        andConditions.push({ $or: orConditions })
      }
    }

    // Добавляем фильтр по организации
    if (organization) {
      andConditions.push({ organizationId: organization })
    }

    // Формируем итоговый запрос
    const query = andConditions.length > 0 ? { $and: andConditions } : {}

    const total = await Customer.countDocuments(query)
    const posts = await Customer.find(query).sort({ id: -1 }).limit(LIMIT).skip(startIndex)

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

    const total = await Customer.countDocuments({})
    const posts = await Customer.find().sort({ id: -1 }).limit(LIMIT).skip(startIndex)

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
