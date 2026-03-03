import { createStore, applyMiddleware, compose } from 'redux'
import { createReduxHistoryContext } from 'redux-first-history'
import { createBrowserHistory } from 'history'
import { thunk } from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import rootReducer from './reducers'
import Init from './sockets/socketReceivers'

const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
  history: createBrowserHistory(),
  reduxTravelling: true
})

const initialState = {}
const enhancers = []
const middleware = [thunk, routerMiddleware]

const composeFunc = process.env.NODE_ENV === 'development' ? composeWithDevTools : compose

const composedEnhancers = composeFunc(applyMiddleware(...middleware), ...enhancers)

const store = createStore(rootReducer(routerReducer), initialState, composedEnhancers)

export const history = createReduxHistory(store)

Init()

export default store
