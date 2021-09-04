const Shinomontazh = require('../model/shinomontazh')

exports.getAll = async (req, res) => {
  const list = await Shinomontazh.find({})
  return res.json({ status: 'ok', data: list })
}

exports.getLastTwoDays = async (req, res) => {
  const date = new Date()
  const yerstaday = new Date(date.setDate(date.getDate() - 2))
  const list = await Shinomontazh.find({
    dateStart: { $gte: new Date(yerstaday).toString() }
    // dateStart: { $gte: new Date(Date.now().getTime() - 24 * 60 * 60 * 1000).toISOString() }
  })

  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const shinomontazh = await Shinomontazh.findOne(
    { id: req.params.id },
    { upsert: false, useFindAndModify: false }
  )
  return res.json({ status: 'ok', data: shinomontazh })
}

exports.update = async (req, res) => {
  let shinomontazh = await Shinomontazh.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, useFindAndModify: false }
  )
  shinomontazh = await Shinomontazh.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: shinomontazh })
}

exports.create = async (req, res) => {
  const shinomontazh = new Shinomontazh(req.body)
  await shinomontazh.save()
  return res.json({ status: 'ok', data: shinomontazh })
}

exports.delete = async (req, res) => {
  await Shinomontazh.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}
