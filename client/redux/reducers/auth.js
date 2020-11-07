import axios from 'axios'

export function updateLogin(login) {
  return {
    type: 'UPDATE_LOGIN',
    login
  }
}

export function updatePassword(password) {
  return {
    type: 'UPDATE_PASSWORD',
    password
  }
}

function sendLoginPassword(path, login, password) {
  axios.post(path, { login, password })
}

export function signIn() {
  return (dispatch, getState) => {
    const { login, password } = getState().auth
    sendLoginPassword('/api/v1/auth', login, password)
      .then((r) => r.json())
      .then((data) => {
        dispatch({ type: 'LOGIN', token: data.token })
      })
  }
}

export function registration() {
  return (dispatch, getState) => {
    const { login, password } = getState().auth
    sendLoginPassword('/api/v1/registration', login, password)
    //   .then((r) => r.json())
    //   .then((data) => {
    //     dispatch({ type: 'REGISTRATION', token: data.token })
    // })
  }
}

const initialState = {
  login: '',
  password: ''
}

export default function auth(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_LOGIN': {
      return { ...state, login: action.login }
    }
    case 'UPDATE_PASSWORD': {
      return { ...state, password: action.password }
    }
    default:
      return state
  }
}
