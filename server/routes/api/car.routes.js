const express = require('express')
const carController = require('../../controller/car.controller')

const router = express.Router()

// car_mark.csv
router.get('/carmark/', carController.getAllMarks)
router.get('/carmark/:id', carController.getOneMark)
router.post('/carmark/', carController.createMark)
router.post('/carmark/:key', carController.createManyMarks)
router.delete('/carmark/:key', carController.deleteAllMarks)

// car_model.csv
router.get('/carmodels/', carController.getAllModels)
router.post('/carmodels/:id', carController.createModel)
router.get('/carmodel/:id', carController.getModelbyMark)
router.post('/carmodel/:key', carController.createManyModels)
router.delete('/carmodel/:key', carController.deleteAllModels)

// car_generation.csv
router.get('/cargens', carController.getAllGens)
router.post('/cargen/', carController.createGen)
router.get('/cargen/:id', carController.getGenbyModel)
router.post('/cargen/:key', carController.createManyGens)
router.delete('/cargen/:key', carController.deleteAllGens)

// car_modification.csv
router.get('/carmods', carController.getAllMods)
router.get('/carmod/:id', carController.getModbyGen)
router.post('/carmod/:key', carController.createManyMods)
router.delete('/carmod/:key', carController.deleteAllMods)

// car_serie.csv
router.get('/carserie/:id', carController.getSerbyGen)
router.post('/carserie/', carController.createSer)
router.post('/carserie/:key', carController.createManySeries)
router.delete('/carserie/:key', carController.deleteAllSeries)

module.exports = router
