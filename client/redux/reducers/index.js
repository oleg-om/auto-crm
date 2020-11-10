import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import auth from './auth'
import messages from './messages'

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    auth,
    messages
  })

export default createRootReducer
