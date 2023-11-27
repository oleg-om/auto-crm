const CarMark = require('../model/car.mark')
const CarModel = require('../model/car.model')
const CarGeneration = require('../model/car.generation')
const CarModification = require('../model/car.modification')
const CarSerie = require('../model/car.serie')

const ACCESS_DEMO_KEY = 'dljdfIHCCU(*HY&!'

exports.getAllMarks = async (req, res) => {
  const list = await CarMark.find({})
  return res.json({ status: 'ok', data: list })
}
exports.createMark = async (req, res) => {
  const car = new CarMark(req.body)
  await car.save()
  return res.json({ status: 'ok', data: car })
}
exports.createManyMarks = async (req, res) => {
  if (req.params.key === ACCESS_DEMO_KEY) {
    const car = await CarMark.insertMany(req.body)
    return res.json({ status: 'ok', data: car })
  }
  return res.json({ status: 'error' })
}
exports.getOneMark = async (req, res) => {
  const car = await CarMark.findOne({ id_car_mark: req.params.id })
  return res.json({ status: 'ok', data: car })
}
exports.deleteAllMarks = async (req, res) => {
  if (req.params.key === ACCESS_DEMO_KEY) {
    await CarMark.deleteMany({})
    return res.json({ status: 'ok' })
  }
  return res.json({ status: 'error' })
}

exports.getAllModels = async (req, res) => {
  const list = await CarModel.find({})
  return res.json({ status: 'ok', data: list })
}
exports.createModel = async (req, res) => {
  const car = new CarModel(req.body)
  await car.save()
  return res.json({ status: 'ok', data: car })
}
exports.createManyModels = async (req, res) => {
  if (req.params.key === ACCESS_DEMO_KEY) {
    const car = await CarModel.insertMany(req.body)
    return res.json({ status: 'ok', data: car })
  }
  return res.json({ status: 'error' })
}
exports.getModelbyMark = async (req, res) => {
  const car = await CarModel.find({ id_car_mark: req.params.id })
  return res.json({ status: 'ok', data: car })
}
exports.deleteAllModels = async (req, res) => {
  if (req.params.key === ACCESS_DEMO_KEY) {
    await CarModel.deleteMany({})
    return res.json({ status: 'ok' })
  }
  return res.json({ status: 'error' })
}

exports.getAllGens = async (req, res) => {
  const list = await CarGeneration.find({})
  return res.json({ status: 'ok', data: list })
}
exports.createGen = async (req, res) => {
  const car = new CarGeneration(req.body)
  await car.save()
  return res.json({ status: 'ok', data: car })
}
exports.createManyGens = async (req, res) => {
  if (req.params.key === ACCESS_DEMO_KEY) {
    const car = await CarGeneration.insertMany(req.body)
    return res.json({ status: 'ok', data: car })
  }
  return res.json({ status: 'error' })
}
exports.getGenbyModel = async (req, res) => {
  const car = await CarGeneration.find({ id_car_model: req.params.id })
  return res.json({ status: 'ok', data: car })
}
exports.deleteAllGens = async (req, res) => {
  if (req.params.key === ACCESS_DEMO_KEY) {
    await CarGeneration.deleteMany({})
    return res.json({ status: 'ok' })
  }
  return res.json({ status: 'error' })
}

exports.getAllMods = async (req, res) => {
  const list = await CarModification.find({})
  return res.json({ status: 'ok', data: list })
}
exports.getModbyGen = async (req, res) => {
  const car = await CarModification.find({ id_car_model: req.params.id })
  return res.json({ status: 'ok', data: car })
}
exports.createManyMods = async (req, res) => {
  if (req.params.key === ACCESS_DEMO_KEY) {
    const car = await CarModification.insertMany(req.body)
    return res.json({ status: 'ok', data: car })
  }
  return res.json({ status: 'error' })
}
exports.deleteAllMods = async (req, res) => {
  if (req.params.key === ACCESS_DEMO_KEY) {
    await CarModification.deleteMany({})
    return res.json({ status: 'ok' })
  }
  return res.json({ status: 'error' })
}

exports.getSerbyGen = async (req, res) => {
  const car = await CarSerie.find({ id_car_generation: req.params.id })
  return res.json({ status: 'ok', data: car })
}
exports.createSer = async (req, res) => {
  const car = new CarSerie(req.body)
  await car.save()
  return res.json({ status: 'ok', data: car })
}
exports.createManySeries = async (req, res) => {
  if (req.params.key === ACCESS_DEMO_KEY) {
    const car = await CarSerie.insertMany(req.body)
    return res.json({ status: 'ok', data: car })
  }
  return res.json({ status: 'error' })
}
exports.deleteAllSeries = async (req, res) => {
  if (req.params.key === ACCESS_DEMO_KEY) {
    await CarSerie.deleteMany({})
    return res.json({ status: 'ok' })
  }
  return res.json({ status: 'error' })
}
