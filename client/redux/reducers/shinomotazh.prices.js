import {
  GET_SHINOMONTAZHPRICES,
  CREATE_SHINOMONTAZHPRICE,
  UPDATE_SHINOMONTAZHPRICE,
  DELETE_SHINOMONTAZHPRICE
} from '../actions/shinomotazh.prices'

const initialState = {
  list: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SHINOMONTAZHPRICES: {
      return { ...state, list: action.shinomontazhprices }
    }
    case CREATE_SHINOMONTAZHPRICE: {
      return { ...state, list: [...state.list, action.shinomontazhprice] }
    }
    case UPDATE_SHINOMONTAZHPRICE: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.shinomontazhprice.id === it.id ? action.shinomontazhprice : it
        })
      }
    }
    case DELETE_SHINOMONTAZHPRICE: {
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

export function getShinomontazhprices() {
  return (dispatch) => {
    fetch('/api/v1/shinomontazhprice')
      .then((r) => r.json())
      .then(({ data: shinomontazhprices }) => {
        dispatch({ type: GET_SHINOMONTAZHPRICES, shinomontazhprices })
      })
  }
}

export function createShinomontazhprice(name) {
  return (dispatch) => {
    fetch('/api/v1/shinomontazhprice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: shinomontazhprice }) => {
        dispatch({ type: CREATE_SHINOMONTAZHPRICE, shinomontazhprice })
      })
  }
}

export function importShinomontazhprice(name) {
  return (dispatch) => {
    fetch('/api/v1/shinomontazhpriceimport', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: shinomontazhprice }) => {
        dispatch({ type: CREATE_SHINOMONTAZHPRICE, shinomontazhprice })
      })
  }
}

export function updateShinomontazhprice(id, name) {
  return (dispatch) => {
    fetch(`/api/v1/shinomontazhprice/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: shinomontazhprice }) => {
        dispatch({ type: UPDATE_SHINOMONTAZHPRICE, shinomontazhprice })
      })
  }
}

export function deleteShinomontazhprice(id) {
  return (dispatch) => {
    fetch(`/api/v1/shinomontazhprice/${id}`, {
      method: 'DELETE'
    })
      .then((r) => r.json())
      .then(() => {
        dispatch({ type: DELETE_SHINOMONTAZHPRICE, id })
      })
  }
}

export function deleteShinomontazhpriceDb() {
  return (dispatch) => {
    fetch(`/api/v1/shinomontazhpricedrop/`, {
      method: 'DELETE'
    })
      .then((r) => r.json())
      .then(() => {
        dispatch({ type: DELETE_SHINOMONTAZHPRICE })
      })
  }
}
