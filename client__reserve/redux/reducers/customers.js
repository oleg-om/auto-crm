import {
  GET_CUSTOMERS,
  CREATE_CUSTOMER,
  UPDATE_CUSTOMER,
  DELETE_CUSTOMER
} from '../actions/customer'

const initialState = {
  list: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CUSTOMERS: {
      return { ...state, list: action.customers }
    }
    case CREATE_CUSTOMER: {
      return { ...state, list: [...state.list, action.customer] }
    }
    case UPDATE_CUSTOMER: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.customer.id === it.id ? action.customer : it
        })
      }
    }
    case DELETE_CUSTOMER: {
      return {
        list: state.list.filter((it) => {
          return action.id !== it.id
        })
      }
    }
    default:
      return state
  }
}

export function getCustomers() {
  return (dispatch) => {
    fetch('/api/v1/customer')
      .then((r) => r.json())
      .then(({ data: customers }) => {
        dispatch({ type: GET_CUSTOMERS, customers })
      })
  }
}

export function createCustomer(name) {
  return (dispatch) => {
    fetch('/api/v1/customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: customer }) => {
        dispatch({ type: CREATE_CUSTOMER, customer })
      })
  }
}

export function updateCustomer(id, name) {
  return (dispatch) => {
    fetch(`/api/v1/customer/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: customer }) => {
        dispatch({ type: UPDATE_CUSTOMER, customer })
      })
  }
}

export function deleteCustomer(id) {
  return (dispatch) => {
    fetch(`/api/v1/customer/${id}`, {
      method: 'DELETE'
    })
      .then((r) => r.json())
      .then(() => {
        dispatch({ type: DELETE_CUSTOMER, id })
      })
  }
}
