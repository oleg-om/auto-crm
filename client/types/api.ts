// Shape every server/controller/*.js handler responds with (see e.g.
// server/controller/employee.controller.js) - `res.json({ status: 'ok', data })`.
export interface IApiResponse<T> {
  status: string
  data: T
}
