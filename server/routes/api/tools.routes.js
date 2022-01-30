const express = require('express')
const toolsController = require('../../controller/tools.controller')

const router = express.Router()

router.get('/tool/', toolsController.getAll)
router.get('/toollast/', toolsController.getLastOneHundred)
router.get('/toolsbypage/:page', toolsController.getByPage)
router.get('/toolsfilter/', toolsController.getFiltered)
router.get('/toolsmonth/', toolsController.getMonth)
router.get('/tool/:id', toolsController.getOne)
router.post('/tool/', toolsController.create)
router.patch('/tool/:id', toolsController.update)
router.delete('/tool/:id', toolsController.delete)

module.exports = router
