const express = require('express')
const diskpaintingpriceController = require('../../controller/diskpainting.price.controller')

const router = express.Router()

router.get('/diskpaintingprice/', diskpaintingpriceController.getAll)
router.get('/diskpaintingprice/:id', diskpaintingpriceController.getOne)
router.post('/diskpaintingprice/', diskpaintingpriceController.create)
router.patch('/diskpaintingprice/:id', diskpaintingpriceController.update)
router.delete('/diskpaintingprice/:id', diskpaintingpriceController.delete)
router.delete('/diskpaintingpricedrop/', diskpaintingpriceController.deleteAll)

module.exports = router
