import axios from 'axios'
import Cookies from 'universal-cookie'
import { history } from '..'

const cookies = new Cookies()

const initialState = {
  login: '',
  password: '',
  userName: '',
  // The token cookie is httpOnly (can't be read from JS) - whether a session
  // exists is only known once trySignIn()'s response comes back, tracked by
  // authChecked below. Route guards must wait for that before redirecting.
  token: '',
  authChecked: false,
  user: {},
  roles: [],
  place: '',
  name: '',
  id: '',
  requestPasswordForReport: false,
  impersonatedBy: null
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
        dispatch({ type: 'LOGIN_STATUS', status: data.status, message: data.message })
        history.push('/')
      })
  }
}

export function signIn() {
  return (dispatch) => {
    dispatch(sendLoginPassword('/api/v1/auth'))
    history.push('/')
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
      dispatch({
        type: 'LOGIN',
        token: data.token,
        user: data.user,
        impersonatedBy: data.impersonatedBy
      })
    )
  }
}

export function signOut() {
  return (dispatch) => {
    // The token cookie is httpOnly - only the server can clear it.
    axios.post('/api/v1/logout').finally(() => {
      dispatch({ type: 'KICK_USER' })
      history.push('/login')
    })
  }
}

export function impersonate(accountId) {
  return () => {
    axios.post(`/api/v1/account/${accountId}/impersonate`).then(({ data }) => {
      if (data.status === 'ok') {
        window.location.href = '/'
      }
    })
  }
}

export function returnToSelf() {
  return () => {
    axios.post('/api/v1/account/return-to-self').then(({ data }) => {
      if (data.status === 'ok') {
        window.location.href = '/'
      }
    })
  }
}

export function changePassword(currentPassword, newPassword) {
  return () =>
    axios
      .patch('/api/v1/account/self/password', { currentPassword, newPassword })
      .then(({ data }) => data)
      .catch((err) => err.response?.data ?? { status: 'error', message: 'Ошибка сети' })
}

export function deleteUser() {
  return {
    type: 'DELETE_USER'
  }
}

export default function auth(state = initialState, action) {
  if (action.type === 'KICK_USER') {
    cookies.remove('token', { path: '/' })
  }
  switch (action.type) {
    case 'UPDATE_LOGIN': {
      return { ...state, login: action.login }
    }
    case 'UPDATE_PASSWORD': {
      return { ...state, password: action.password }
    }
    case 'LOGIN_STATUS': {
      return { ...state, status: action.status, message: action.message }
    }
    case 'LOGIN': {
      return {
        ...state,
        token: action.token,
        authChecked: true,
        password: '',
        user: action.user,
        roles: action.user ? action.user.role : [],
        place: action.user ? action.user.place : '',
        name: action.user ? action.user.userName : '',
        requestPasswordForReport: action.user?.requestPasswordForReport || false,
        impersonatedBy: action.impersonatedBy || null
      }
    }
    case 'UPDATE_USERNAME': {
      return { ...state, userName: action.userName }
    }
    case 'DELETE_USER': {
      return { ...state, user: {}, token: '' }
    }
    default:
      return state
  }
}
