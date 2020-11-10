import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import io from 'socket.io-client'

import rootReducer from './reducers'
import createHistory from './history'
import { receivedNewMessage } from './reducers/messages'

export const history = createHistory()

const initialState = {}
const enhancers = []
const middleware = [thunk, routerMiddleware(history)]

const composeFunc = process.env.NODE_ENV === 'development' ? composeWithDevTools : compose

const composedEnhancers = composeFunc(applyMiddleware(...middleware), ...enhancers)

const store = createStore(rootReducer(history), initialState, composedEnhancers)

export const socket = io('http://localhost:8090', { transports: ['websocket'], autoConnect: false })

socket.on('new message', (msg) => store.dispatch(receivedNewMessage(msg)))

socket.on('disconnect', (reason) => {
  if (reason === 'io server disconnect') {
    socket.connect()
  }
})

socket.on('connect', () => {
  const { token } = store.getState().auth
  console.log(token)
  socket.emit('new login', token)
})

export default store
