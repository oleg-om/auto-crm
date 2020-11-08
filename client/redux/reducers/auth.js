import axios from 'axios'
import Cookies from 'universal-cookie'
// import { history } from '..'

const cookies = new Cookies()

const initialState = {
  login: '',
  password: '',
  token: cookies.get('token'),
  user: {}
}

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
  return axios({
    method: 'post',
    url: path,
    headers: {},
    data: {
      login,
      password
    }
  })
}

export function signIn() {
  return (dispatch, getState) => {
    const { login, password } = getState().auth
    sendLoginPassword('/api/v1/auth', login, password)
      .then((r) => r.data)
      .then((data) => {
        dispatch({ type: 'LOGIN', token: data.token, user: data.user })
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

export default function auth(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_LOGIN': {
      return { ...state, login: action.login }
    }
    case 'UPDATE_PASSWORD': {
      return { ...state, password: action.password }
    }
    case 'LOGIN': {
      return { ...state, token: action.token, password: '', user: action.user }
    }
    default:
      return state
  }
}
