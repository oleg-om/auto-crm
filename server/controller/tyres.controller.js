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
  if (!req.body?.siteNumber) {
    const tyre = new Tyre(req.body)
    await tyre.save()
    return res.json({ status: 'ok', data: tyre })
  }

  const tyreFind = await Tyre.findOne(
    { siteNumber: req.body.siteNumber },
    { upsert: false, useFindAndModify: false }
  )

  if (tyreFind) {
    return res.json({ status: 'is exist' })
  }
  const tyre = new Tyre({ ...req.body, date: new Date().toISOString() })
  await tyre.save()
  return res.json({ status: 'ok', data: tyre })
}

exports.delete = async (req, res) => {
  await Tyre.deleteOne({ id: req.params.id })
  return res.json({ status: 'ok', id: req.params.id })
}

exports.getFiltered = async (req, res) => {
  const { page, number, place, status, vin, phone, sizeone, sizetwo, sizethree, season } = req.query

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

    const findTyresBySeason = () => {
      if (season) {
        return {
          $or: [
            {
              order: {
                $elemMatch: {
                  season: season.toString()
                }
              }
            },
            {
              preorder: {
                $elemMatch: {
                  season: season.toString()
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

    const sizeFilter = findTyresBySize()
    const seasonFilter = findTyresBySeason()

    const total = await Tyre.countDocuments({
      ...idFind,
      ...placeFind,
      ...statusFind,
      ...vinFind,
      ...phoneFind,
      ...sizeFilter,
      ...seasonFilter
    })

    const posts = await Tyre.find({
      ...idFind,
      ...placeFind,
      ...statusFind,
      ...vinFind,
      ...phoneFind,
      ...sizeFilter,
      ...seasonFilter
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

exports.getMonth = async (req, res) => {
  const { yearmonth } = req.query

  const list = await Tyre.find({
    'order.come': { $regex: `${yearmonth.toString()}`, $options: 'i' }
  })

  return res.json({ status: 'ok', data: list })
}

exports.getAnalysis = async (req, res) => {
  try {
    const { year, sizeFilter, season } = req.query

    // Фильтр по году
    const yearStart = new Date(`${year}-01-01`)
    const yearEnd = new Date(`${year}-12-31T23:59:59`)

    // Получаем все заказы за указанный год
    const tyres = await Tyre.find({
      date: {
        $gte: yearStart,
        $lte: yearEnd
      }
    })

    // Собираем все шины из order и preorder
    const allTyres = []
    tyres.forEach((tyre) => {
      if (tyre.order && Array.isArray(tyre.order)) {
        tyre.order.forEach((item) => {
          if (item.type === '1' && item.mode === 'full') {
            allTyres.push(item)
          }
        })
      }
      if (tyre.preorder && Array.isArray(tyre.preorder)) {
        tyre.preorder.forEach((item) => {
          if (item.type === '1' && item.mode === 'full') {
            allTyres.push(item)
          }
        })
      }
    })

    // Фильтруем по размеру (диаметру), если указан
    let filteredTyres = allTyres
    if (sizeFilter) {
      filteredTyres = filteredTyres.filter((item) => {
        const itemSize = item.sizethree ? String(item.sizethree).trim() : ''
        return itemSize === sizeFilter.toString()
      })
    }

    // Фильтруем по сезону, если указан
    if (season) {
      filteredTyres = filteredTyres.filter((item) => item.season === season)
    }

    // Группируем по типоразмеру, сезону и шипам
    const grouped = {}
    filteredTyres.forEach((item) => {
      // Нормализуем значения
      const sizeone = item.sizeone ? String(item.sizeone).trim() : ''
      const sizetwo = item.sizetwo ? String(item.sizetwo).trim() : ''
      const sizethree = item.sizethree ? String(item.sizethree).trim() : ''
      const itemSeason = item.season ? String(item.season).trim() : ''
      const stud = item.stud ? String(item.stud) : '0'

      // Пропускаем записи без размера
      if (!sizeone && !sizetwo && !sizethree) {
        return
      }

      const key = `${sizeone}_${sizetwo}_${sizethree}_${itemSeason}_${stud}`
      if (!grouped[key]) {
        grouped[key] = {
          sizeone,
          sizetwo,
          sizethree,
          season: itemSeason,
          stud,
          count: 0
        }
      }
      grouped[key].count += 1
    })

    // Преобразуем в массив и сортируем по количеству
    const result = Object.values(grouped)
      .sort((a, b) => b.count - a.count)
      .slice(0, 40)

    res.json({
      status: 'ok',
      data: result
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
