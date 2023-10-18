import {
  GET_STOS,
  GET_STO,
  GET_STOS_LAST_TWO_DAYS,
  CREATE_STO,
  UPDATE_STO_STATUS,
  UPDATE_STO,
  UPDATE_STO_PREENTRY,
  GET_STOS_PREENTRY,
  DELETE_STO_PREENTRY,
  CREATE_STO_PREENTRY
} from '../actions/stos'

const initialState = {
  list: [],
  item: [],
  isLoaded: false,
  preentryList: [],
  prentryItem: [],
  preentryIsLoaded: false,
  preentryDate: null
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
    // preentry
    case CREATE_STO_PREENTRY: {
      return {
        ...state,
        preentryList: [action.sto, ...state.preentryList].filter((it) => it)
      }
    }
    case UPDATE_STO_PREENTRY: {
      return {
        ...state,
        preentryList: state?.preentryList?.map((it) => {
          return action.sto.id_stos === it.id_stos ? action.sto : it
        })
      }
    }
    case GET_STOS_PREENTRY: {
      return {
        ...state,
        preentryList: action.stopreentry,
        preentryIsLoaded: action.isLoaded,
        preentryDate: action.preentryDate
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
    // dispatch({ type: GET_STOS, isLoaded: false })
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

export function getItemsFiltered(queryParams) {
  return (dispatch) => {
    // dispatch({ type: GET_STOS, isLoaded: false })
    fetch(`/api/v1/stofilter${queryParams}`)
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

export function updateStoPreentry(id, name) {
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
        dispatch({ type: UPDATE_STO_PREENTRY, sto })
      })
  }
}

export function setPreentryStoLoading() {
  return (dispatch) => {
    dispatch({
      type: GET_STOS_PREENTRY,
      preentryIsLoaded: false,
      preentryList: []
    })
  }
}

export function deleteStoPreentry(id) {
  return (dispatch) => {
    fetch(`/api/v1/sto/${id}`, {
      method: 'DELETE'
    })
      .then((r) => r.json())
      .then(() => {
        dispatch({ type: DELETE_STO_PREENTRY, id })
      })
  }
}

export function createStoPreentry(name) {
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
        dispatch({ type: CREATE_STO_PREENTRY, sto })
      })
  }
}

export function getStoByMonth(year, month, day, isOil) {
  return (dispatch) => {
    fetch(`/api/v1/stopreentry?isOil=${isOil}&year=${year}&month=${month}&day=${day} `)
      .then((r) => r.json())
      .then(({ data: stopreentry }) => {
        dispatch({
          type: GET_STOS_PREENTRY,
          stopreentry,
          isLoaded: true,
          preentryDate: `${year}-${month}-${day}`
        })
      })
  }
}
