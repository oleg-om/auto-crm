const WorkDayStart = require('../model/workDayStart')
const { toUtcDateOnly, utcMonthRange } = require('../utils/dateBucket')

exports.getByEmployeeAndDate = async (req, res) => {
  const { employeeId, date } = req.params
  const workDayStart = await WorkDayStart.findOne({ employeeId, date: toUtcDateOnly(date) })
  return res.json({ status: 'ok', data: workDayStart })
}

// Получить начала/окончания рабочего дня за месяц для сотрудника
exports.getByEmployeeAndMonth = async (req, res) => {
  const { employeeId, month } = req.params
  const { start, end } = utcMonthRange(month)
  const workDayStarts = await WorkDayStart.find({
    employeeId,
    date: { $gte: start, $lt: end }
  })
  return res.json({ status: 'ok', data: workDayStarts })
}

exports.startWorkDay = async (req, res) => {
  const { employeeId, date } = req.body

  const dateObj = toUtcDateOnly(date)

  // Проверяем, не начат ли уже рабочий день
  const existing = await WorkDayStart.findOne({ employeeId, date: dateObj })
  if (existing) {
    return res.json({ status: 'ok', data: existing })
  }

  const workDayStart = new WorkDayStart({
    employeeId,
    date: dateObj
  })
  await workDayStart.save()
  return res.json({ status: 'ok', data: workDayStart })
}

exports.endWorkDay = async (req, res) => {
  const { employeeId, date } = req.body

  const dateObj = toUtcDateOnly(date)

  const workDayStart = await WorkDayStart.findOne({ employeeId, date: dateObj })
  if (!workDayStart) {
    return res.json({ status: 'error', message: 'Work day not started' })
  }

  if (workDayStart.endTime) {
    return res.json({ status: 'ok', data: workDayStart })
  }

  workDayStart.endTime = new Date()
  await workDayStart.save()
  return res.json({ status: 'ok', data: workDayStart })
}
