const express = require('express')
const autopartsController = require('../../controller/autoparts.controller')

const router = express.Router()

router.get('/autopart/', autopartsController.getAll)
router.get('/autopart/:id', autopartsController.getOne)
router.post('/autopart/', autopartsController.create)
router.patch('/autopart/:id', autopartsController.update)
router.delete('/autopart/:id', autopartsController.delete)

module.exports = router
