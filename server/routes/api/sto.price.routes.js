const express = require('express')
const stopriceController = require('../../controller/sto.price.controller')

const router = express.Router()

router.get('/stoprice/', stopriceController.getAll)
router.get('/stoprice/:id', stopriceController.getOne)
router.post('/stoprice/', stopriceController.create)
router.patch('/stoprice/:id', stopriceController.update)
router.delete('/stoprice/:id', stopriceController.delete)
router.post('/stopriceimport/', stopriceController.import)
router.delete('/stopricedrop/', stopriceController.deleteAll)

module.exports = router
