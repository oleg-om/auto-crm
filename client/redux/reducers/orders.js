import { GET_ORDERS } from "../actions/orders"

const initialState = {
  lol: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ORDERS: {
      return { ...state, lol: action.employees }
    }
    default:
      return state
  }
}

export function getOrders() {
  return (dispatch) => {
    fetch("/api/v1/employee")
      .then((r) => r.json())
      .then(({ data: employees }) => {
        dispatch({ type: GET_ORDERS, employees })
      })
  }
}
