// Mirrors server/model/place.js. Kept in sync by hand - there's no shared
// schema/codegen between client and server, so when the Mongoose schema
// changes, update this too.
export interface IPlace {
  _id: string
  id: string
  id_place: number
  name: string
  date?: string
  razval?: string
  razvalquantity?: string
  oil?: string
  oilquantity?: string
  autopartsphone?: string
  razvalphone?: string
  shinomontazh?: string
  shinomontazhquantity?: string
  shinostavka?: string
  shinomontazhphone?: string
  shinomeaning?: string
  stophone?: string
  stoboxes?: number
  washphone?: string
  washboxes?: number
  razvalAndOilType?: string
  shinomontazhType?: string
  workTime?: number
  sto?: string
  stoType?: string
  oilType?: string
  boostShinomontazhPrices?: boolean
}
