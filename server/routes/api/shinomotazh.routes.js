const express = require('express')
const shinomontazhsController = require('../../controller/shinomontazh.controller')

const router = express.Router()

router.get('/shinomontazh/', shinomontazhsController.getAll)
router.get('/shinomontazh/:id', shinomontazhsController.getOne)
router.post('/shinomontazh/', shinomontazhsController.create)
router.patch('/shinomontazh/:id', shinomontazhsController.update)
router.delete('/shinomontazh/:id', shinomontazhsController.delete)
router.get('/shinomontazhlast/', shinomontazhsController.getLastTwoDays)

module.exports = router
