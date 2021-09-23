const Razval = require('../model/razval')

exports.getAll = async (req, res) => {
  const list = await Razval.find({})
  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const razval = await Razval.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: razval })
}

exports.update = async (req, res) => {
  let razval = await Razval.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, useFindAndModify: false }
  )
  razval = await Razval.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: razval })
}

exports.create = async (req, res) => {
  const razval = new Razval(req.body)
  await razval.save()
  return res.json({ status: 'ok', data: razval })
}

exports.delete = async (req, res) => {
  await Razval.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}
exports.getMonth = async (req, res) => {
  const { yearmonth } = req.query

  const list = await Razval.find({
    date: { $regex: `${yearmonth.toString()}`, $options: 'i' }
  })

  return res.json({ status: 'ok', data: list })
}
