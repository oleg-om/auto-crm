const express = require('express')
const taskController = require('../../controller/task.controller')

const router = express.Router()

router.get('/task/', taskController.getAll)
router.get('/task/:id', taskController.getOne)
router.post('/task/', taskController.create)
router.patch('/task/:id', taskController.update)
router.delete('/task/:id', taskController.delete)

module.exports = router
