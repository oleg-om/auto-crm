const mongoose = require('mongoose')
const uuid = require('uuid')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const dateNow = new Date()
const Place = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  id: {
    type: String,
    unique: true,
    default: () => uuid.v4()
  },
  date: {
    type: String,
    default: () =>
      `${dateNow.getDate()}.${
        dateNow.getMonth() + 1
      }.${dateNow.getFullYear()} ${dateNow.getHours()}:${dateNow
        .getMinutes()
        .toString()
        .replace(/^(\d)$/, '0$1')}`
  },
  razval: {
    type: String,
    required: false
  },
  razvalquantity: {
    type: String,
    required: false
  },
  oil: {
    type: String,
    required: false
  },
  oilquantity: {
    type: String,
    required: false
  },
  autopartsphone: {
    type: String,
    required: false
  },
  razvalphone: {
    type: String,
    required: false
  },
  shinomontazh: {
    type: String,
    required: false
  },
  shinomontazhquantity: {
    type: String,
    required: false
  },
  shinostavka: {
    type: String,
    required: false
  },
  shinomontazhphone: {
    type: String,
    required: false
  },
  shinomeaning: {
    type: String,
    required: false
  },
  stophone: {
    type: String,
    required: false
  },
  stoboxes: {
    type: Number,
    required: false
  },
  washphone: {
    type: String,
    required: false
  },
  washboxes: {
    type: Number,
    required: false
  },
  razvalAndOilType: {
    type: String,
    required: false,
    default: () => 'classic'
  },
  shinomontazhType: {
    type: String,
    required: false,
    default: () => 'classic'
  }
})

Place.plugin(AutoIncrement, { inc_field: 'id_place' })

module.exports = mongoose.model('places', Place)
