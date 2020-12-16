const express = require('express')
const settingController = require('../../controller/setting.controller')

const router = express.Router()

router.get('/setting/', settingController.getAll)
router.get('/setting/:id', settingController.getOne)
router.post('/setting/', settingController.create)
router.patch('/setting/:id', settingController.update)
router.delete('/setting/:id', settingController.delete)

module.exports = router
