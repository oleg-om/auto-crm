const express = require('express')
const organizationController = require('../../controller/organization.controller')

const router = express.Router()

router.get('/organization/', organizationController.getAll)
router.get('/organization/:id', organizationController.getOne)
router.post('/organization/', organizationController.create)
router.patch('/organization/:id', organizationController.update)
router.delete('/organization/:id', organizationController.delete)

module.exports = router
