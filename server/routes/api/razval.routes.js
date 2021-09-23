const express = require('express')
const razvalController = require('../../controller/razval.controller')

const router = express.Router()

router.get('/razval/', razvalController.getAll)
router.get('/razval/:id', razvalController.getOne)
router.get('/razvalmonth/', razvalController.getMonth)
router.post('/razval/', razvalController.create)
router.patch('/razval/:id', razvalController.update)
router.delete('/razval/:id', razvalController.delete)

module.exports = router
