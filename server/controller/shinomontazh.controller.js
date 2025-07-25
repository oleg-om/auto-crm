const Shinomontazh = require('../model/shinomontazh')
const EmployeeReport = require('../model/EmployeeReport')

exports.getAll = async (req, res) => {
  const list = await Shinomontazh.find({ dateStart: { $exists: true } })
  return res.json({ status: 'ok', data: list })
}

exports.getLastTwoDays = async (req, res) => {
  const date = new Date()
  const yerstaday = new Date(date.setDate(date.getDate() - 2))
  const list = await Shinomontazh.find({
    dateFinish: { $gte: new Date(yerstaday).toString() },
    dateStart: { $exists: true }
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

    const total = await Shinomontazh.countDocuments({
      dateStart: { $exists: true }
    })
    const posts = await Shinomontazh.find({
      dateStart: { $exists: true }
    })
      // .sort({ id_shinomontazhs: -1 })
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

    const total = await Shinomontazh.countDocuments({
      id_shinomontazhs: req.query.number ? `${number.toString()}` : { $exists: true },
      place: req.query.place ? `${place.toString()}` : { $exists: true },
      regnumber: req.query.reg ? { $regex: `${reg.toString()}`, $options: 'i' } : { $exists: true },
      dateStart: { $exists: true }
    })
    const posts = await Shinomontazh.find({
      id_shinomontazhs: req.query.number ? `${number.toString()}` : { $exists: true },
      place: req.query.place ? `${place.toString()}` : { $exists: true },
      regnumber: req.query.reg ? { $regex: `${reg.toString()}`, $options: 'i' } : { $exists: true },
      dateStart: { $exists: true }
    })
      // .sort({ id_shinomontazhs: -1 })
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
  try {
    const { month, year } = req.query

    // 1. Получаем все записи Shinomontazh за указанный месяц
    const shinomontazhList = await Shinomontazh.find({
      $expr: {
        $and: [
          { $eq: [{ $year: '$dateFinish' }, Number(year)] },
          { $eq: [{ $month: '$dateFinish' }, Number(month)] }
        ]
      }
    })

    // 2. Для каждой записи обрабатываем массив employee
    const enhancedList = await Promise.all(
      shinomontazhList.map(async (record) => {
        // 3. Обрабатываем каждого сотрудника в массиве
        const enhancedEmployees = await Promise.all(
          record.employee.map(async (emp) => {
            // 4. Ищем соответствующие записи в EmployeeReport
            const reports = await EmployeeReport.find({
              employeeId: emp.id, // или emp.employeeId, в зависимости от структуры
              month: `${month.padStart(2, '0')}.${year}`
            })

            // 5. Возвращаем сотрудника с дополненными данными
            return {
              ...(emp.toObject ? emp.toObject() : emp),
              data: reports
            }
          })
        )

        // 6. Возвращаем запись с обновленным массивом employee
        return {
          ...record.toObject(),
          employee: enhancedEmployees
        }
      })
    )

    return res.json({ status: 'ok', data: enhancedList })
  } catch (error) {
    console.error('Error in getMonth:', error)
    return res.status(500).json({ status: 'error', message: error.message })
  }
}

exports.getMonthForPreentry = async (req, res) => {
  // eslint-disable-next-line no-unused-vars
  const { year, month, day } = req.query

  const list = await Shinomontazh.find({
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
  // const list = await Shinomontazh.find({
  //   dateFinish: {
  //     $gte: new Date(getDate(month, year))
  //     // $lt: new Date(getDate(secMonth, secYear))
  //     // $lt: new Date(getDate(secMonth, secYear))
  //   }
  // })
  // const dtt = getDate(secMonth, secYear)

  const list = await Shinomontazh.find({
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

exports.removeOld = async (req, res) => {
  const now = new Date()
  const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const list = await Shinomontazh.deleteMany({ dateStart: { $lt: startOfPreviousMonth } })
  return res.json({ status: 'ok', data: list })
}
