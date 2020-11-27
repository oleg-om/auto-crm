const mongoose = require('mongoose')

const CarMark = new mongoose.Schema({
  id_car_mark: {
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

module.exports = mongoose.model('car_marks', CarMark)
