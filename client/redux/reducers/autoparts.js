import {
  GET_AUTOPARTS,
  CREATE_AUTOPART,
  UPDATE_AUTOPART_STATUS,
  UPDATE_AUTOPART
} from '../actions/autoparts'
import { socket } from '../sockets/socketReceivers'

socket.connect()

const initialState = {
  list: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_AUTOPARTS: {
      return { ...state, list: action.autoparts }
    }
    case CREATE_AUTOPART: {
      return { ...state, list: [...state.list, action.autopart] }
    }
    case UPDATE_AUTOPART: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.autopart.id_autoparts === it.id_autoparts ? action.autopart : it
        })
      }
    }
    case UPDATE_AUTOPART_STATUS: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.autopart.id === it.id ? action.autopart : it
        })
      }
    }

    default:
      return state
  }
}

export function getAutoparts() {
  return (dispatch) => {
    fetch('/api/v1/autopart')
      .then((r) => r.json())
      .then(({ data: autoparts }) => {
        dispatch({ type: GET_AUTOPARTS, autoparts })
      })
  }
}

export function getAutopart() {
  return (dispatch) => {
    fetch('/api/v1/autopart:uuid')
      .then((r) => r.json())
      .then(({ data: autopart }) => {
        dispatch({ type: GET_AUTOPARTS, autopart })
      })
  }
}

export function createAutopart(name) {
  return (dispatch) => {
    fetch('/api/v1/autopart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: autopart }) => {
        socket.emit('new autopart', { autopart })
        dispatch({ type: CREATE_AUTOPART, autopart })
      })
  }
}

export function updateStatus(id, status) {
  return (dispatch) => {
    fetch(`/api/v1/autopart/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status
      })
    })
      .then((r) => r.json())
      .then(({ data: autopart }) => {
        dispatch({ type: UPDATE_AUTOPART_STATUS, autopart })
      })
  }
}

export function updateAutopart(id, name) {
  return (dispatch) => {
    fetch(`/api/v1/autopart/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: autopart }) => {
        dispatch({ type: UPDATE_AUTOPART, autopart })
      })
  }
}
