const Storage = require('../model/storage')

exports.getAll = async (req, res) => {
  const list = await Storage.find({})
  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const storage = await Storage.findOne(
    { id: req.params.id },
    { upsert: false, useFindAndModify: false }
  )
  return res.json({ status: 'ok', data: storage })
}

exports.update = async (req, res) => {
  let storage = await Storage.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, useFindAndModify: false }
  )
  storage = await Storage.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: storage })
}

exports.create = async (req, res) => {
  const storage = new Storage(req.body)
  await storage.save()
  return res.json({ status: 'ok', data: storage })
}

exports.delete = async (req, res) => {
  await Storage.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}
