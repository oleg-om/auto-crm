const express = require('express')
const windowsController = require('../../controller/window.controller')

const router = express.Router()

router.get('/window/', windowsController.getAll)
router.get('/window/:id', windowsController.getOne)
router.get('/windowbypage/:page', windowsController.getByPage)
router.get('/windowfilter/', windowsController.getFiltered)
router.get('/windowmonth/', windowsController.getMonth)
router.post('/window/', windowsController.create)
router.patch('/window/:id', windowsController.update)
router.delete('/window/:id', windowsController.delete)
router.get('/windowlast/', windowsController.getLastTwoDays)
router.get('/windowrange/', windowsController.getRange)
router.get('/windowpreentry/', windowsController.getMonthForPreentry)

module.exports = router
