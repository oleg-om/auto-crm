const JournalEntry = require('../model/journalEntry')
const Position = require('../model/position')
const { toUtcDateOnly, utcMonthRange } = require('../utils/dateBucket')

// Lunch ("Обед", see client/lists/standard-duties-list.js) is a per-position duty, so each position
// has its own copy with its own _id - collect all of them to check "one lunch per work day"
// regardless of which of the employee's positions it was logged under.
const LUNCH_DUTY_NAME = 'обед'

const getLunchDutyIds = async () => {
  const positions = await Position.find({ 'duties.name': /^обед$/i }, { duties: 1 })
  return positions.flatMap((pos) =>
    pos.duties
      .filter((duty) => duty.name?.trim().toLowerCase() === LUNCH_DUTY_NAME)
      .map((duty) => String(duty._id))
  )
}

exports.getAll = async (req, res) => {
  const { employeeId, date, positionId } = req.query
  const query = {}
  if (employeeId) query.employeeId = employeeId
  if (date) {
    query.date = toUtcDateOnly(date)
  }
  if (positionId) query.positionId = positionId

  const list = await JournalEntry.find(query).sort({ createdAt: -1 })
  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const entry = await JournalEntry.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: entry })
}

exports.update = async (req, res) => {
  const entry = await JournalEntry.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, new: true }
  )
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
  const entries = await JournalEntry.find({ employeeId, date: toUtcDateOnly(date) })
  return res.json({ status: 'ok', data: entries })
}

// Получить записи за месяц для сотрудника
exports.getByEmployeeAndMonth = async (req, res) => {
  const { employeeId, month } = req.params
  const { start, end } = utcMonthRange(month)
  const entries = await JournalEntry.find({
    employeeId,
    date: { $gte: start, $lt: end }
  })
  return res.json({ status: 'ok', data: entries })
}

// Создать или обновить запись
exports.upsert = async (req, res) => {
  const {
    entryId,
    employeeId,
    positionId,
    dutyId,
    date,
    value,
    comment,
    checklistProgress,
    startTime,
    endTime,
    isPaused,
    pausedAt,
    pauseIntervals
  } = req.body

  // Если передан entryId, обновляем конкретную запись
  if (entryId) {
    const existingEntry = await JournalEntry.findOne({ id: entryId })
    if (existingEntry) {
      if (value !== undefined) existingEntry.value = value
      if (comment !== undefined) existingEntry.comment = comment
      if (checklistProgress !== undefined) existingEntry.checklistProgress = checklistProgress
      if (isPaused !== undefined) existingEntry.isPaused = isPaused
      if (pausedAt !== undefined) existingEntry.pausedAt = pausedAt
      if (pauseIntervals !== undefined) existingEntry.pauseIntervals = pauseIntervals
      if (startTime !== undefined) {
        // Преобразуем startTime в Date, если это строка
        if (typeof startTime === 'string') {
          const startTimeDate = new Date(startTime)
          // Если это строка формата "HH:MM", создаем Date с текущей датой
          if (Number.isNaN(startTimeDate.getTime()) && startTime.includes(':')) {
            const [hours, minutes] = startTime.split(':').map(Number)
            const now = new Date()
            existingEntry.startTime = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
              hours,
              minutes
            )
          } else {
            existingEntry.startTime = startTimeDate
          }
        } else {
          existingEntry.startTime = startTime
        }
      }
      if (endTime !== undefined) {
        // Преобразуем endTime в Date, если это строка
        if (typeof endTime === 'string') {
          const endTimeDate = new Date(endTime)
          // Если это строка формата "HH:MM", создаем Date с текущей датой
          if (Number.isNaN(endTimeDate.getTime()) && endTime.includes(':')) {
            const [hours, minutes] = endTime.split(':').map(Number)
            const now = new Date()
            existingEntry.endTime = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
              hours,
              minutes
            )
          } else {
            existingEntry.endTime = endTimeDate
          }
        } else {
          existingEntry.endTime = endTime
        }
      }
      await existingEntry.save()
      return res.json({ status: 'ok', data: existingEntry })
    }
    return res.json({ status: 'error', message: 'Entry not found' })
  }

  // Если entryId не передан, создаем новую запись
  // Преобразуем startTime и endTime в Date, если они переданы как строки
  let startTimeDate = null
  if (startTime) {
    startTimeDate = typeof startTime === 'string' ? new Date(startTime) : startTime
    // Если это строка формата "HH:MM", создаем Date с текущей датой
    if (
      Number.isNaN(startTimeDate.getTime()) &&
      typeof startTime === 'string' &&
      startTime.includes(':')
    ) {
      const [hours, minutes] = startTime.split(':').map(Number)
      const now = new Date()
      startTimeDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes)
    }
  } else {
    startTimeDate = new Date()
  }

  let endTimeDate = null
  if (endTime) {
    endTimeDate = typeof endTime === 'string' ? new Date(endTime) : endTime
    // Если это строка формата "HH:MM", создаем Date с текущей датой
    if (
      Number.isNaN(endTimeDate.getTime()) &&
      typeof endTime === 'string' &&
      endTime.includes(':')
    ) {
      const [hours, minutes] = endTime.split(':').map(Number)
      const now = new Date()
      endTimeDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes)
    }
  }

  const dateObj = toUtcDateOnly(date)

  const lunchDutyIds = await getLunchDutyIds()
  if (lunchDutyIds.includes(String(dutyId))) {
    const lunchAlreadyTaken = await JournalEntry.exists({
      employeeId,
      date: dateObj,
      dutyId: { $in: lunchDutyIds }
    })
    if (lunchAlreadyTaken) {
      return res.status(409).json({
        status: 'error',
        message: 'Обед можно взять только один раз за рабочий день'
      })
    }
  }

  const newEntry = new JournalEntry({
    employeeId,
    positionId,
    dutyId,
    date: dateObj,
    value,
    comment,
    checklistProgress: checklistProgress || {},
    startTime: startTimeDate,
    endTime: endTimeDate
  })
  await newEntry.save()
  return res.json({ status: 'ok', data: newEntry })
}
