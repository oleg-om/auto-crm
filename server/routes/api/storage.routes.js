const express = require('express')
const storagesController = require('../../controller/storage.controller')

const router = express.Router()

router.get('/storage/', storagesController.getAll)
router.get('/storage/:id', storagesController.getOne)
router.get('/storagebypage/:page', storagesController.getByPage)
router.get('/storagefilter/', storagesController.getFiltered)
router.post('/storage/', storagesController.create)
router.patch('/storage/:id', storagesController.update)
router.patch('/storagestatus/:id', storagesController.updateStatus)
router.delete('/storage/:id', storagesController.delete)

module.exports = router
