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
        numberOfPages: action.numberOfPages,
        total: action.total
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
        list: (state.list || []).map((it) => {
          return action.customer.id === it.id ? action.customer : it
        })
      }
    }
    case DELETE_CUSTOMER: {
      return {
        ...state,
        list: (state.list || []).filter((it) => {
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

export function getItemsByPage(page, limit) {
  return (dispatch) => {
    dispatch({ type: GET_CUSTOMERS, isLoaded: false })
    const qs = limit ? `?limit=${limit}` : ''
    fetch(`/api/v1/customerbypage/${page}${qs}`)
      .then((r) => r.json())
      .then(({ data: customers, currentPage, numberOfPages, total }) => {
        dispatch({
          type: GET_CUSTOMERS,
          customers,
          currentPage,
          numberOfPages,
          total,
          isLoaded: true
        })
      })
  }
}

// Accepts a plain params object (page, limit, phone, reg, organization, ...)
// and builds the query string itself - the list scene no longer needs its
// own query-string building for this endpoint.
export function getItemsFiltered(params) {
  return (dispatch) => {
    dispatch({ type: GET_CUSTOMERS, isLoaded: false })
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== '')
    )
    const qs = new URLSearchParams(cleanParams).toString()
    fetch(`/api/v1/customerfilter?${qs}`)
      .then((r) => r.json())
      .then(({ data: customers, currentPage, numberOfPages, total }) => {
        dispatch({
          type: GET_CUSTOMERS,
          customers,
          currentPage,
          numberOfPages,
          total,
          isLoaded: true
        })
      })
  }
}
