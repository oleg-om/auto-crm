const express = require('express')
const customerController = require('../../controller/customer.controller')

const router = express.Router()

router.get('/customer/', customerController.getAll)
router.get('/customer/:id', customerController.getOne)
router.get('/customerfind/:regnumber/:vinnumber/:phone', customerController.getByFind)
router.get('/customerbypage/:page', customerController.getByPage)
router.get('/customerfilter/', customerController.getFiltered)
router.post('/customer/', customerController.create)
router.patch('/customer/:id', customerController.update)
router.delete('/customer/:id', customerController.delete)

module.exports = router
