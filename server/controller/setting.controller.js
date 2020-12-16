const Setting = require('../model/settings')

exports.getAll = async (req, res) => {
  const list = await Setting.find({})
  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const setting = await Setting.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: setting })
}

exports.update = async (req, res) => {
  let setting = await Setting.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, useFindAndModify: false }
  )
  setting = await Setting.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: setting })
}

exports.create = async (req, res) => {
  const setting = new Setting(req.body)
  await setting.save()
  return res.json({ status: 'ok', data: setting })
}

exports.delete = async (req, res) => {
  await Setting.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}
