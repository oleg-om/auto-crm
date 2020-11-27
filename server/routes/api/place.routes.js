const express = require('express')
const placeController = require('../../controller/place.controller')

const router = express.Router()

router.get('/place/', placeController.getAll)
router.get('/place/:id', placeController.getOne)
router.post('/place/', placeController.create)
router.patch('/place/:id', placeController.update)
router.delete('/place/:id', placeController.delete)

module.exports = router
