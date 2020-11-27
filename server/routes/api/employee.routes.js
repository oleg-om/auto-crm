const express = require('express')
const employeeController = require('../../controller/employee.controller')

const router = express.Router()

router.get('/employee/', employeeController.getAll)
router.get('/employee/:id', employeeController.getOne)
router.post('/employee/', employeeController.create)
router.patch('/employee/:id', employeeController.update)
router.delete('/employee/:id', employeeController.delete)

module.exports = router
