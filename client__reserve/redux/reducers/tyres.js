import { GET_TYRES, CREATE_TYRE, UPDATE_TYRE_STATUS, UPDATE_TYRE } from '../actions/tyres'
import { socket } from '../sockets/socketReceivers'

socket.connect()

const initialState = {
  list: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_TYRES: {
      return { ...state, list: action.tyres }
    }
    case CREATE_TYRE: {
      return { ...state, list: [...state.list, action.tyre] }
    }
    case UPDATE_TYRE: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.tyre.id_tyres === it.id_tyres ? action.tyre : it
        })
      }
    }
    case UPDATE_TYRE_STATUS: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.tyre.id === it.id ? action.tyre : it
        })
      }
    }

    default:
      return state
  }
}

export function getTyres() {
  return (dispatch) => {
    fetch('/api/v1/tyre')
      .then((r) => r.json())
      .then(({ data: tyres }) => {
        dispatch({ type: GET_TYRES, tyres })
      })
  }
}

export function getTyre() {
  return (dispatch) => {
    fetch('/api/v1/tyre:uuid')
      .then((r) => r.json())
      .then(({ data: tyre }) => {
        dispatch({ type: GET_TYRES, tyre })
      })
  }
}

export function createTyre(name) {
  return (dispatch) => {
    fetch('/api/v1/tyre', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: tyre }) => {
        socket.emit('new tyre', { tyre })
        dispatch({ type: CREATE_TYRE, tyre })
      })
  }
}

export function updateStatus(id, status) {
  return (dispatch) => {
    fetch(`/api/v1/tyre/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status
      })
    })
      .then((r) => r.json())
      .then(({ data: tyre }) => {
        dispatch({ type: UPDATE_TYRE_STATUS, tyre })
      })
  }
}

export function updateTyre(id, name) {
  return (dispatch) => {
    fetch(`/api/v1/tyre/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: tyre }) => {
        dispatch({ type: UPDATE_TYRE, tyre })
      })
  }
}
