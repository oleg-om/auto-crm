import {
  GET_AUTOPARTS,
  GET_AUTOPART,
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
      return {
        ...state,
        list: action.autoparts,
        isLoaded: action.isLoaded,
        currentPage: action.currentPage,
        numberOfPages: action.numberOfPages
      }
    }
    case GET_AUTOPART: {
      return { ...state, item: [action.autopart], isLoaded: action.isLoaded }
    }

    case CREATE_AUTOPART: {
      return { ...state, list: [action.autopart, ...state.list] }
    }
    case UPDATE_AUTOPART: {
      return {
        ...state,
        list: state?.list?.map((it) => {
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
    dispatch({ type: GET_AUTOPARTS, isLoaded: false })
    fetch('/api/v1/autopart')
      .then((r) => r.json())
      .then(({ data: autoparts }) => {
        dispatch({ type: GET_AUTOPARTS, autoparts, isLoaded: true })
      })
  }
}

export function getAutopartsByPage(page) {
  return (dispatch) => {
    dispatch({ type: GET_AUTOPARTS, isLoaded: false })
    fetch(`/api/v1/autopartsbypage/${page}`)
      .then((r) => r.json())
      .then(({ data: autoparts, currentPage, numberOfPages }) => {
        dispatch({ type: GET_AUTOPARTS, autoparts, currentPage, numberOfPages, isLoaded: true })
      })
  }
}

export function getAutopartsFiltered(page, status, process, place, phone, number, reg) {
  return (dispatch) => {
    dispatch({ type: GET_AUTOPARTS, isLoaded: false })
    fetch(
      `/api/v1/autopartsfilter${page ? `?page=${page}` : ''}${status ? `&status=${status}` : ''}${
        process ? `&process=${process}` : ''
      }${place ? `&place=${place}` : ''}${phone ? `&phone=${phone}` : ''}${
        number ? `&number=${number}` : ''
      }${reg ? `&reg=${reg}` : ''}`
    )
      .then((r) => r.json())
      .then(({ data: autoparts, currentPage, numberOfPages }) => {
        dispatch({ type: GET_AUTOPARTS, autoparts, currentPage, numberOfPages, isLoaded: true })
      })
  }
}

export function getAutopart(id) {
  return (dispatch) => {
    fetch(`/api/v1/autopart/${id}`)
      .then((r) => r.json())
      .then(({ data: autopart }) => {
        dispatch({ type: GET_AUTOPART, autopart })
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
