const express = require('express')
const windowpriceController = require('../../controller/window.price.controller')

const router = express.Router()

router.get('/windowprice/', windowpriceController.getAll)
router.get('/windowprice/:id', windowpriceController.getOne)
router.post('/windowprice/', windowpriceController.create)
router.patch('/windowprice/:id', windowpriceController.update)
router.delete('/windowprice/:id', windowpriceController.delete)
router.post('/windowpriceimport/', windowpriceController.import)
router.delete('/windowpricedrop/', windowpriceController.deleteAll)

module.exports = router
