const Tyre = require('../model/tyres')

exports.getAll = async (req, res) => {
  const list = await Tyre.find({})
  return res.json({ status: 'ok', data: list })
}

exports.getOne = async (req, res) => {
  const tyre = await Tyre.findOne(
    { id_tyres: req.params.id },
    { upsert: false, useFindAndModify: false }
  )
  return res.json({ status: 'ok', data: tyre })
}

exports.update = async (req, res) => {
  let tyre = await Tyre.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { upsert: false, useFindAndModify: false }
  )
  tyre = await Tyre.findOne({ id: req.params.id })
  return res.json({ status: 'ok', data: tyre })
}

exports.create = async (req, res) => {
  const tyre = new Tyre(req.body)
  await tyre.save()
  return res.json({ status: 'ok', data: tyre })
}

exports.delete = async (req, res) => {
  await Tyre.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}

exports.getFiltered = async (req, res) => {
  const { page, number, place, status, vin, phone, sizeone, sizetwo, sizethree } = req.query

  try {
    const LIMIT = 14
    const startIndex = (Number(page) - 1) * LIMIT // get the starting index of every page

    const findTyresBySize = () => {
      if (sizeone || sizetwo || sizethree) {
        const sz1 = sizeone ? { sizeone } : {}
        const sz2 = sizetwo ? { sizetwo } : {}
        const sz3 = sizethree ? { sizethree } : {}
        return {
          $or: [
            {
              order: {
                $elemMatch: {
                  ...sz1,
                  ...sz2,
                  ...sz3
                }
              }
            },
            {
              preorder: {
                $elemMatch: {
                  ...sz1,
                  ...sz2,
                  ...sz3
                }
              }
            }
          ]
        }
      }
      return {}
    }

    const idFind = req.query.number ? { id_tyres: `${number.toString()}` } : {}
    const placeFind = req.query.place ? { place: `${place.toString()}` } : {}
    const statusFind = req.query.status
      ? { status: `${decodeURIComponent(status).toString()}` }
      : {}
    const vinFind = req.query.vin ? { vinnumber: `${vin.toString()}` } : {}
    const phoneFind = req.query.phone
      ? { phone: { $regex: `${phone.toString()}`, $options: 'i' } }
      : {}

    const total = await Tyre.countDocuments({
      ...idFind,
      ...placeFind,
      ...statusFind,
      ...vinFind,
      ...phoneFind,
      // ...findTyresBySize('order'),
      ...findTyresBySize('preorder')
    })

    const posts = await Tyre.find({
      ...idFind,
      ...placeFind,
      ...statusFind,
      ...vinFind,
      ...phoneFind,
      // ...findTyresBySize('order'),
      ...findTyresBySize('preorder')
    })
      .sort({ id_tyres: -1 })
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

    const total = await Tyre.countDocuments({})
    const posts = await Tyre.find().sort({ id_tyres: -1 }).limit(LIMIT).skip(startIndex)

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
