import {
  GET_WASHPRICES,
  CREATE_WASHPRICE,
  UPDATE_WASHPRICE,
  DELETE_WASHPRICE
} from '../actions/wash.prices'

const initialState = {
  list: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_WASHPRICES: {
      return { ...state, list: action.washprices }
    }
    case CREATE_WASHPRICE: {
      return { ...state, list: [...state.list, action.washprice] }
    }
    case UPDATE_WASHPRICE: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.washprice.id === it.id ? action.washprice : it
        })
      }
    }
    case DELETE_WASHPRICE: {
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

export function getWashprices() {
  return (dispatch) => {
    fetch('/api/v1/washprice')
      .then((r) => r.json())
      .then(({ data: washprices }) => {
        dispatch({ type: GET_WASHPRICES, washprices })
      })
  }
}

export function createWashprice(name) {
  return (dispatch) => {
    fetch('/api/v1/washprice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: washprice }) => {
        dispatch({ type: CREATE_WASHPRICE, washprice })
      })
  }
}

export function importWashprice(name) {
  return (dispatch) => {
    fetch('/api/v1/washpriceimport', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: washprice }) => {
        dispatch({ type: CREATE_WASHPRICE, washprice })
      })
  }
}

export function updateWashprice(id, name) {
  return (dispatch) => {
    fetch(`/api/v1/washprice/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: washprice }) => {
        dispatch({ type: UPDATE_WASHPRICE, washprice })
      })
  }
}

export function deleteWashprice(id) {
  return (dispatch) => {
    fetch(`/api/v1/washprice/${id}`, {
      method: 'DELETE'
    })
      .then((r) => r.json())
      .then(() => {
        dispatch({ type: DELETE_WASHPRICE, id })
      })
  }
}

export function deleteWashpriceDb() {
  return (dispatch) => {
    fetch(`/api/v1/washpricedrop/`, {
      method: 'DELETE'
    })
      .then((r) => r.json())
      .then(() => {
        dispatch({ type: DELETE_WASHPRICE })
      })
  }
}
