const Cond = require('../model/cond')

exports.getAll = async (req, res) => {
  const list = await Cond.find({ dateStart: { $exists: true } })
  return res.json({ status: 'ok', data: list })
}

exports.getLastTwoDays = async (req, res) => {
  const date = new Date()
  const yerstaday = new Date(date.setDate(date.getDate() - 2))
  const list = await Cond.find({
    dateFinish: { $gte: new Date(yerstaday).toString() },
    dateStart: { $exists: true }
    // dateStart: { $gte: new Date(Date.now().getTime() - 24 * 60 * 60 * 1000).toISOString() }
  })

  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const cond = await Cond.findOne(
    { id_conds: req.params.id },
    { upsert: false, useFindAndModify: false }
  )
  return res.json({ status: 'ok', data: cond })
}

exports.update = async (req, res) => {
  let cond = await Cond.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, useFindAndModify: false }
  )
  cond = await Cond.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: cond })
}

exports.create = async (req, res) => {
  const cond = new Cond(req.body)
  await cond.save()
  return res.json({ status: 'ok', data: cond })
}

exports.delete = async (req, res) => {
  await Cond.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}
exports.getByPage = async (req, res) => {
  const { page } = req.params

  try {
    const LIMIT = 14
    const startIndex = (Number(page) - 1) * LIMIT // get the starting index of every page

    const total = await Cond.countDocuments({
      dateStart: { $exists: true }
    })
    const posts = await Cond.find({
      dateStart: { $exists: true }
    })
      // .sort({ id_conds: -1 })
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
  const { page, number, place, reg } = req.query

  try {
    const LIMIT = 14
    const startIndex = (Number(page) - 1) * LIMIT // get the starting index of every page

    const total = await Cond.countDocuments({
      id_conds: req.query.number ? `${number.toString()}` : { $exists: true },
      place: req.query.place ? `${place.toString()}` : { $exists: true },
      regnumber: req.query.reg ? { $regex: `${reg.toString()}`, $options: 'i' } : { $exists: true },
      dateStart: { $exists: true }
    })
    const posts = await Cond.find({
      id_conds: req.query.number ? `${number.toString()}` : { $exists: true },
      place: req.query.place ? `${place.toString()}` : { $exists: true },
      regnumber: req.query.reg ? { $regex: `${reg.toString()}`, $options: 'i' } : { $exists: true },
      dateStart: { $exists: true }
    })
      // .sort({ id_conds: -1 })
      .sort({ dateStart: -1 })
      .limit(LIMIT)
      .skip(startIndex)

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
  const { month, year } = req.query

  const list = await Cond.find({
    $expr: {
      $and: [
        { $eq: [{ $year: '$dateFinish' }, Number(year)] },
        { $eq: [{ $month: '$dateFinish' }, Number(month)] }
      ]
    }
  })

  return res.json({ status: 'ok', data: list })
}

exports.getMonthForPreentry = async (req, res) => {
  // eslint-disable-next-line no-unused-vars
  const { year, month, day } = req.query

  const list = await Cond.find({
    $expr: {
      $or: [
        {
          $and: [
            { $eq: [{ $year: '$dateStart' }, Number(year)] },
            { $eq: [{ $month: '$dateStart' }, Number(month)] },
            { $eq: [{ $dayOfMonth: '$dateStart' }, Number(day)] }
          ]
        },
        {
          $and: [
            { $eq: [{ $year: '$datePreentry' }, Number(year)] },
            { $eq: [{ $month: '$datePreentry' }, Number(month)] },
            { $eq: [{ $dayOfMonth: '$datePreentry' }, Number(day)] }
          ]
        }
      ]
    }
  })

  return res.json({ status: 'ok', data: list })
}

exports.getRange = async (req, res) => {
  const { month, year, secMonth, secYear } = req.query
  // const { month, year } = req.query
  const getMonth = (mn) => {
    if (Number(mn) < 10) {
      return `0${mn}`
    }
    return mn
  }

  const getDate = (mon, yer) => `${yer}-${getMonth(mon)}-01T00:00:00.000Z`
  const getDateSec = (mon, yer) => `${yer}-${getMonth(mon)}-31T23:59:00.000Z`
  // const list = await Cond.find({
  //   dateFinish: {
  //     $gte: new Date(getDate(month, year))
  //     // $lt: new Date(getDate(secMonth, secYear))
  //     // $lt: new Date(getDate(secMonth, secYear))
  //   }
  // })
  // const dtt = getDate(secMonth, secYear)

  const list = await Cond.find({
    dateStart: { $exists: true },
    dateFinish: { $gte: getDate(month, year), $lt: getDateSec(secMonth, secYear) }
  })

  return res.json({
    status: 'ok',
    date1: getDate(month, year),
    date2: getDateSec(secMonth, secYear),
    data: list
  })
}
