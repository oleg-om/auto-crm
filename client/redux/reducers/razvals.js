import { GET_RAZVALS, CREATE_RAZVAL, UPDATE_RAZVAL, DELETE_RAZVAL } from '../actions/razvals'
import { socket } from '../sockets/socketReceivers'

socket.connect()

const initialState = {
  list: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_RAZVALS: {
      return { ...state, list: action.razvals }
    }
    case CREATE_RAZVAL: {
      return { ...state, list: [...state.list, action.razval] }
    }
    case UPDATE_RAZVAL: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.razval.id === it.id ? action.razval : it
        })
      }
    }
    case DELETE_RAZVAL: {
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

export function getRazvals() {
  return (dispatch) => {
    fetch('/api/v1/razval')
      .then((r) => r.json())
      .then(({ data: razvals }) => {
        dispatch({ type: GET_RAZVALS, razvals })
      })
  }
}

export function createRazval(name) {
  return (dispatch) => {
    fetch('/api/v1/razval', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: razval }) => {
        socket.emit('new razval', { razval })
        dispatch({ type: CREATE_RAZVAL, razval })
      })
  }
}

export function updateRazval(id, name) {
  console.log('id redux: ', id)
  return (dispatch) => {
    fetch(`/api/v1/razval/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: razval }) => {
        dispatch({ type: UPDATE_RAZVAL, razval })
      })
  }
}

export function deleteRazval(id) {
  return (dispatch) => {
    fetch(`/api/v1/razval/${id}`, {
      method: 'DELETE'
    })
      .then((r) => r.json())
      .then(() => {
        dispatch({ type: DELETE_RAZVAL, id })
      })
  }
}

export function getByMonth(yearmonth) {
  return (dispatch) => {
    fetch(`/api/v1/razvalmonth?yearmonth=${yearmonth}`)
      .then((r) => r.json())
      .then(({ data: razvals }) => {
        dispatch({ type: GET_RAZVALS, razvals })
      })
  }
}
