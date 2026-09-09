// Mirrors server/model/employee.js. Kept in sync by hand - there's no shared
// schema/codegen between client and server, so when the Mongoose schema
// changes, update this too.
export interface IEmployee {
  _id: string
  id: string
  id_employee: number
  name: string
  surname?: string
  role: string[]
  address: string[]
  numberId?: string
  class?: string
  stoPercent?: number
  shinomontazhPercent?: number
  oformlen?: boolean
  oformlenNalog?: number
  cardSum?: number
  positionId?: string
  positionIdAdditional?: string
  date?: string
}
