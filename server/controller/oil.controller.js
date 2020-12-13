const Oil = require('../model/oil')

exports.getAll = async (req, res) => {
  const list = await Oil.find({})
  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const oil = await Oil.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: oil })
}

exports.update = async (req, res) => {
  let oil = await Oil.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, useFindAndModify: false }
  )
  oil = await Oil.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: oil })
}

exports.create = async (req, res) => {
  const oil = new Oil(req.body)
  await oil.save()
  return res.json({ status: 'ok', data: oil })
}

exports.delete = async (req, res) => {
  await Oil.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}
