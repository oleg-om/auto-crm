import {
  GET_MATERIALS,
  CREATE_MATERIAL,
  UPDATE_MATERIAL,
  DELETE_MATERIAL
} from '../actions/materials'

const initialState = {
  list: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_MATERIALS: {
      return { ...state, list: action.materials }
    }
    case CREATE_MATERIAL: {
      return { ...state, list: [...state.list, action.material] }
    }
    case UPDATE_MATERIAL: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.material.id === it.id ? action.material : it
        })
      }
    }
    case DELETE_MATERIAL: {
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

export function getMaterials() {
  return (dispatch) => {
    fetch('/api/v1/material')
      .then((r) => r.json())
      .then(({ data: materials }) => {
        dispatch({ type: GET_MATERIALS, materials })
      })
  }
}

export function createMaterial(name) {
  return (dispatch) => {
    fetch('/api/v1/material', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: material }) => {
        dispatch({ type: CREATE_MATERIAL, material })
      })
  }
}

export function updateMaterial(id, name) {
  return (dispatch) => {
    fetch(`/api/v1/material/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: material }) => {
        dispatch({ type: UPDATE_MATERIAL, material })
      })
  }
}

export function deleteMaterial(id) {
  return (dispatch) => {
    fetch(`/api/v1/material/${id}`, {
      method: 'DELETE'
    })
      .then((r) => r.json())
      .then(() => {
        dispatch({ type: DELETE_MATERIAL, id })
      })
  }
}
