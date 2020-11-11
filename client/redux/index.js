import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import io from 'socket.io-client'

import Cookies from 'universal-cookie'
import rootReducer from './reducers'
import createHistory from './history'
import { receivedNewMessage, deleteRecivedMessages } from './reducers/messages'
import { updateSocketsInfo } from './reducers/adminInformation'
import { deleteUser } from './reducers/auth'

export const history = createHistory()

const initialState = {}
const enhancers = []
const middleware = [thunk, routerMiddleware(history)]

const composeFunc = process.env.NODE_ENV === 'development' ? composeWithDevTools : compose

const composedEnhancers = composeFunc(applyMiddleware(...middleware), ...enhancers)

const store = createStore(rootReducer(history), initialState, composedEnhancers)

export const socket = io('http://localhost:8090', { transports: ['websocket'], autoConnect: false })

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

export default store
