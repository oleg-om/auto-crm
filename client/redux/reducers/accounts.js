import { GET_ACCOUNTS, CREATE_ACCOUNT, UPDATE_ACCOUNT, DELETE_ACCOUNT } from '../actions/accounts'

const initialState = {
  list: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNTS: {
      return { ...state, list: action.accounts }
    }
    case CREATE_ACCOUNT: {
      return { ...state, list: [...state.list, action.account] }
    }
    case UPDATE_ACCOUNT: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.account._id === it._id ? action.account : it
        })
      }
    }
    case DELETE_ACCOUNT: {
      return {
        list: state.list.filter((it) => {
          return action.id !== it._id
        })
      }
    }
    default:
      return state
  }
}

export function getAccounts() {
  return (dispatch) => {
    fetch('/api/v1/account')
      .then((r) => r.json())
      .then(({ data: accounts }) => {
        dispatch({ type: GET_ACCOUNTS, accounts })
      })
  }
}

export function createAccount(name) {
  return (dispatch) => {
    fetch('/api/v1/account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: account }) => {
        dispatch({ type: CREATE_ACCOUNT, account })
      })
  }
}

export function updateAccount(id, name) {
  return (dispatch) => {
    fetch(`/api/v1/account/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: account }) => {
        dispatch({ type: UPDATE_ACCOUNT, account })
      })
  }
}

export function deleteAccount(id) {
  return (dispatch) => {
    fetch(`/api/v1/account/${id}`, {
      method: 'DELETE'
    })
      .then((r) => r.json())
      .then(() => {
        dispatch({ type: DELETE_ACCOUNT, id })
      })
  }
}
