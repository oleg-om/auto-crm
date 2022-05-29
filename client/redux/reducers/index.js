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
import razvals from './razvals'
import oils from './oils'
import settings from './settings'
import materials from './materials'
import shinomontazhprices from './shinomotazh.prices'
import shinomontazhs from './shinomontazhs'
import vendors from './vendors'
import tyres from './tyres'
import storage from './storage'
import tools from './tools'
import stoprices from './sto.prices'
import stos from './stos'
import categorys from './categorys'
import washs from './washs'
import washprices from './wash.prices'

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
    accounts,
    razvals,
    oils,
    settings,
    materials,
    shinomontazhprices,
    shinomontazhs,
    vendors,
    tyres,
    storage,
    tools,
    stoprices,
    stos,
    categorys,
    washs,
    washprices
  })

export default createRootReducer
