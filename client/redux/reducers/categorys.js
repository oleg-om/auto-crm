import {
  GET_CATEGORYS,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY
} from '../actions/categorys'

const initialState = {
  list: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CATEGORYS: {
      return { ...state, list: action.categorys }
    }
    case CREATE_CATEGORY: {
      return { ...state, list: [...state.list, action.category] }
    }
    case UPDATE_CATEGORY: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.category.id === it.id ? action.category : it
        })
      }
    }
    case DELETE_CATEGORY: {
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

export function getCategorys() {
  return (dispatch) => {
    fetch('/api/v1/category')
      .then((r) => r.json())
      .then(({ data: categorys }) => {
        dispatch({ type: GET_CATEGORYS, categorys })
      })
  }
}

export function createCategory(name) {
  return (dispatch) => {
    fetch('/api/v1/category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: category }) => {
        dispatch({ type: CREATE_CATEGORY, category })
      })
  }
}

export function updateCategory(id, name) {
  return (dispatch) => {
    fetch(`/api/v1/category/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: category }) => {
        dispatch({ type: UPDATE_CATEGORY, category })
      })
  }
}

export function deleteCategory(id) {
  return (dispatch) => {
    fetch(`/api/v1/category/${id}`, {
      method: 'DELETE'
    })
      .then((r) => r.json())
      .then(() => {
        dispatch({ type: DELETE_CATEGORY, id })
      })
  }
}
