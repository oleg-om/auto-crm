const express = require('express')
const accountController = require('../../controller/account.controller')

const router = express.Router()

router.get('/account/', accountController.getAll)
router.get('/account/:id', accountController.getOne)
router.patch('/account/:id', accountController.update)
router.delete('/account/:id', accountController.delete)

module.exports = router
