import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import auth from './auth'
import messages from './messages'
import socketInfoUsers from './adminInformation'

import tasks from './tasks'
import places from './places'
import employees from './employees'
import autoparts from './autoparts'
import customers from './customers'
import accounts from './accounts'

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    auth,
    messages,
    socketInfoUsers,
    tasks,
    places,
    employees,
    autoparts,
    customers,
    accounts
  })

export default createRootReducer
