import {
  GET_WINDOWPRICES,
  CREATE_WINDOWPRICE,
  UPDATE_WINDOWPRICE,
  DELETE_WINDOWPRICE
} from '../actions/window.prices'

const initialState = {
  list: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_WINDOWPRICES: {
      return { ...state, list: action.windowprices }
    }
    case CREATE_WINDOWPRICE: {
      return { ...state, list: [...state.list, action.windowprice] }
    }
    case UPDATE_WINDOWPRICE: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.windowprice.id === it.id ? action.windowprice : it
        })
      }
    }
    case DELETE_WINDOWPRICE: {
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

export function getWindowprices() {
  return (dispatch) => {
    fetch('/api/v1/windowprice')
      .then((r) => r.json())
      .then(({ data: windowprices }) => {
        dispatch({ type: GET_WINDOWPRICES, windowprices })
      })
  }
}

export function createWindowprice(name) {
  return (dispatch) => {
    fetch('/api/v1/windowprice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: windowprice }) => {
        dispatch({ type: CREATE_WINDOWPRICE, windowprice })
      })
  }
}

export function importWindowprice(name) {
  return (dispatch) => {
    fetch('/api/v1/windowpriceimport', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: windowprice }) => {
        dispatch({ type: CREATE_WINDOWPRICE, windowprice })
      })
  }
}

export function updateWindowprice(id, name) {
  return (dispatch) => {
    fetch(`/api/v1/windowprice/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: windowprice }) => {
        dispatch({ type: UPDATE_WINDOWPRICE, windowprice })
      })
  }
}

export function deleteWindowprice(id) {
  return (dispatch) => {
    fetch(`/api/v1/windowprice/${id}`, {
      method: 'DELETE'
    })
      .then((r) => r.json())
      .then(() => {
        dispatch({ type: DELETE_WINDOWPRICE, id })
      })
  }
}

export function deleteWindowpriceDb() {
  return (dispatch) => {
    fetch(`/api/v1/windowpricedrop/`, {
      method: 'DELETE'
    })
      .then((r) => r.json())
      .then(() => {
        dispatch({ type: DELETE_WINDOWPRICE })
      })
  }
}
