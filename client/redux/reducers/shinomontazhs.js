import {
  GET_SHINOMONTAZHS,
  GET_SHINOMONTAZH,
  GET_SHINOMONTAZHS_LAST_TWO_DAYS,
  CREATE_SHINOMONTAZH,
  UPDATE_SHINOMONTAZH_STATUS,
  UPDATE_SHINOMONTAZH
} from '../actions/shinomontazhs'

const initialState = {
  list: [],
  item: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SHINOMONTAZHS: {
      return { ...state, list: action.shinomontazhs, isLoaded: action.isLoaded }
    }
    case GET_SHINOMONTAZH: {
      return { ...state, item: [action.shinomontazhs], isLoaded: action.isLoaded }
    }
    case GET_SHINOMONTAZHS_LAST_TWO_DAYS: {
      return { ...state, list: action.shinomontazhs, isLoaded: action.isLoaded }
    }
    case CREATE_SHINOMONTAZH: {
      return { ...state, list: [...state.list, action.shinomontazh] }
    }
    case UPDATE_SHINOMONTAZH: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.shinomontazh.id_shinomontazhs === it.id_shinomontazhs
            ? action.shinomontazh
            : it
        })
      }
    }
    case UPDATE_SHINOMONTAZH_STATUS: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.shinomontazh.id === it.id ? action.shinomontazh : it
        })
      }
    }

    default:
      return state
  }
}

export function getShinomontazhs() {
  return (dispatch) => {
    fetch('/api/v1/shinomontazh')
      .then((r) => r.json())
      .then(({ data: shinomontazhs }) => {
        dispatch({ type: GET_SHINOMONTAZHS, shinomontazhs, isLoaded: true })
      })
  }
}

export function getShinomontazhsLastTwoDays() {
  return (dispatch) => {
    fetch('/api/v1/shinomontazhlast')
      .then((r) => r.json())
      .then(({ data: shinomontazhs }) => {
        dispatch({ type: GET_SHINOMONTAZHS_LAST_TWO_DAYS, shinomontazhs, isLoaded: true })
      })
  }
}

export function getShinomontazh(id) {
  return (dispatch) => {
    fetch(`/api/v1/shinomontazh/${id}`)
      .then((r) => r.json())
      .then(({ data: shinomontazhs }) => {
        dispatch({ type: GET_SHINOMONTAZH, shinomontazhs })
      })
  }
}

export function createShinomontazh(name) {
  return (dispatch) => {
    fetch('/api/v1/shinomontazh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: shinomontazh }) => {
        dispatch({ type: CREATE_SHINOMONTAZH, shinomontazh })
      })
  }
}

export function updateStatus(id, status) {
  return (dispatch) => {
    fetch(`/api/v1/shinomontazh/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status
      })
    })
      .then((r) => r.json())
      .then(({ data: shinomontazh }) => {
        dispatch({ type: UPDATE_SHINOMONTAZH_STATUS, shinomontazh })
      })
  }
}

export function updateShinomontazh(id, name) {
  return (dispatch) => {
    fetch(`/api/v1/shinomontazh/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: shinomontazh }) => {
        dispatch({ type: UPDATE_SHINOMONTAZH, shinomontazh })
      })
  }
}
