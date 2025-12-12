const Position = require('../model/position')

exports.getAll = async (req, res) => {
  const list = await Position.find({}).sort({ date: -1 })
  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const position = await Position.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: position })
}

exports.update = async (req, res) => {
  let position = await Position.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, useFindAndModify: false, new: true }
  )
  position = await Position.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: position })
}

exports.create = async (req, res) => {
  const position = new Position(req.body)
  await position.save()
  return res.json({ status: 'ok', data: position })
}

exports.delete = async (req, res) => {
  const position = await Position.findOne({ id: req.params.id })
  if (!position) {
    return res.json({ status: 'error', message: 'Position not found' })
  }
  // Проверяем, есть ли обязанности
  if (position.duties && position.duties.length > 0) {
    return res.json({
      status: 'error',
      message: 'Cannot delete position with duties'
    })
  }
  await Position.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}

// Управление обязанностями
exports.addDuty = async (req, res) => {
  const position = await Position.findOne({ id: req.params.id })
  if (!position) {
    return res.json({ status: 'error', message: 'Position not found' })
  }

  const maxOrder =
    position.duties.length > 0 ? Math.max(...position.duties.map((d) => d.order || 0)) : -1

  const newDuty = {
    name: req.body.name,
    isQuantitative: req.body.isQuantitative || false,
    order: maxOrder + 1
  }

  position.duties.push(newDuty)
  await position.save()

  const updatedPosition = await Position.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: updatedPosition })
}

exports.updateDuty = async (req, res) => {
  const position = await Position.findOne({ id: req.params.id })
  if (!position) {
    return res.json({ status: 'error', message: 'Position not found' })
  }

  const dutyIndex = position.duties.findIndex((d) => d._id.toString() === req.params.dutyId)

  if (dutyIndex === -1) {
    return res.json({ status: 'error', message: 'Duty not found' })
  }

  if (req.body.name !== undefined) {
    position.duties[dutyIndex].name = req.body.name
  }
  if (req.body.isQuantitative !== undefined) {
    position.duties[dutyIndex].isQuantitative = req.body.isQuantitative
  }
  if (req.body.order !== undefined) {
    position.duties[dutyIndex].order = req.body.order
  }

  await position.save()

  const updatedPosition = await Position.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: updatedPosition })
}

exports.deleteDuty = async (req, res) => {
  const position = await Position.findOne({ id: req.params.id })
  if (!position) {
    return res.json({ status: 'error', message: 'Position not found' })
  }

  position.duties = position.duties.filter((d) => d._id.toString() !== req.params.dutyId)

  // Пересчитываем порядок
  position.duties.forEach((duty, index) => {
    // eslint-disable-next-line no-param-reassign
    duty.order = index
  })

  await position.save()

  const updatedPosition = await Position.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: updatedPosition })
}

exports.reorderDuties = async (req, res) => {
  const position = await Position.findOne({ id: req.params.id })
  if (!position) {
    return res.json({ status: 'error', message: 'Position not found' })
  }

  const { dutyIds } = req.body // массив ID обязанностей в новом порядке

  if (!Array.isArray(dutyIds) || dutyIds.length !== position.duties.length) {
    return res.json({ status: 'error', message: 'Invalid duty order' })
  }

  // Создаем новый порядок обязанностей
  const reorderedDuties = dutyIds
    .map((dutyId, index) => {
      const duty = position.duties.find((d) => d._id.toString() === dutyId)
      if (!duty) {
        return null
      }
      duty.order = index
      return duty
    })
    .filter(Boolean)

  if (reorderedDuties.length !== position.duties.length) {
    return res.json({ status: 'error', message: 'Some duties not found' })
  }

  position.duties = reorderedDuties
  await position.save()

  const updatedPosition = await Position.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: updatedPosition })
}
