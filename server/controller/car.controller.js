const CarMark = require('../model/car.mark')
const CarModel = require('../model/car.model')
const CarGeneration = require('../model/car.generation')
const CarModification = require('../model/car.modification')
const CarSerie = require('../model/car.serie')

exports.getAllMarks = async (req, res) => {
  const list = await CarMark.find({})
  return res.json({ status: 'ok', data: list })
}

exports.createMark = async (req, res) => {
  const car = new CarMark(req.body)
  await car.save()
  return res.json({ status: 'ok', data: car })
}
exports.getOneMark = async (req, res) => {
  const car = await CarMark.findOne({ id_car_mark: req.params.id })
  return res.json({ status: 'ok', data: car })
}

exports.getAllModels = async (req, res) => {
  const list = await CarModel.find({})
  return res.json({ status: 'ok', data: list })
}
exports.getModelbyMark = async (req, res) => {
  const car = await CarModel.find({ id_car_mark: req.params.id })
  return res.json({ status: 'ok', data: car })
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
exports.getGenbyModel = async (req, res) => {
  const car = await CarGeneration.find({ id_car_model: req.params.id })
  return res.json({ status: 'ok', data: car })
}

exports.getAllMods = async (req, res) => {
  const list = await CarModification.find({})
  return res.json({ status: 'ok', data: list })
}
exports.getModbyGen = async (req, res) => {
  const car = await CarModification.find({ id_car_model: req.params.id })
  return res.json({ status: 'ok', data: car })
}
exports.getSerbyGen = async (req, res) => {
  const car = await CarSerie.find({ id_car_generation: req.params.id })
  return res.json({ status: 'ok', data: car })
}
