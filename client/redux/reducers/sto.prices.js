import {
  GET_STOPRICES,
  CREATE_STOPRICE,
  UPDATE_STOPRICE,
  DELETE_STOPRICE
} from '../actions/sto.prices'

const initialState = {
  list: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_STOPRICES: {
      return { ...state, list: action.stoprices }
    }
    case CREATE_STOPRICE: {
      return { ...state, list: [...state.list, action.stoprice] }
    }
    case UPDATE_STOPRICE: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.stoprice.id === it.id ? action.stoprice : it
        })
      }
    }
    case DELETE_STOPRICE: {
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

export function getStoprices() {
  return (dispatch) => {
    fetch('/api/v1/stoprice')
      .then((r) => r.json())
      .then(({ data: stoprices }) => {
        dispatch({ type: GET_STOPRICES, stoprices })
      })
  }
}

export function createStoprice(name) {
  return (dispatch) => {
    fetch('/api/v1/stoprice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: stoprice }) => {
        dispatch({ type: CREATE_STOPRICE, stoprice })
      })
  }
}

export function importStoprice(name) {
  return (dispatch) => {
    fetch('/api/v1/stopriceimport', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: stoprice }) => {
        dispatch({ type: CREATE_STOPRICE, stoprice })
      })
  }
}

export function updateStoprice(id, name) {
  return (dispatch) => {
    fetch(`/api/v1/stoprice/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: stoprice }) => {
        dispatch({ type: UPDATE_STOPRICE, stoprice })
      })
  }
}

export function deleteStoprice(id) {
  return (dispatch) => {
    fetch(`/api/v1/stoprice/${id}`, {
      method: 'DELETE'
    })
      .then((r) => r.json())
      .then(() => {
        dispatch({ type: DELETE_STOPRICE, id })
      })
  }
}

export function deleteStopriceDb() {
  return (dispatch) => {
    fetch(`/api/v1/stopricedrop/`, {
      method: 'DELETE'
    })
      .then((r) => r.json())
      .then(() => {
        dispatch({ type: DELETE_STOPRICE })
      })
  }
}
