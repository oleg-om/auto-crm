import {
  GET_POSITIONS,
  CREATE_POSITION,
  UPDATE_POSITION,
  DELETE_POSITION,
  ADD_DUTY,
  UPDATE_DUTY,
  DELETE_DUTY,
  REORDER_DUTIES
} from '../actions/positions'

const initialState = {
  list: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_POSITIONS: {
      return { ...state, list: action.positions }
    }
    case CREATE_POSITION: {
      return { ...state, list: [...state.list, action.position] }
    }
    case UPDATE_POSITION: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.position.id === it.id ? action.position : it
        })
      }
    }
    case DELETE_POSITION: {
      return {
        ...state,
        list: state.list.filter((it) => {
          return action.id !== it.id
        })
      }
    }
    case ADD_DUTY:
    case UPDATE_DUTY:
    case DELETE_DUTY:
    case REORDER_DUTIES: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.position.id === it.id ? action.position : it
        })
      }
    }
    default:
      return state
  }
}

export function getPositions() {
  return (dispatch) => {
    fetch('/api/v1/position')
      .then((r) => r.json())
      .then(({ data: positions }) => {
        dispatch({ type: GET_POSITIONS, positions })
      })
  }
}

export function createPosition(name) {
  return (dispatch) => {
    return fetch('/api/v1/position', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    })
      .then((r) => r.json())
      .then(({ data: position }) => {
        dispatch({ type: CREATE_POSITION, position })
        return { data: position }
      })
  }
}

export function updatePosition(id, data) {
  return (dispatch) => {
    return fetch(`/api/v1/position/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((r) => r.json())
      .then(({ data: position }) => {
        dispatch({ type: UPDATE_POSITION, position })
        return { data: position }
      })
  }
}

export function deletePosition(id) {
  return (dispatch) => {
    return fetch(`/api/v1/position/${id}`, {
      method: 'DELETE'
    })
      .then((r) => r.json())
      .then((result) => {
        if (result.status === 'ok') {
          dispatch({ type: DELETE_POSITION, id })
        }
        return result
      })
  }
}

export function addDuty(positionId, duty) {
  return (dispatch) => {
    return fetch(`/api/v1/position/${positionId}/duty`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(duty)
    })
      .then((r) => r.json())
      .then(({ data: position }) => {
        dispatch({ type: ADD_DUTY, position })
        return { data: position }
      })
  }
}

export function updateDuty(positionId, dutyId, duty) {
  return (dispatch) => {
    return fetch(`/api/v1/position/${positionId}/duty/${dutyId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(duty)
    })
      .then((r) => r.json())
      .then(({ data: position }) => {
        dispatch({ type: UPDATE_DUTY, position })
        return { data: position }
      })
  }
}

export function deleteDuty(positionId, dutyId) {
  return (dispatch) => {
    return fetch(`/api/v1/position/${positionId}/duty/${dutyId}`, {
      method: 'DELETE'
    })
      .then((r) => r.json())
      .then(({ data: position }) => {
        dispatch({ type: DELETE_DUTY, position })
        return { data: position }
      })
  }
}

export function reorderDuties(positionId, dutyIds) {
  return (dispatch) => {
    return fetch(`/api/v1/position/${positionId}/duties/reorder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dutyIds })
    })
      .then((r) => r.json())
      .then(({ data: position }) => {
        dispatch({ type: REORDER_DUTIES, position })
        return { data: position }
      })
  }
}

