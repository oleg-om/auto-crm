import {
  GET_PLACES,
  GET_PLACES_ALL,
  CREATE_PLACE,
  UPDATE_PLACE,
  DELETE_PLACE
} from '../actions/places'

const initialState = {
  list: [],
  // Full roster including inactive places - populated only for the Places
  // admin page (see getAllPlaces below); `list` stays active-only since
  // ~50 other pages across the app read it directly for place pickers and
  // must never see inactive places.
  allList: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PLACES: {
      return { ...state, list: action.places }
    }
    case GET_PLACES_ALL: {
      return { ...state, allList: action.places }
    }
    case CREATE_PLACE: {
      return {
        ...state,
        list: action.place.active === false ? state.list : [...state.list, action.place],
        allList: [...state.allList, action.place]
      }
    }
    case UPDATE_PLACE: {
      const isActive = action.place.active !== false
      const existsInList = state.list.some((it) => it.id === action.place.id)
      let nextList = state.list
      if (isActive) {
        nextList = existsInList
          ? state.list.map((it) => (it.id === action.place.id ? action.place : it))
          : [...state.list, action.place]
      } else if (existsInList) {
        nextList = state.list.filter((it) => it.id !== action.place.id)
      }
      return {
        ...state,
        list: nextList,
        allList: state.allList.map((it) => (it.id === action.place.id ? action.place : it))
      }
    }
    case DELETE_PLACE: {
      return {
        ...state,
        list: state.list.filter((it) => {
          return action.id !== it.id
        }),
        allList: state.allList.filter((it) => {
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

// Used only by the Places admin page, which needs to see inactive places
// too (to be able to review and reactivate them).
export function getAllPlaces() {
  return (dispatch) => {
    fetch('/api/v1/place?includeInactive=true')
      .then((r) => r.json())
      .then(({ data: places }) => {
        dispatch({ type: GET_PLACES_ALL, places })
      })
  }
}

export function createPlace(data) {
  return (dispatch) => {
    fetch('/api/v1/place', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((r) => r.json())
      .then(({ data: place }) => {
        dispatch({ type: CREATE_PLACE, place })
      })
  }
}

export function updatePlace(id, data) {
  return (dispatch) => {
    fetch(`/api/v1/place/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
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
