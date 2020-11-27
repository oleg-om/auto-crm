const mongoose = require('mongoose')

const CarModel = new mongoose.Schema({
  id_car_model: {
    type: String
  },
  id_car_mark: {
    type: String
  },
  name: {
    type: String
  },
  name_rus: {
    type: String
  },
  date_create: {
    type: String
  },
  date_update: {
    type: String
  },
  id_car_type: {
    type: String
  }
})

module.exports = mongoose.model('car_models', CarModel)
