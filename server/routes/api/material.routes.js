const express = require('express')
const materialController = require('../../controller/material.controller')

const router = express.Router()

router.get('/material/', materialController.getAll)
router.get('/material/:id', materialController.getOne)
router.post('/material/', materialController.create)
router.patch('/material/:id', materialController.update)
router.delete('/material/:id', materialController.delete)
router.post('/materialimport/', materialController.import)
router.delete('/materialdrop/', materialController.deleteAll)
// router.get('/washrange/', washsController.getRange)

module.exports = router
