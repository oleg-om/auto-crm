const express = require('express')
const employeeController = require('../../controller/employeeReport.controller')

const router = express.Router()

router.get('/employeereport/', employeeController.getAll)
router.get('/employeereport/:id', employeeController.getOne)
router.get('/employeereportmonth/', employeeController.getMonth)
router.post('/employeereport/', employeeController.create)
router.patch('/employeereport/:id', employeeController.update)
router.delete('/employeereport/:id', employeeController.delete)

module.exports = router
