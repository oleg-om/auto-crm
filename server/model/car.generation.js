const mongoose = require('mongoose')

const CarGeneration = new mongoose.Schema({
  id_car_generation: {
    type: String
  },
  id_car_model: {
    type: String
  },
  name: {
    type: String
  },
  year_begin: {
    type: String
  },
  year_end: {
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

module.exports = mongoose.model('car_generations', CarGeneration)
