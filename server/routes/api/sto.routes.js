const express = require('express')
const stosController = require('../../controller/sto.controller')

const router = express.Router()

router.get('/sto/', stosController.getAll)
router.get('/sto/:id', stosController.getOne)
router.get('/stobypage/:page', stosController.getByPage)
router.get('/stofilter/', stosController.getFiltered)
router.get('/stomonth/', stosController.getMonth)
router.post('/sto/', stosController.create)
router.patch('/sto/:id', stosController.update)
router.delete('/sto/:id', stosController.delete)
router.get('/stolast/', stosController.getLastTwoDays)
router.get('/storange/', stosController.getRange)

module.exports = router
