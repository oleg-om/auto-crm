const WorkDayStart = require('../model/workDayStart')

exports.getByEmployeeAndDate = async (req, res) => {
  const { employeeId, date } = req.params
  const workDayStart = await WorkDayStart.findOne({ employeeId, date })
  return res.json({ status: 'ok', data: workDayStart })
}

exports.startWorkDay = async (req, res) => {
  const { employeeId, date } = req.body

  // Проверяем, не начат ли уже рабочий день
  const existing = await WorkDayStart.findOne({ employeeId, date })
  if (existing) {
    return res.json({ status: 'ok', data: existing })
  }

  const workDayStart = new WorkDayStart({
    employeeId,
    date
  })
  await workDayStart.save()
  return res.json({ status: 'ok', data: workDayStart })
}

exports.endWorkDay = async (req, res) => {
  const { employeeId, date } = req.body

  const workDayStart = await WorkDayStart.findOne({ employeeId, date })
  if (!workDayStart) {
    return res.json({ status: 'error', message: 'Work day not started' })
  }

  if (workDayStart.endTime) {
    return res.json({ status: 'ok', data: workDayStart })
  }

  const dateNow = new Date()
  const endTime = `${dateNow.getDate()}.${
    dateNow.getMonth() + 1
  }.${dateNow.getFullYear()} ${dateNow.getHours()}:${dateNow
    .getMinutes()
    .toString()
    .replace(/^(\d)$/, '0$1')}`

  workDayStart.endTime = endTime
  await workDayStart.save()
  return res.json({ status: 'ok', data: workDayStart })
}

