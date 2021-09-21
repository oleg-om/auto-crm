const Customer = require('../model/customer')

exports.getAll = async (req, res) => {
  const list = await Customer.find({})
  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const customer = await Customer.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: customer })
}

exports.getByFind = async (req, res) => {
  // function fixedEncodeURIComponent(str) {
  //   return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
  //     return '%' + c.charCodeAt(0).toString(16);
  //   });
  // }
  // const phone =
  // .replace(/brl/g, '(')
  // .replace(/brr/g, ')')
  // .replace(/pl/g, '+')
  const customer = await Customer.find({
    $or: [
      { regnumber: { $regex: req.params.regnumber, $options: 'i' } },
      { vinnumber: { $regex: req.params.vinnumber, $options: 'i' } },
      { phone: { $regex: req.params.phone, $options: 'i' } }
    ]
  })
  return res.json({ status: 'ok', data: customer })
}

exports.update = async (req, res) => {
  let customer = await Customer.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, useFindAndModify: false }
  )
  customer = await Customer.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: customer })
}

exports.create = async (req, res) => {
  const customer = new Customer(req.body)
  await customer.save()
  return res.json({ status: 'ok', data: customer })
}

exports.delete = async (req, res) => {
  await Customer.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}
