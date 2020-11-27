const mongoose = require('mongoose')

const CarModification = new mongoose.Schema({
  id_car_modification: {
    type: String
  },
  id_car_serie: {
    type: String
  },
  id_car_model: {
    type: String
  },
  name: {
    type: String
  },
  start_production_year: {
    type: String
  },
  end_production_year: {
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

module.exports = mongoose.model('car_modifications', CarModification)
