const express = require('express')
const condsController = require('../../controller/cond.controller')

const router = express.Router()

router.get('/cond/', condsController.getAll)
router.get('/cond/:id', condsController.getOne)
router.get('/condbypage/:page', condsController.getByPage)
router.get('/condfilter/', condsController.getFiltered)
router.get('/condmonth/', condsController.getMonth)
router.post('/cond/', condsController.create)
router.patch('/cond/:id', condsController.update)
router.delete('/cond/:id', condsController.delete)
router.get('/condlast/', condsController.getLastTwoDays)
router.get('/condrange/', condsController.getRange)
router.get('/condpreentry/', condsController.getMonthForPreentry)

module.exports = router
