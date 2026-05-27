import {
  GET_DISKPAINTINGS,
  GET_DISKPAINTING,
  GET_DISKPAINTINGS_LAST_TWO_DAYS,
  CREATE_DISKPAINTING,
  UPDATE_DISKPAINTING_STATUS,
  UPDATE_DISKPAINTING,
  DELETE_DISKPAINTING
} from '../actions/diskpaintings'

const initialState = {
  list: [],
  item: [],
  isLoaded: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_DISKPAINTINGS: {
      return {
        ...state,
        list: action.diskpaintings,
        isLoaded: action.isLoaded,
        currentPage: action.currentPage,
        numberOfPages: action.numberOfPages
      }
    }
    case GET_DISKPAINTING: {
      return { ...state, item: [action.diskpaintings], isLoaded: action.isLoaded }
    }
    case GET_DISKPAINTINGS_LAST_TWO_DAYS: {
      return { ...state, list: action.diskpaintings, isLoaded: action.isLoaded }
    }
    case CREATE_DISKPAINTING: {
      return { ...state, list: [action.diskpainting, ...state.list].filter((it) => it) }
    }
    case UPDATE_DISKPAINTING: {
      return {
        ...state,
        list: state?.list?.map((it) =>
          action.diskpainting.id_diskpaintings === it.id_diskpaintings ? action.diskpainting : it
        )
      }
    }
    case UPDATE_DISKPAINTING_STATUS: {
      return {
        ...state,
        list: state?.list?.map((it) =>
          action.diskpainting.id === it.id ? action.diskpainting : it
        )
      }
    }
    default:
      return state
  }
}

export function getDiskpaintings() {
  return (dispatch) => {
    fetch('/api/v1/diskpainting')
      .then((r) => r.json())
      .then(({ data: diskpaintings }) => {
        dispatch({ type: GET_DISKPAINTINGS, diskpaintings, isLoaded: true })
      })
  }
}

export function getDiskpaintingsLastTwoDays() {
  return (dispatch) => {
    fetch('/api/v1/diskpaintinglast')
      .then((r) => r.json())
      .then(({ data: diskpaintings }) => {
        dispatch({ type: GET_DISKPAINTINGS_LAST_TWO_DAYS, diskpaintings, isLoaded: true })
      })
  }
}

export function getDiskpainting(id) {
  return (dispatch) => {
    fetch(`/api/v1/diskpainting/${id}`)
      .then((r) => r.json())
      .then(({ data: diskpaintings }) => {
        dispatch({ type: GET_DISKPAINTING, diskpaintings, isLoaded: true })
      })
  }
}

export function getItemsByPage(page) {
  return (dispatch) => {
    fetch(`/api/v1/diskpaintingbypage/${page}`)
      .then((r) => r.json())
      .then(({ data: diskpaintings, currentPage, numberOfPages }) => {
        dispatch({ type: GET_DISKPAINTINGS, diskpaintings, currentPage, numberOfPages, isLoaded: true })
      })
  }
}

export function enableDiskpaintingLoading() {
  return (dispatch) => {
    dispatch({ type: GET_DISKPAINTINGS, isLoaded: false })
  }
}

export function getItemsFiltered(queryParams) {
  return (dispatch) => {
    fetch(`/api/v1/diskpaintingfilter${queryParams}`)
      .then((r) => r.json())
      .then(({ data: diskpaintings, currentPage, numberOfPages }) => {
        dispatch({ type: GET_DISKPAINTINGS, diskpaintings, currentPage, numberOfPages, isLoaded: true })
      })
  }
}

export function createDiskpainting(name) {
  return (dispatch) => {
    fetch('/api/v1/diskpainting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: diskpainting }) => {
        dispatch({ type: CREATE_DISKPAINTING, diskpainting })
      })
  }
}

export function updateStatus(id, status) {
  return (dispatch) => {
    fetch(`/api/v1/diskpainting/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
      .then((r) => r.json())
      .then(({ data: diskpainting }) => {
        dispatch({ type: UPDATE_DISKPAINTING_STATUS, diskpainting })
      })
  }
}

export function updateDiskpainting(id, name) {
  return (dispatch) => {
    fetch(`/api/v1/diskpainting/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: diskpainting }) => {
        dispatch({ type: UPDATE_DISKPAINTING, diskpainting })
      })
  }
}

export function deleteDiskpainting(id) {
  return (dispatch) => {
    fetch(`/api/v1/diskpainting/${id}`, { method: 'DELETE' })
      .then((r) => r.json())
      .then(() => {
        dispatch({ type: DELETE_DISKPAINTING, id })
      })
  }
}
