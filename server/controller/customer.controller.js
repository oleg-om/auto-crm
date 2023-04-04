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
  const regString =
    req.params.regnumber && req.params.regnumber !== 'reg'
      ? { regnumber: { $regex: req.params.regnumber, $options: 'i' } }
      : null
  const vinString =
    req.params.vinnumber && req.params.vinnumber !== 'vin'
      ? { vinnumber: { $regex: req.params.vinnumber, $options: 'i' } }
      : null
  const phoneString =
    req.params.phone && req.params.phone !== 'phone'
      ? { phone: { $regex: req.params.phone, $options: 'i' } }
      : null

  const customer = await Customer.find({
    $and: [regString, vinString, phoneString].filter((it) => it)
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
exports.getFiltered = async (req, res) => {
  const { page, reg, vin, phone } = req.query

  try {
    const LIMIT = 14
    const startIndex = (Number(page) - 1) * LIMIT // get the starting index of every page

    // const total = await Customer.countDocuments({
    //   phone: req.query.phone ? { $regex: `${phone.toString()}`, $options: 'i' } : { $regex: '' },
    //   vinnumber: req.query.vin ? { $regex: `${vin.toString()}`, $options: 'i' } : { $regex: '' },
    //   regnumber: req.query.reg ? { $regex: `${reg.toString()}`, $options: 'i' } : { $regex: '' }
    // })

    const total = await Customer.countDocuments({
      $or: [
        { phone: { $regex: `${phone ? phone.toString() : 'undefined'}`, $options: 'i' } },
        { vinnumber: { $regex: `${vin ? vin.toString() : 'undefined'}`, $options: 'i' } },
        { regnumber: { $regex: `${reg ? reg.toString() : 'undefined'}`, $options: 'i' } }
      ]
    })

    // const posts = await Customer.find({
    //   phone: req.query.phone ? { $regex: `${phone.toString()}`, $options: 'i' } : '',
    //   vinnumber: req.query.vin ? { $regex: `${vin.toString()}`, $options: 'i' } : '',
    //   regnumber: req.query.reg ? { $regex: `${reg.toString()}`, $options: 'i' } : ''
    // })
    const posts = await Customer.find({
      $or: [
        { phone: { $regex: `${phone ? phone.toString() : 'undefined'}`, $options: 'i' } },
        { vinnumber: { $regex: `${vin ? vin.toString() : 'undefined'}`, $options: 'i' } },
        { regnumber: { $regex: `${reg ? reg.toString() : 'undefined'}`, $options: 'i' } }
      ]
    })
      .sort({ id: -1 })
      .limit(LIMIT)
      .skip(startIndex)

    res.json({
      status: 'ok',
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT)
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
exports.getByPage = async (req, res) => {
  const { page } = req.params

  try {
    const LIMIT = 14
    const startIndex = (Number(page) - 1) * LIMIT // get the starting index of every page

    const total = await Customer.countDocuments({})
    const posts = await Customer.find().sort({ id: -1 }).limit(LIMIT).skip(startIndex)

    res.json({
      status: 'ok',
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT)
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
