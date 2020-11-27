const userSchema = require('../model/User.model')

exports.getAll = async (req, res) => {
  const list = await userSchema.find({})
  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const account = await userSchema.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: account })
}

exports.update = async (req, res) => {
  let account = await userSchema.findOneAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { upsert: false, useFindAndModify: false }
  )
  await account.save()
  account = await userSchema.findOne({ _id: req.params.id })

  return res.json({ status: 'ok', data: account })
}

// exports.create = async (req, res) => {
//   const account = new userSchema(req.body)
//   await account.save()
//   return res.json({ status: 'ok', data: account })
// }

exports.delete = async (req, res) => {
  await userSchema.deleteOne({ _id: req.params.id })
  return res.json({ status: 'ok', _id: req.params.id })
}
