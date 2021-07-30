import io from 'socket.io-client'
import Cookies from 'universal-cookie'

import { receivedNewMessage, deleteRecivedMessages } from '../reducers/messages'
import { updateSocketsInfo } from '../reducers/adminInformation'
import { deleteUser } from '../reducers/auth'
import store from '../index'

// export const socket = io('http://localhost:8090', { transports: ['websocket'], autoConnect: false })
export const socket = io('http://195.2.76.23:8090', {
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
