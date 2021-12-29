import { GET_OILS, CREATE_OIL, UPDATE_OIL, DELETE_OIL } from '../actions/oils'
import { socket } from '../sockets/socketReceivers'

socket.connect()

const initialState = {
  list: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_OILS: {
      return { ...state, list: action.oils }
    }
    case CREATE_OIL: {
      return { ...state, list: [...state.list, action.oil] }
    }
    case UPDATE_OIL: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.oil.id === it.id ? action.oil : it
        })
      }
    }
    case DELETE_OIL: {
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

export function getOils() {
  return (dispatch) => {
    fetch('/api/v1/oil')
      .then((r) => r.json())
      .then(({ data: oils }) => {
        dispatch({ type: GET_OILS, oils })
      })
  }
}

export function createOil(name) {
  return (dispatch) => {
    fetch('/api/v1/oil', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: oil }) => {
        socket.emit('new oil', { oil })
        dispatch({ type: CREATE_OIL, oil })
      })
  }
}

export function updateOil(id, name) {
  return (dispatch) => {
    fetch(`/api/v1/oil/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: oil }) => {
        dispatch({ type: UPDATE_OIL, oil })
      })
  }
}

export function deleteOil(id) {
  return (dispatch) => {
    fetch(`/api/v1/oil/${id}`, {
      method: 'DELETE'
    })
      .then((r) => r.json())
      .then(() => {
        dispatch({ type: DELETE_OIL, id })
      })
  }
}

export function getByMonthOil(yearmonth) {
  return (dispatch) => {
    fetch(`/api/v1/oilmonth?yearmonth=${yearmonth}`)
      .then((r) => r.json())
      .then(({ data: oils }) => {
        dispatch({ type: GET_OILS, oils })
      })
  }
}
