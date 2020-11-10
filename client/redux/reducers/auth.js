import axios from 'axios'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

const initialState = {
  login: '',
  password: '',
  userName: '',
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

export function updateUserName(userName) {
  return {
    type: 'UPDATE_USERNAME',
    userName
  }
}

function sendLoginPassword(path) {
  return (dispatch, getState) => {
    const { login, password, userName } = getState().auth
    axios({
      method: 'post',
      url: path,
      headers: {},
      data: {
        login,
        password,
        userName
      }
    })
      .then((r) => r.data)
      .then((data) => {
        dispatch({ type: 'LOGIN', token: data.token, user: data.user })
      })
  }
}

export function signIn() {
  return (dispatch) => {
    dispatch(sendLoginPassword('/api/v1/auth'))
  }
}

export function registration() {
  return (dispatch) => {
    dispatch(sendLoginPassword('/api/v1/registration'))
  }
}

export function trySignIn() {
  return (dispatch) => {
    axios('/api/v1/auth').then(({ data }) =>
      dispatch({ type: 'LOGIN', token: data.token, user: data.user })
    )
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
    case 'UPDATE_USERNAME': {
      return { ...state, userName: action.userName }
    }
    default:
      return state
  }
}
