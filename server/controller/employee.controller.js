const Employee = require('../model/employee')

// The unique index on journalNumber (see model) is the backstop; this check gives a readable
// message naming the employee who already holds the number.
const findJournalNumberConflict = (journalNumber, excludeId) => {
  if (typeof journalNumber !== 'number') return null
  return Employee.findOne({ journalNumber, ...(excludeId ? { id: { $ne: excludeId } } : {}) })
}

const journalNumberConflict = (res, journalNumber, holder) =>
  res.status(409).json({
    status: 'error',
    field: 'journalNumber',
    message: holder
      ? `Номер ${journalNumber} уже занят: ${[holder.name, holder.surname].filter(Boolean).join(' ')}`
      : `Номер ${journalNumber} уже занят`
  })

const isDuplicateJournalNumber = (err) => err?.code === 11000 && err?.keyPattern?.journalNumber

exports.getAll = async (req, res) => {
  const filter = req.query.includeInactive === 'true' ? {} : { active: { $ne: false } }
  const list = await Employee.find(filter)
  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const employee = await Employee.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: employee })
}

exports.update = async (req, res) => {
  const { journalNumber } = req.body
  const holder = await findJournalNumberConflict(journalNumber, req.params.id)
  if (holder) return journalNumberConflict(res, journalNumber, holder)
  try {
    const employee = await Employee.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { upsert: false, new: true }
    )
    return res.json({ status: 'ok', data: employee })
  } catch (err) {
    if (isDuplicateJournalNumber(err)) return journalNumberConflict(res, journalNumber)
    throw err
  }
}

exports.create = async (req, res) => {
  const { journalNumber } = req.body
  const holder = await findJournalNumberConflict(journalNumber)
  if (holder) return journalNumberConflict(res, journalNumber, holder)
  try {
    const employee = new Employee(req.body)
    await employee.save()
    return res.json({ status: 'ok', data: employee })
  } catch (err) {
    if (isDuplicateJournalNumber(err)) return journalNumberConflict(res, journalNumber)
    throw err
  }
}

exports.delete = async (req, res) => {
  await Employee.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}
