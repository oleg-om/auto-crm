const express = require('express')
const carController = require('../../controller/car.controller')

const router = express.Router()

router.get('/carmark/', carController.getAllMarks)
router.get('/carmark/:id', carController.getOneMark)
router.post('/carmark/', carController.createMark)
router.get('/carmodels/', carController.getAllModels)
router.get('/carmodel/:id', carController.getModelbyMark)
router.get('/cargens', carController.getAllGens)
router.post('/cargen/', carController.createGen)
router.get('/cargen/:id', carController.getGenbyModel)
router.get('/carmods', carController.getAllMods)
router.get('/carmod/:id', carController.getModbyGen)
router.get('/carserie/:id', carController.getSerbyGen)

module.exports = router
