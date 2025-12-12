const JournalEntry = require('../model/journalEntry')

exports.getAll = async (req, res) => {
  const { employeeId, date, positionId } = req.query
  const query = {}
  if (employeeId) query.employeeId = employeeId
  if (date) query.date = date
  if (positionId) query.positionId = positionId

  const list = await JournalEntry.find(query).sort({ createdAt: -1 })
  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const entry = await JournalEntry.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: entry })
}

exports.update = async (req, res) => {
  let entry = await JournalEntry.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, useFindAndModify: false, new: true }
  )
  entry = await JournalEntry.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: entry })
}

exports.create = async (req, res) => {
  const entry = new JournalEntry(req.body)
  await entry.save()
  return res.json({ status: 'ok', data: entry })
}

exports.delete = async (req, res) => {
  await JournalEntry.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}

// Получить записи за день для сотрудника
exports.getByEmployeeAndDate = async (req, res) => {
  const { employeeId, date } = req.params
  const entries = await JournalEntry.find({ employeeId, date })
  return res.json({ status: 'ok', data: entries })
}

// Создать или обновить запись
exports.upsert = async (req, res) => {
  const { entryId, employeeId, positionId, dutyId, date, value, comment, startTime, endTime } = req.body

  // Если передан entryId, обновляем конкретную запись
  if (entryId) {
    const existingEntry = await JournalEntry.findOne({ id: entryId })
    if (existingEntry) {
      if (value !== undefined) existingEntry.value = value
      if (comment !== undefined) existingEntry.comment = comment
      if (startTime !== undefined) existingEntry.startTime = startTime
      if (endTime !== undefined) existingEntry.endTime = endTime
      await existingEntry.save()
      return res.json({ status: 'ok', data: existingEntry })
    }
    return res.json({ status: 'error', message: 'Entry not found' })
  }

  // Если entryId не передан, создаем новую запись
  const dateNow = new Date()
  const defaultStartTime = startTime || `${dateNow.getHours()}:${dateNow
    .getMinutes()
    .toString()
    .replace(/^(\d)$/, '0$1')}`

  const newEntry = new JournalEntry({
    employeeId,
    positionId,
    dutyId,
    date,
    value,
    comment,
    startTime: defaultStartTime,
    endTime
  })
  await newEntry.save()
  return res.json({ status: 'ok', data: newEntry })
}

