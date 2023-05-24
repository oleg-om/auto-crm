import {
  GET_STORAGES,
  GET_STORAGE,
  CREATE_STORAGE,
  UPDATE_STORAGE_STATUS,
  UPDATE_STORAGE
} from '../actions/storage'
import { socket } from '../sockets/socketReceivers'

socket.connect()

const initialState = {
  list: [],
  item: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_STORAGES: {
      return {
        ...state,
        list: action.storages,
        isLoaded: action.isLoaded,
        currentPage: action.currentPage,
        numberOfPages: action.numberOfPages
      }
    }
    case GET_STORAGE: {
      return { ...state, item: [action.storage], isLoaded: action.isLoaded }
    }
    case CREATE_STORAGE: {
      return { ...state, list: [action.storage, ...state.list] }
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
    dispatch({ type: GET_STORAGES, isLoaded: false })
    fetch('/api/v1/storage')
      .then((r) => r.json())
      .then(({ data: storages }) => {
        dispatch({ type: GET_STORAGES, storages })
      })
  }
}

export function getStorage(id) {
  return (dispatch) => {
    fetch(`/api/v1/storage/${id}`)
      .then((r) => r.json())
      .then(({ data: storage }) => {
        dispatch({ type: GET_STORAGE, storage })
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

export function updateStorageStatus(id, name) {
  return (dispatch) => {
    fetch(`/api/v1/storagestatus/${id}`, {
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

export function getItemsByPage(page) {
  return (dispatch) => {
    // dispatch({ type: GET_STORAGES, isLoaded: false })
    fetch(`/api/v1/storagebypage/${page}`)
      .then((r) => r.json())
      .then(({ data: storages, currentPage, numberOfPages }) => {
        dispatch({ type: GET_STORAGES, storages, currentPage, numberOfPages, isLoaded: true })
      })
  }
}

export function getItemsFiltered(page, status, place, phone, number) {
  return (dispatch) => {
    // dispatch({ type: GET_STORAGES, isLoaded: false })
    fetch(
      `/api/v1/storagefilter${page ? `?page=${page}` : ''}${status ? `&status=${status}` : ''}${
        place ? `&place=${place}` : ''
      }${phone ? `&phone=${phone}` : ''}${number ? `&number=${number}` : ''}`
    )
      .then((r) => r.json())
      .then(({ data: storages, currentPage, numberOfPages }) => {
        dispatch({ type: GET_STORAGES, storages, currentPage, numberOfPages, isLoaded: true })
      })
  }
}
