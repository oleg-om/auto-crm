const express = require('express')
const categoryController = require('../../controller/category.controller')

const router = express.Router()

router.get('/category/', categoryController.getAll)
router.get('/category/:id', categoryController.getOne)
router.post('/category/', categoryController.create)
router.patch('/category/:id', categoryController.update)
router.delete('/category/:id', categoryController.delete)

module.exports = router
