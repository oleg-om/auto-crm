import {
  GET_WASHS,
  GET_WASH,
  GET_WASHS_LAST_TWO_DAYS,
  CREATE_WASH,
  UPDATE_WASH_STATUS,
  UPDATE_WASH
} from '../actions/washs'

const initialState = {
  list: [],
  item: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_WASHS: {
      return {
        ...state,
        list: action.washs,
        isLoaded: action.isLoaded,
        currentPage: action.currentPage,
        numberOfPages: action.numberOfPages
      }
    }
    case GET_WASH: {
      return { ...state, item: [action.washs], isLoaded: action.isLoaded }
    }
    case GET_WASHS_LAST_TWO_DAYS: {
      return { ...state, list: action.washs, isLoaded: action.isLoaded }
    }
    case CREATE_WASH: {
      return { ...state, list: [action.wash, ...state.list] }
    }
    case UPDATE_WASH: {
      return {
        ...state,
        list: state?.list?.map((it) => {
          return action.wash.id_washs === it.id_washs ? action.wash : it
        })
      }
    }
    case UPDATE_WASH_STATUS: {
      return {
        ...state,
        list: state?.list?.map((it) => {
          return action.wash.id === it.id ? action.wash : it
        })
      }
    }

    default:
      return state
  }
}

export function getWashs() {
  return (dispatch) => {
    dispatch({ type: GET_WASHS, isLoaded: false })
    fetch('/api/v1/wash')
      .then((r) => r.json())
      .then(({ data: washs }) => {
        dispatch({ type: GET_WASHS, washs, isLoaded: true })
      })
  }
}

export function getWashsLastTwoDays() {
  return (dispatch) => {
    dispatch({ type: GET_WASHS, isLoaded: false })
    fetch('/api/v1/washlast')
      .then((r) => r.json())
      .then(({ data: washs }) => {
        dispatch({ type: GET_WASHS_LAST_TWO_DAYS, washs, isLoaded: true })
      })
  }
}

export function getWash(id) {
  return (dispatch) => {
    fetch(`/api/v1/wash/${id}`)
      .then((r) => r.json())
      .then(({ data: washs }) => {
        dispatch({ type: GET_WASH, washs })
      })
  }
}

export function getItemsByPage(page) {
  return (dispatch) => {
    // dispatch({ type: GET_WASHS, isLoaded: false })
    fetch(`/api/v1/washbypage/${page}`)
      .then((r) => r.json())
      .then(({ data: washs, currentPage, numberOfPages }) => {
        dispatch({
          type: GET_WASHS,
          washs,
          currentPage,
          numberOfPages,
          isLoaded: true
        })
      })
  }
}

export function getItemsFiltered(page, place, number, reg) {
  return (dispatch) => {
    // dispatch({ type: GET_WASHS, isLoaded: false })
    fetch(
      `/api/v1/washfilter${page ? `?page=${page}` : ''}${place ? `&place=${place}` : ''}${
        number ? `&number=${number}` : ''
      }${reg ? `&reg=${reg}` : ''}`
    )
      .then((r) => r.json())
      .then(({ data: washs, currentPage, numberOfPages }) => {
        dispatch({
          type: GET_WASHS,
          washs,
          currentPage,
          numberOfPages,
          isLoaded: true
        })
      })
  }
}

export function createWash(name) {
  return (dispatch) => {
    fetch('/api/v1/wash', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: wash }) => {
        dispatch({ type: CREATE_WASH, wash })
      })
  }
}

export function updateStatus(id, status) {
  return (dispatch) => {
    fetch(`/api/v1/wash/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status
      })
    })
      .then((r) => r.json())
      .then(({ data: wash }) => {
        dispatch({ type: UPDATE_WASH_STATUS, wash })
      })
  }
}

export function updateWash(id, name) {
  return (dispatch) => {
    fetch(`/api/v1/wash/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: wash }) => {
        dispatch({ type: UPDATE_WASH, wash })
      })
  }
}
