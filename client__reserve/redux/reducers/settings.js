import { GET_SETTINGS, CREATE_SETTING, UPDATE_SETTING, DELETE_SETTING } from '../actions/settings'

const initialState = {
  list: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SETTINGS: {
      return { ...state, list: action.settings }
    }
    case CREATE_SETTING: {
      return { ...state, list: [...state.list, action.setting] }
    }
    case UPDATE_SETTING: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.setting.id === it.id ? action.setting : it
        })
      }
    }
    case DELETE_SETTING: {
      return {
        list: state.list.filter((it) => {
          return action.id !== it.id
        })
      }
    }
    default:
      return state
  }
}

export function getSettings() {
  return (dispatch) => {
    fetch('/api/v1/setting')
      .then((r) => r.json())
      .then(({ data: settings }) => {
        dispatch({ type: GET_SETTINGS, settings })
      })
  }
}

export function createSetting(name) {
  return (dispatch) => {
    fetch('/api/v1/setting', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: setting }) => {
        dispatch({ type: CREATE_SETTING, setting })
      })
  }
}

export function updateSetting(id, name) {
  return (dispatch) => {
    fetch(`/api/v1/setting/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: setting }) => {
        dispatch({ type: UPDATE_SETTING, setting })
      })
  }
}

export function deleteSetting(id) {
  return (dispatch) => {
    fetch(`/api/v1/setting/${id}`, {
      method: 'DELETE'
    })
      .then((r) => r.json())
      .then(() => {
        dispatch({ type: DELETE_SETTING, id })
      })
  }
}
