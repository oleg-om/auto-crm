import { GET_PLACES, CREATE_PLACE, UPDATE_PLACE, DELETE_PLACE } from '../actions/places'

const initialState = {
  list: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PLACES: {
      return { ...state, list: action.places }
    }
    case CREATE_PLACE: {
      return { ...state, list: [...state.list, action.place] }
    }
    case UPDATE_PLACE: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.place.id === it.id ? action.place : it
        })
      }
    }
    case DELETE_PLACE: {
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

export function getPlaces() {
  return (dispatch) => {
    fetch('/api/v1/place')
      .then((r) => r.json())
      .then(({ data: places }) => {
        dispatch({ type: GET_PLACES, places })
      })
  }
}

export function createPlace(name) {
  return (dispatch) => {
    fetch('/api/v1/place', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    })
      .then((r) => r.json())
      .then(({ data: place }) => {
        dispatch({ type: CREATE_PLACE, place })
      })
  }
}

export function updatePlace(id, name) {
  return (dispatch) => {
    fetch(`/api/v1/place/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name
      })
    })
      .then((r) => r.json())
      .then(({ data: place }) => {
        dispatch({ type: UPDATE_PLACE, place })
      })
  }
}

export function deletePlace(id) {
  return (dispatch) => {
    fetch(`/api/v1/place/${id}`, {
      method: 'DELETE'
    })
      .then((r) => r.json())
      .then(() => {
        dispatch({ type: DELETE_PLACE, id })
      })
  }
}
