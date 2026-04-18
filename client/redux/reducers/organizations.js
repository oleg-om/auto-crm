import {
  GET_ORGANIZATIONS,
  CREATE_ORGANIZATION,
  UPDATE_ORGANIZATION,
  DELETE_ORGANIZATION
} from '../actions/organizations'

const initialState = {
  list: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ORGANIZATIONS: {
      return { ...state, list: action.organizations }
    }
    case CREATE_ORGANIZATION: {
      return { ...state, list: [...state.list, action.organization] }
    }
    case UPDATE_ORGANIZATION: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.organization.id === it.id ? action.organization : it
        })
      }
    }
    case DELETE_ORGANIZATION: {
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

export function getOrganizations() {
  return (dispatch) => {
    fetch('/api/v1/organization')
      .then((r) => r.json())
      .then(({ data: organizations }) => {
        dispatch({ type: GET_ORGANIZATIONS, organizations, isLoaded: true })
      })
  }
}

export function createOrganization(data) {
  return (dispatch) => {
    fetch('/api/v1/organization', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((r) => r.json())
      .then(({ data: organization }) => {
        dispatch({ type: CREATE_ORGANIZATION, organization })
      })
  }
}

export function updateOrganization(id, data) {
  return (dispatch) => {
    fetch(`/api/v1/organization/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((r) => r.json())
      .then(({ data: organization }) => {
        dispatch({ type: UPDATE_ORGANIZATION, organization })
      })
  }
}

export function deleteOrganization(id) {
  return (dispatch) => {
    fetch(`/api/v1/organization/${id}`, {
      method: 'DELETE'
    })
      .then((r) => r.json())
      .then(() => {
        dispatch({ type: DELETE_ORGANIZATION, id })
      })
  }
}
