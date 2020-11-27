const Place = require('../model/place')

exports.getAll = async (req, res) => {
  const list = await Place.find({})
  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const place = await Place.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: place })
}

exports.update = async (req, res) => {
  let place = await Place.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, useFindAndModify: false }
  )
  place = await Place.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: place })
}

exports.create = async (req, res) => {
  const place = new Place(req.body)
  await place.save()
  return res.json({ status: 'ok', data: place })
}

exports.delete = async (req, res) => {
  await Place.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}
