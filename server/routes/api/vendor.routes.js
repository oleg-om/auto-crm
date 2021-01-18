const express = require('express')
const vendorController = require('../../controller/vendor.controller')

const router = express.Router()

router.get('/vendor/', vendorController.getAll)
router.get('/vendor/:id', vendorController.getOne)
router.post('/vendor/', vendorController.create)
router.patch('/vendor/:id', vendorController.update)
router.delete('/vendor/:id', vendorController.delete)

module.exports = router
