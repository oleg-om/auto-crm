const express = require('express')
const shinomontazhsController = require('../../controller/shinomontazh.controller')

const router = express.Router()

router.get('/shinomontazh/', shinomontazhsController.getAll)
router.get('/shinomontazh/:id', shinomontazhsController.getOne)
router.get('/shinomontazhbypage/:page', shinomontazhsController.getByPage)
router.get('/shinomontazhfilter/', shinomontazhsController.getFiltered)
router.post('/shinomontazhmonth/', shinomontazhsController.getMonth)
router.post('/shinomontazh/', shinomontazhsController.create)
router.patch('/shinomontazh/:id', shinomontazhsController.update)
router.delete('/shinomontazh/:id', shinomontazhsController.delete)
router.get('/shinomontazhlast/', shinomontazhsController.getLastTwoDays)
router.get('/shinomontazhrange/', shinomontazhsController.getRange)
router.get('/shinomontazhpreentry/', shinomontazhsController.getMonthForPreentry)
// router.delete('/shinomontazh-remove-old', shinomontazhsController.removeOld)

module.exports = router
