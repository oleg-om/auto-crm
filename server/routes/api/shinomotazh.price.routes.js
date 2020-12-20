const express = require('express')
const shinomontazhpriceController = require('../../controller/shinomontazh.price.controller')

const router = express.Router()

router.get('/shinomontazhprice/', shinomontazhpriceController.getAll)
router.get('/shinomontazhprice/:id', shinomontazhpriceController.getOne)
router.post('/shinomontazhprice/', shinomontazhpriceController.create)
router.patch('/shinomontazhprice/:id', shinomontazhpriceController.update)
router.delete('/shinomontazhprice/:id', shinomontazhpriceController.delete)
router.post('/shinomontazhpriceimport/', shinomontazhpriceController.import)
router.delete('/shinomontazhpricedrop/', shinomontazhpriceController.deleteAll)

module.exports = router
