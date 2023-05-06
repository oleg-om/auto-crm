import {
  GET_CUSTOMERS,
  GET_CUSTOMER,
  CREATE_CUSTOMER,
  UPDATE_CUSTOMER,
  DELETE_CUSTOMER
} from '../actions/customer'

const initialState = {
  list: [],
  item: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CUSTOMERS: {
      return {
        ...state,
        list: action.customers,
        isLoaded: action.isLoaded,
        currentPage: action.currentPage,
        numberOfPages: action.numberOfPages
      }
    }
    case GET_CUSTOMER: {
      return { ...state, item: [action.customer], isLoaded: action.isLoaded }
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
    dispatch({ type: GET_CUSTOMERS, isLoaded: false })
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
export function getCustomer(id) {
  return (dispatch) => {
    fetch(`/api/v1/customer/${id}`)
      .then((r) => r.json())
      .then(({ data: customer }) => {
        dispatch({ type: GET_CUSTOMER, customer, isLoaded: true })
      })
  }
}

export function getItemsByPage(page) {
  return (dispatch) => {
    dispatch({ type: GET_CUSTOMERS, isLoaded: false })
    fetch(`/api/v1/customerbypage/${page}`)
      .then((r) => r.json())
      .then(({ data: customers, currentPage, numberOfPages }) => {
        dispatch({ type: GET_CUSTOMERS, customers, currentPage, numberOfPages, isLoaded: true })
      })
  }
}

export function getItemsFiltered(page, vin, reg, phone) {
  return (dispatch) => {
    dispatch({ type: GET_CUSTOMERS, isLoaded: false })
    fetch(
      `/api/v1/customerfilter${page ? `?page=${page}` : ''}${reg ? `&reg=${reg}` : ''}${
        vin ? `&vin=${vin}` : ''
      }${phone ? `&phone=${phone}` : ''}`
    )
      .then((r) => r.json())
      .then(({ data: customers, currentPage, numberOfPages }) => {
        dispatch({ type: GET_CUSTOMERS, customers, currentPage, numberOfPages, isLoaded: true })
      })
  }
}
