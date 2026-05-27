const mongoose = require('mongoose')
const uuid = require('uuid')
const AutoIncrement = require('mongoose-sequence')(mongoose)
const statusTypes = require('../../common/enums/shinomontazh-statuses')

const Diskpainting = new mongoose.Schema({
  employee: { type: Array, required: false },
  place: { type: String, required: false },
  status: { type: String, enum: statusTypes, default: statusTypes[0] },
  regnumber: { type: String, required: false },
  kuzov: { type: String, required: false },
  diametr: { type: String, required: false },
  mark: { type: String, required: false },
  model: { type: String, required: false },
  discount: { type: String, required: false },
  services: { type: Array, required: false },
  material: { type: Array, required: false },
  comment: { type: String, required: false },
  id: { type: String, unique: true, default: () => uuid.v4() },
  date: { type: Date },
  dateStart: { type: Date },
  dateFinish: { type: Date },
  payment: { type: String, required: false },
  combTerm: { type: String, required: false },
  combCash: { type: String, required: false },
  box: { type: Number, required: false },
  access: { type: String, required: false },
  customerId: { type: String, required: false },
  groupCount: { type: Number, required: false },
  beznalPaid: { type: Date, required: false },
  organizationId: { type: String, required: false }
})

Diskpainting.plugin(AutoIncrement, { inc_field: 'id_diskpaintings' })
Diskpainting.index({ place: 1, id_diskpaintings: 1, regnumber: 1, 'employee.id': 1, dateStart: -1 })
Diskpainting.index({ dateStart: -1 })
Diskpainting.index({ place: 1, dateStart: -1 })
Diskpainting.index({ dateFinish: -1 })

module.exports = mongoose.model('diskpaintings', Diskpainting)
