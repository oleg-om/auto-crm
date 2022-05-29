const express = require('express')
const washsController = require('../../controller/wash.controller')

const router = express.Router()

router.get('/wash/', washsController.getAll)
router.get('/wash/:id', washsController.getOne)
router.get('/washbypage/:page', washsController.getByPage)
router.get('/washfilter/', washsController.getFiltered)
router.get('/washmonth/', washsController.getMonth)
router.post('/wash/', washsController.create)
router.patch('/wash/:id', washsController.update)
router.delete('/wash/:id', washsController.delete)
router.get('/washlast/', washsController.getLastTwoDays)
router.get('/washrange/', washsController.getRange)

module.exports = router
