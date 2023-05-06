import {
  GET_CONDS,
  GET_COND,
  GET_CONDS_LAST_TWO_DAYS,
  CREATE_COND,
  UPDATE_COND_STATUS,
  UPDATE_COND
} from '../actions/conds'

const initialState = {
  list: [],
  item: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CONDS: {
      return {
        ...state,
        list: action.conds,
        isLoaded: action.isLoaded,
        currentPage: action.currentPage,
        numberOfPages: action.numberOfPages
      }
    }
    case GET_COND: {
      return { ...state, item: [action.conds], isLoaded: action.isLoaded }
    }
    case GET_CONDS_LAST_TWO_DAYS: {
      return { ...state, list: action.conds, isLoaded: action.isLoaded }
    }
    case CREATE_COND: {
      return { ...state, list: [action.cond, ...state.list] }
    }
    case UPDATE_COND: {
      return {
        ...state,
        list: state?.list?.map((it) => {
          return action.cond.id_conds === it.id_conds ? action.cond : it
        })
      }
    }
    case UPDATE_COND_STATUS: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.cond.id === it.id ? action.cond : it
        })
      }
    }

    default:
      return state
  }
}

export function getWashs() {
  return (dispatch) => {
    dispatch({ type: GET_CONDS, isLoaded: false })
    fetch('/api/v1/cond')
      .then((r) => r.json())
      .then(({ data: conds }) => {
        dispatch({ type: GET_CONDS, conds, isLoaded: true })
      })
  }
}

export function getWashsLastTwoDays() {
  return (dispatch) => {
    dispatch({ type: GET_CONDS, isLoaded: false })
    fetch('/api/v1/condlast')
      .then((r) => r.json())
      .then(({ data: conds }) => {
        dispatch({ type: GET_CONDS_LAST_TWO_DAYS, conds, isLoaded: true })
      })
  }
}

export function getWash(id) {
  return (dispatch) => {
    fetch(`/api/v1/cond/${id}`)
      .then((r) => r.json())
      .then(({ data: conds }) => {
        dispatch({ type: GET_COND, conds })
      })
  }
}

export function getCondItemsByPage(page) {
  return (dispatch) => {
    dispatch({ type: GET_CONDS, isLoaded: false })
    fetch(`/api/v1/condbypage/${page}`)
      .then((r) => r.json())
      .then(({ data: conds, currentPage, numberOfPages }) => {
        dispatch({
          type: GET_CONDS,
          conds,
          currentPage,
          numberOfPages,
          isLoaded: true
        })
      })
  }
}

export function getCondItemsFiltered(page, place, number, reg) {
  return (dispatch) => {
    dispatch({ type: GET_CONDS, isLoaded: false })
    fetch(
      `/api/v1/condfilter${page ? `?page=${page}` : ''}${place ? `&place=${place}` : ''}${
        number ? `&number=${number}` : ''
      }${reg ? `&reg=${reg}` : ''}`
    )
      .then((r) => r.json())
      .then(({ data: conds, currentPage, numberOfPages }) => {
        dispatch({
          type: GET_CONDS,
          conds,
          currentPage,
          numberOfPages,
          isLoaded: true
        })
      })
  }
}

export function createCond(name) {
  return (dispatch) => {
    fetch('/api/v1/cond', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: cond }) => {
        dispatch({ type: CREATE_COND, cond })
      })
  }
}

export function updateStatus(id, status) {
  return (dispatch) => {
    fetch(`/api/v1/cond/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status
      })
    })
      .then((r) => r.json())
      .then(({ data: cond }) => {
        dispatch({ type: UPDATE_COND_STATUS, cond })
      })
  }
}

export function updateCond(id, name) {
  return (dispatch) => {
    fetch(`/api/v1/cond/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: cond }) => {
        dispatch({ type: UPDATE_COND, cond })
      })
  }
}
