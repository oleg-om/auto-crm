import {
  GET_CONDPRICES,
  CREATE_CONDPRICE,
  UPDATE_CONDPRICE,
  DELETE_CONDPRICE
} from '../actions/cond.prices'

const initialState = {
  list: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CONDPRICES: {
      return { ...state, list: action.condprices }
    }
    case CREATE_CONDPRICE: {
      return { ...state, list: [...state.list, action.condprice] }
    }
    case UPDATE_CONDPRICE: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.condprice.id === it.id ? action.condprice : it
        })
      }
    }
    case DELETE_CONDPRICE: {
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

export function getCondprices() {
  return (dispatch) => {
    fetch('/api/v1/condprice')
      .then((r) => r.json())
      .then(({ data: condprices }) => {
        dispatch({ type: GET_CONDPRICES, condprices })
      })
  }
}

export function createCondprice(name) {
  return (dispatch) => {
    fetch('/api/v1/condprice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: condprice }) => {
        dispatch({ type: CREATE_CONDPRICE, condprice })
      })
  }
}

export function importCondprice(name) {
  return (dispatch) => {
    fetch('/api/v1/condpriceimport', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: condprice }) => {
        dispatch({ type: CREATE_CONDPRICE, condprice })
      })
  }
}

export function updateCondprice(id, name) {
  return (dispatch) => {
    fetch(`/api/v1/condprice/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: condprice }) => {
        dispatch({ type: UPDATE_CONDPRICE, condprice })
      })
  }
}

export function deleteCondprice(id) {
  return (dispatch) => {
    fetch(`/api/v1/condprice/${id}`, {
      method: 'DELETE'
    })
      .then((r) => r.json())
      .then(() => {
        dispatch({ type: DELETE_CONDPRICE, id })
      })
  }
}

export function deleteCondpriceDb() {
  return (dispatch) => {
    fetch(`/api/v1/condpricedrop/`, {
      method: 'DELETE'
    })
      .then((r) => r.json())
      .then(() => {
        dispatch({ type: DELETE_CONDPRICE })
      })
  }
}
