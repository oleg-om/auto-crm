import {
  GET_DISKPAINTINGPRICES,
  CREATE_DISKPAINTINGPRICE,
  UPDATE_DISKPAINTINGPRICE,
  DELETE_DISKPAINTINGPRICE
} from '../actions/diskpainting.prices'

const initialState = {
  list: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_DISKPAINTINGPRICES: {
      return { ...state, list: action.diskpaintingprices }
    }
    case CREATE_DISKPAINTINGPRICE: {
      return { ...state, list: [...state.list, action.diskpaintingprice] }
    }
    case UPDATE_DISKPAINTINGPRICE: {
      return {
        ...state,
        list: state.list.map((it) =>
          action.diskpaintingprice.id === it.id ? action.diskpaintingprice : it
        )
      }
    }
    case DELETE_DISKPAINTINGPRICE: {
      return {
        list: state.list.filter((it) => action.id !== it.id)
      }
    }
    default:
      return state
  }
}

export function getDiskpaintingprices() {
  return (dispatch) => {
    fetch('/api/v1/diskpaintingprice')
      .then((r) => r.json())
      .then(({ data: diskpaintingprices }) => {
        dispatch({ type: GET_DISKPAINTINGPRICES, diskpaintingprices })
      })
  }
}

export function createDiskpaintingprice(name) {
  return (dispatch) => {
    fetch('/api/v1/diskpaintingprice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: diskpaintingprice }) => {
        dispatch({ type: CREATE_DISKPAINTINGPRICE, diskpaintingprice })
      })
  }
}

export function updateDiskpaintingprice(id, name) {
  return (dispatch) => {
    fetch(`/api/v1/diskpaintingprice/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: diskpaintingprice }) => {
        dispatch({ type: UPDATE_DISKPAINTINGPRICE, diskpaintingprice })
      })
  }
}

export function deleteDiskpaintingprice(id) {
  return (dispatch) => {
    fetch(`/api/v1/diskpaintingprice/${id}`, { method: 'DELETE' })
      .then((r) => r.json())
      .then(() => {
        dispatch({ type: DELETE_DISKPAINTINGPRICE, id })
      })
  }
}

export function deleteDiskpaintingpriceDb() {
  return (dispatch) => {
    fetch('/api/v1/diskpaintingpricedrop/', { method: 'DELETE' })
      .then((r) => r.json())
      .then(() => {
        dispatch({ type: DELETE_DISKPAINTINGPRICE })
      })
  }
}
