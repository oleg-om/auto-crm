const express = require('express')
const washpriceController = require('../../controller/wash.price.controller')

const router = express.Router()

router.get('/washprice/', washpriceController.getAll)
router.get('/washprice/:id', washpriceController.getOne)
router.post('/washprice/', washpriceController.create)
router.patch('/washprice/:id', washpriceController.update)
router.delete('/washprice/:id', washpriceController.delete)
router.post('/washpriceimport/', washpriceController.import)
router.delete('/washpricedrop/', washpriceController.deleteAll)

module.exports = router
