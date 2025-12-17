const express = require('express')
const journalEntryController = require('../../controller/journalEntry.controller')
const workDayStartController = require('../../controller/workDayStart.controller')

const router = express.Router()

router.get('/journalEntry/', journalEntryController.getAll)
router.get('/journalEntry/:id', journalEntryController.getOne)
router.get('/journalEntry/employee/:employeeId/date/:date', journalEntryController.getByEmployeeAndDate)
router.post('/journalEntry/', journalEntryController.create)
router.post('/journalEntry/upsert', journalEntryController.upsert)
router.patch('/journalEntry/:id', journalEntryController.update)
router.delete('/journalEntry/:id', journalEntryController.delete)

// Роуты для начала рабочего дня
router.get('/workDayStart/employee/:employeeId/date/:date', workDayStartController.getByEmployeeAndDate)
router.post('/workDayStart/start', workDayStartController.startWorkDay)
router.post('/workDayStart/end', workDayStartController.endWorkDay)

module.exports = router

