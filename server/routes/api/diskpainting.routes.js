const express = require('express')
const diskpaintingController = require('../../controller/diskpainting.controller')

const router = express.Router()

router.get('/diskpainting/', diskpaintingController.getAll)
router.get('/diskpainting/:id', diskpaintingController.getOne)
router.get('/diskpaintingbypage/:page', diskpaintingController.getByPage)
router.get('/diskpaintingfilter/', diskpaintingController.getFiltered)
router.get('/diskpaintingmonth/', diskpaintingController.getMonth)
router.post('/diskpainting/', diskpaintingController.create)
router.patch('/diskpainting/:id', diskpaintingController.update)
router.delete('/diskpainting/:id', diskpaintingController.delete)
router.get('/diskpaintinglast/', diskpaintingController.getLastTwoDays)
router.get('/diskpaintingrange/', diskpaintingController.getRange)

module.exports = router
