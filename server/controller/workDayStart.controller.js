const WorkDayStart = require('../model/workDayStart')

exports.getByEmployeeAndDate = async (req, res) => {
  const { employeeId, date } = req.params
  // Преобразуем строку даты в Date объект (начало дня)
  const dateObj = new Date(date)
  dateObj.setHours(0, 0, 0, 0)
  const workDayStart = await WorkDayStart.findOne({ employeeId, date: dateObj })
  return res.json({ status: 'ok', data: workDayStart })
}

// Получить начала/окончания рабочего дня за месяц для сотрудника
exports.getByEmployeeAndMonth = async (req, res) => {
  const { employeeId, month } = req.params
  const [year, monthNumber] = month.split('-').map(Number)
  const start = new Date(year, monthNumber - 1, 1)
  const end = new Date(year, monthNumber, 1)
  const workDayStarts = await WorkDayStart.find({
    employeeId,
    date: { $gte: start, $lt: end }
  })
  return res.json({ status: 'ok', data: workDayStarts })
}

exports.startWorkDay = async (req, res) => {
  const { employeeId, date } = req.body

  // Преобразуем строку даты в Date объект (начало дня)
  const dateObj = typeof date === 'string' ? new Date(date) : date
  dateObj.setHours(0, 0, 0, 0)

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

  // Преобразуем строку даты в Date объект (начало дня)
  const dateObj = typeof date === 'string' ? new Date(date) : date
  dateObj.setHours(0, 0, 0, 0)

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
