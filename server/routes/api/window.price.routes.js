const express = require('express')
const condpriceController = require('../../controller/cond.price.controller')

const router = express.Router()

router.get('/condprice/', condpriceController.getAll)
router.get('/condprice/:id', condpriceController.getOne)
router.post('/condprice/', condpriceController.create)
router.patch('/condprice/:id', condpriceController.update)
router.delete('/condprice/:id', condpriceController.delete)
router.post('/condpriceimport/', condpriceController.import)
router.delete('/condpricedrop/', condpriceController.deleteAll)

module.exports = router
