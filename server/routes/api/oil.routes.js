const express = require('express')
const oilController = require('../../controller/oil.controller')

const router = express.Router()

router.get('/oil/', oilController.getAll)
router.get('/oil/:id', oilController.getOne)
router.get('/oilmonth/', oilController.getMonth)
router.post('/oil/', oilController.create)
router.patch('/oil/:id', oilController.update)
router.delete('/oil/:id', oilController.delete)

module.exports = router
