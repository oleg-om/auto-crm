import {
  GET_STORAGES,
  CREATE_STORAGE,
  UPDATE_STORAGE_STATUS,
  UPDATE_STORAGE
} from '../actions/storage'
import { socket } from '../sockets/socketReceivers'

socket.connect()

const initialState = {
  list: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_STORAGES: {
      return { ...state, list: action.storages }
    }
    case CREATE_STORAGE: {
      return { ...state, list: [...state.list, action.storage] }
    }
    case UPDATE_STORAGE: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.storage.id_storages === it.id_storages ? action.storage : it
        })
      }
    }
    case UPDATE_STORAGE_STATUS: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.storage.id === it.id ? action.storage : it
        })
      }
    }

    default:
      return state
  }
}

export function getStorages() {
  return (dispatch) => {
    fetch('/api/v1/storage')
      .then((r) => r.json())
      .then(({ data: storages }) => {
        dispatch({ type: GET_STORAGES, storages })
      })
  }
}

export function getStorage() {
  return (dispatch) => {
    fetch('/api/v1/storage:uuid')
      .then((r) => r.json())
      .then(({ data: storage }) => {
        dispatch({ type: GET_STORAGES, storage })
      })
  }
}

export function createStorage(name) {
  return (dispatch) => {
    fetch('/api/v1/storage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: storage }) => {
        socket.emit('new storage', { storage })
        dispatch({ type: CREATE_STORAGE, storage })
      })
  }
}

export function updateStatus(id, status) {
  return (dispatch) => {
    fetch(`/api/v1/storage/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status
      })
    })
      .then((r) => r.json())
      .then(({ data: storage }) => {
        dispatch({ type: UPDATE_STORAGE_STATUS, storage })
      })
  }
}

export function updateStorage(id, name) {
  return (dispatch) => {
    fetch(`/api/v1/storage/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: storage }) => {
        dispatch({ type: UPDATE_STORAGE, storage })
      })
  }
}
