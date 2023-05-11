import {
  GET_WINDOWS,
  GET_WINDOW,
  GET_WINDOWS_LAST_TWO_DAYS,
  CREATE_WINDOW,
  UPDATE_WINDOW_STATUS,
  UPDATE_WINDOW
} from '../actions/windows'

const initialState = {
  list: [],
  item: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_WINDOWS: {
      return {
        ...state,
        list: action.windows,
        isLoaded: action.isLoaded,
        currentPage: action.currentPage,
        numberOfPages: action.numberOfPages
      }
    }
    case GET_WINDOW: {
      return { ...state, item: [action.windows], isLoaded: action.isLoaded }
    }
    case GET_WINDOWS_LAST_TWO_DAYS: {
      return { ...state, list: action.windows, isLoaded: action.isLoaded }
    }
    case CREATE_WINDOW: {
      return { ...state, list: [action.window, ...state.list] }
    }
    case UPDATE_WINDOW: {
      return {
        ...state,
        list: state?.list?.map((it) => {
          return action.window.id_windows === it.id_windows ? action.window : it
        })
      }
    }
    case UPDATE_WINDOW_STATUS: {
      return {
        ...state,
        list: state?.list?.map((it) => {
          return action.window.id === it.id ? action.window : it
        })
      }
    }

    default:
      return state
  }
}

export function getWashs() {
  return (dispatch) => {
    dispatch({ type: GET_WINDOWS, isLoaded: false })
    fetch('/api/v1/window')
      .then((r) => r.json())
      .then(({ data: windows }) => {
        dispatch({ type: GET_WINDOWS, windows, isLoaded: true })
      })
  }
}

export function getWashsLastTwoDays() {
  return (dispatch) => {
    dispatch({ type: GET_WINDOWS, isLoaded: false })
    fetch('/api/v1/windowlast')
      .then((r) => r.json())
      .then(({ data: windows }) => {
        dispatch({ type: GET_WINDOWS_LAST_TWO_DAYS, windows, isLoaded: true })
      })
  }
}

export function getWash(id) {
  return (dispatch) => {
    fetch(`/api/v1/window/${id}`)
      .then((r) => r.json())
      .then(({ data: windows }) => {
        dispatch({ type: GET_WINDOW, windows })
      })
  }
}

export function getItemsByPage(page) {
  return (dispatch) => {
    dispatch({ type: GET_WINDOWS, isLoaded: false })
    fetch(`/api/v1/windowbypage/${page}`)
      .then((r) => r.json())
      .then(({ data: windows, currentPage, numberOfPages }) => {
        dispatch({
          type: GET_WINDOWS,
          windows,
          currentPage,
          numberOfPages,
          isLoaded: true
        })
      })
  }
}

export function getItemsFiltered(page, place, number, reg) {
  return (dispatch) => {
    dispatch({ type: GET_WINDOWS, isLoaded: false })
    fetch(
      `/api/v1/windowfilter${page ? `?page=${page}` : ''}${place ? `&place=${place}` : ''}${
        number ? `&number=${number}` : ''
      }${reg ? `&reg=${reg}` : ''}`
    )
      .then((r) => r.json())
      .then(({ data: windows, currentPage, numberOfPages }) => {
        dispatch({
          type: GET_WINDOWS,
          windows,
          currentPage,
          numberOfPages,
          isLoaded: true
        })
      })
  }
}

export function createWindow(name) {
  return (dispatch) => {
    fetch('/api/v1/window', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: window }) => {
        dispatch({ type: CREATE_WINDOW, window })
      })
  }
}

export function updateStatus(id, status) {
  return (dispatch) => {
    fetch(`/api/v1/window/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status
      })
    })
      .then((r) => r.json())
      .then(({ data: window }) => {
        dispatch({ type: UPDATE_WINDOW_STATUS, window })
      })
  }
}

export function updateWindow(id, name) {
  return (dispatch) => {
    fetch(`/api/v1/window/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: window }) => {
        dispatch({ type: UPDATE_WINDOW, window })
      })
  }
}
