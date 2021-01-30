const express = require('express')
const tyresController = require('../../controller/tyres.controller')

const router = express.Router()

router.get('/tyre/', tyresController.getAll)
router.get('/tyre/:id', tyresController.getOne)
router.post('/tyre/', tyresController.create)
router.patch('/tyre/:id', tyresController.update)
router.delete('/tyre/:id', tyresController.delete)

module.exports = router
