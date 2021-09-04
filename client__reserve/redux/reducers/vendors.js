import { GET_VENDORS, CREATE_VENDOR, UPDATE_VENDOR, DELETE_VENDOR } from '../actions/vendors'

const initialState = {
  list: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_VENDORS: {
      return { ...state, list: action.vendors }
    }
    case CREATE_VENDOR: {
      return { ...state, list: [...state.list, action.vendor] }
    }
    case UPDATE_VENDOR: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.vendor.id === it.id ? action.vendor : it
        })
      }
    }
    case DELETE_VENDOR: {
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

export function getVendors() {
  return (dispatch) => {
    fetch('/api/v1/vendor')
      .then((r) => r.json())
      .then(({ data: vendors }) => {
        dispatch({ type: GET_VENDORS, vendors })
      })
  }
}

export function createVendor(name) {
  return (dispatch) => {
    fetch('/api/v1/vendor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: vendor }) => {
        dispatch({ type: CREATE_VENDOR, vendor })
      })
  }
}

export function updateVendor(id, name) {
  return (dispatch) => {
    fetch(`/api/v1/vendor/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: vendor }) => {
        dispatch({ type: UPDATE_VENDOR, vendor })
      })
  }
}

export function deleteVendor(id) {
  return (dispatch) => {
    fetch(`/api/v1/vendor/${id}`, {
      method: 'DELETE'
    })
      .then((r) => r.json())
      .then(() => {
        dispatch({ type: DELETE_VENDOR, id })
      })
  }
}
