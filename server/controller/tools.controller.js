const Tool = require('../model/tools')

exports.getAll = async (req, res) => {
  const list = await Tool.find({})
  return res.json({ status: 'ok', data: list })
}

exports.getLastOneHundred = async (req, res) => {
  const list = await Tool.find().sort({ id_tools: -1 }).limit(20)
  return res.json({ status: 'ok', data: list.reverse() })
}

exports.getByPage = async (req, res) => {
  const { page } = req.params

  try {
    const LIMIT = 14
    const startIndex = (Number(page) - 1) * LIMIT // get the starting index of every page

    const total = await Tool.countDocuments({})
    const posts = await Tool.find().sort({ id_tools: -1 }).limit(LIMIT).skip(startIndex)

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

exports.getFiltered = async (req, res) => {
  const { page, number, place, status, process, phone } = req.query

  try {
    const LIMIT = 14
    const startIndex = (Number(page) - 1) * LIMIT // get the starting index of every page

    // const posts = await Tool.find({
    //   $or: [
    //     {
    //       status: `${decodeURIComponent(req.query.status ? status : '').toString()}`
    //     },
    //     { id_tools: number },
    //     {
    //       process: req.query.process ? `${process.toString()}` : 'smth'
    //     },
    //     { phone: { $regex: req.query.phone ? `${phone.toString()}` : 'smth', $options: 'i' } },

    //     { place: req.query.place ? `${place.toString()}` : 'smth' },
    //     { upsert: false, useFindAndModify: false }
    //   ]
    // })
    const total = await Tool.countDocuments({
      id_tools: req.query.number ? number : { $exists: true },
      place: req.query.place ? `${place.toString()}` : { $exists: true },
      status: req.query.status ? `${decodeURIComponent(status).toString()}` : { $exists: true },
      process: req.query.process ? `${process.toString()}` : { $exists: true },
      phone: req.query.phone ? { $regex: `${phone.toString()}`, $options: 'i' } : { $exists: true }
    })

    const posts = await Tool.find({
      // status: `${decodeURIComponent(req.query.status ? status : '').toString()}`,
      id_tools: req.query.number ? number : { $exists: true },
      place: req.query.place ? `${place.toString()}` : { $exists: true },
      status: req.query.status ? `${decodeURIComponent(status).toString()}` : { $exists: true },
      process: req.query.process ? `${process.toString()}` : { $exists: true },
      phone: req.query.phone ? { $regex: `${phone.toString()}`, $options: 'i' } : { $exists: true }
      // {
      //   process: req.query.process ? `${process.toString()}` : 'smth'
      // },
      // { phone: { $regex: req.query.phone ? `${phone.toString()}` : 'smth', $options: 'i' } },

      // upsert: false,
      // useFindAndModify: false
    })
      .sort({ id_tools: -1 })
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

exports.getOne = async (req, res) => {
  const autopart = await Tool.findOne(
    { id_tools: req.params.id },
    { upsert: false, useFindAndModify: false }
  )
  return res.json({ status: 'ok', data: autopart })
}

exports.update = async (req, res) => {
  let autopart = await Tool.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, useFindAndModify: false }
  )
  autopart = await Tool.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: autopart })
}

exports.create = async (req, res) => {
  const autopart = new Tool(req.body)
  await autopart.save()
  return res.json({ status: 'ok', data: autopart })
}

exports.delete = async (req, res) => {
  await Tool.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}

exports.getMonth = async (req, res) => {
  const { yearmonth } = req.query

  const list = await Tool.find({
    'order.come': { $regex: `${yearmonth.toString()}`, $options: 'i' }
  })

  return res.json({ status: 'ok', data: list })
}
