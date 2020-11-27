const mongoose = require('mongoose')

const CarSerie = new mongoose.Schema({
  id_car_serie: {
    type: String,
    required: true
  },
  id_car_model: {
    type: String,
    required: true
  },
  id_car_generation: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
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

module.exports = mongoose.model('car_series', CarSerie)
