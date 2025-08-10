import io from 'socket.io-client'
import Cookies from 'universal-cookie'

import { receivedNewMessage, deleteRecivedMessages } from '../reducers/messages'
import { updateSocketsInfo } from '../reducers/adminInformation'
import { deleteUser } from '../reducers/auth'
import store from '../index'

// Используем переменные окружения или относительные URL
const getWebSocketUrl = () => {
  if (process.env.NODE_ENV === 'main') {
    return process.env.REACT_APP_MAIN_WEBSOCKET_URL || 'http://89.110.97.155:8090'
  }
  
  if (process.env.MODE === 'study') {
    return process.env.REACT_APP_STUDY_WEBSOCKET_URL || 'http://89.110.97.155:8090'
  }
  
  // В продакшене используем относительный URL для работы через nginx
  return process.env.REACT_APP_PRODUCTION_WEBSOCKET_URL || 'http://89.110.97.155:8090'
}

export const socket = io(getWebSocketUrl(), {
  transports: ['websocket'],
  autoConnect: false
})

function Init() {
  socket.on('new message', (msg) => {
    store.dispatch(receivedNewMessage(msg))
  })

  socket.on('disconnect', (reason) => {
    if (reason === 'io server disconnect') {
      socket.connect()
    }
  })

  socket.on('connect', () => {
    const { token } = store.getState().auth
    const { currentRoom } = store.getState().messages
    store.dispatch(deleteRecivedMessages())
    socket.emit('new login', { token, currentRoom })
    socket.emit('load history', currentRoom)
  })

  socket.on('history messages', (messages) => {
    store.dispatch(receivedNewMessage(messages))
  })

  socket.on('all users', (socketUser) => {
    store.dispatch(updateSocketsInfo(socketUser))
  })

  socket.on('delete cookie', () => {
    const cookie = new Cookies()
    cookie.set('token', 0, { path: '/', expires: new Date(Date.now() - 2592000) })
    store.dispatch(deleteUser())
  })

  socket.on('new autopart', (msg) => {
    store.dispatch(receivedNewMessage(msg))
  })
}

export default Init
