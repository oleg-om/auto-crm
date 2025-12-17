const express = require('express')
const positionController = require('../../controller/position.controller')

const router = express.Router()

router.get('/position/', positionController.getAll)
router.get('/position/:id', positionController.getOne)
router.post('/position/', positionController.create)
router.patch('/position/:id', positionController.update)
router.delete('/position/:id', positionController.delete)

// Роуты для управления обязанностями
router.post('/position/:id/duty', positionController.addDuty)
router.patch('/position/:id/duty/:dutyId', positionController.updateDuty)
router.delete('/position/:id/duty/:dutyId', positionController.deleteDuty)
router.post('/position/:id/duties/reorder', positionController.reorderDuties)

module.exports = router

