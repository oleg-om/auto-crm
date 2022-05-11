const Category = require('../model/category')

exports.getAll = async (req, res) => {
  const list = await Category.find({})
  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const category = await Category.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: category })
}

exports.update = async (req, res) => {
  let category = await Category.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, useFindAndModify: false }
  )
  category = await Category.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: category })
}

exports.create = async (req, res) => {
  const category = new Category(req.body)
  await category.save()
  return res.json({ status: 'ok', data: category })
}

exports.delete = async (req, res) => {
  await Category.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}
