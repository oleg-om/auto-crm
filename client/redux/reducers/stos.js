import {
  GET_STOS,
  GET_STO,
  GET_STOS_LAST_TWO_DAYS,
  CREATE_STO,
  UPDATE_STO_STATUS,
  UPDATE_STO
} from '../actions/stos'

const initialState = {
  list: [],
  item: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_STOS: {
      return {
        ...state,
        list: action.stos,
        isLoaded: action.isLoaded,
        currentPage: action.currentPage,
        numberOfPages: action.numberOfPages
      }
    }
    case GET_STO: {
      return { ...state, item: [action.stos], isLoaded: action.isLoaded }
    }
    case GET_STOS_LAST_TWO_DAYS: {
      return { ...state, list: action.stos, isLoaded: action.isLoaded }
    }
    case CREATE_STO: {
      return { ...state, list: [action.sto, ...state.list].filter((it) => it) }
    }
    case UPDATE_STO: {
      return {
        ...state,
        list: state?.list?.map((it) => {
          return action.sto.id_stos === it.id_stos ? action.sto : it
        })
      }
    }
    case UPDATE_STO_STATUS: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.sto.id === it.id ? action.sto : it
        })
      }
    }

    default:
      return state
  }
}

export function getStos() {
  return (dispatch) => {
    dispatch({ type: GET_STOS, isLoaded: false })
    fetch('/api/v1/sto')
      .then((r) => r.json())
      .then(({ data: stos }) => {
        dispatch({ type: GET_STOS, stos, isLoaded: true })
      })
  }
}

export function getStosLastTwoDays() {
  return (dispatch) => {
    dispatch({ type: GET_STOS, isLoaded: false })
    fetch('/api/v1/stolast')
      .then((r) => r.json())
      .then(({ data: stos }) => {
        dispatch({ type: GET_STOS_LAST_TWO_DAYS, stos, isLoaded: true })
      })
  }
}

export function getSto(id) {
  return (dispatch) => {
    fetch(`/api/v1/sto/${id}`)
      .then((r) => r.json())
      .then(({ data: stos }) => {
        dispatch({ type: GET_STO, stos })
      })
  }
}

export function getItemsByPage(page) {
  return (dispatch) => {
    dispatch({ type: GET_STOS, isLoaded: false })
    fetch(`/api/v1/stobypage/${page}`)
      .then((r) => r.json())
      .then(({ data: stos, currentPage, numberOfPages }) => {
        dispatch({
          type: GET_STOS,
          stos,
          currentPage,
          numberOfPages,
          isLoaded: true
        })
      })
  }
}

export function getItemsFiltered(page, place, number, reg) {
  return (dispatch) => {
    dispatch({ type: GET_STOS, isLoaded: false })
    fetch(
      `/api/v1/stofilter${page ? `?page=${page}` : ''}${place ? `&place=${place}` : ''}${
        number ? `&number=${number}` : ''
      }${reg ? `&reg=${reg}` : ''}`
    )
      .then((r) => r.json())
      .then(({ data: stos, currentPage, numberOfPages }) => {
        dispatch({
          type: GET_STOS,
          stos,
          currentPage,
          numberOfPages,
          isLoaded: true
        })
      })
  }
}

export function createSto(name) {
  return (dispatch) => {
    fetch('/api/v1/sto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: sto }) => {
        dispatch({ type: CREATE_STO, sto })
      })
  }
}

export function updateStatus(id, status) {
  return (dispatch) => {
    fetch(`/api/v1/sto/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status
      })
    })
      .then((r) => r.json())
      .then(({ data: sto }) => {
        dispatch({ type: UPDATE_STO_STATUS, sto })
      })
  }
}

export function updateSto(id, name) {
  return (dispatch) => {
    fetch(`/api/v1/sto/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: sto }) => {
        dispatch({ type: UPDATE_STO, sto })
      })
  }
}
