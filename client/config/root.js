/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import PropTypes from 'prop-types'
import { Provider, useSelector } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { Switch, Route, Redirect, StaticRouter } from 'react-router-dom'

import store, { history } from '../redux'

import Registration from '../components/registration'
import LoginForm from '../components/loginForm'
import Room from '../components/room'
import AdminPannel from '../components/adminPannel'
import ChatView from '../components/chatView'
import NotFound from '../components/404'

import AutopartsList from '../scenes/Autoparts/Autoparts.list'
import AutopartsNew from '../scenes/Autoparts/Autoparts.preorder.create'
import AutopartEditSimple from '../scenes/Autoparts/Autopaparts.preorder.edit'
import AutopartEditFull from '../scenes/Autoparts/Autoparts.edit'
import AutopartView from '../scenes/Autoparts/Autoparts.preorder.view'
import PlaceList from '../scenes/Places/Places.list'
import PlaceNew from '../scenes/Places/Places.create'
import PlaceEdit from '../scenes/Places/Places.edit'
import EmployeeList from '../scenes/Employees/Employees.list'
import EmployeeNew from '../scenes/Employees/Employees.create'
import EmployeeEdit from '../scenes/Employees/Employees.edit'
import AccountList from '../scenes/Accounts/Accounts.list'
import AccountNew from '../scenes/Accounts/Accounts.create'
// import RegisterCommon from '../scenes/Accounts/Register.common'
import AccountEdit from '../scenes/Accounts/Accounts.edit'
import CustomerList from '../scenes/Customers/Customers.list'
import CustomerNew from '../scenes/Customers/Customers.create'
import CustomerEdit from '../scenes/Customers/Customers.edit'
import Access from '../scenes/Access'
import Dashboard from '../scenes/Dashboard'
import Boss from '../scenes/Boss/Boss'
import RazvalList from '../scenes/Razval/Razval.list'
import RazvalNew from '../scenes/Razval/Razval.create'
import RazvalEdit from '../scenes/Razval/Razval.edit'
import SettingEdit from '../scenes/Settings/Settings'
import MaterialList from '../scenes/Materials/Materials.list'
import MaterialNew from '../scenes/Materials/Materials.create'
import MaterialEdit from '../scenes/Materials/Materials.edit'
import ShinomontazhpriceList from '../scenes/Shinomotazh.prices/Shinomotazh.prices.list'
import ShinomontazhpriceNew from '../scenes/Shinomotazh.prices/Shinomotazh.prices.create'
import ShinomontazhpriceEdit from '../scenes/Shinomotazh.prices/Shinomotazh.prices.edit'
import ShinomontazhsList from '../scenes/Shinomontazhs/Shinomontazhs.list'
import ShinomontazhsListBoss from '../scenes/Shinomontazhs/Shinomontazhs.list.boss'
import ShinomontazhsNew from '../scenes/Shinomontazhs/Shinomontazhs.work.create'
import ShinomontazhEditFull from '../scenes/Shinomontazhs/Shinomontazhs.edit'
import VendorList from '../scenes/Vendors/Vendors.list'
import VendorNew from '../scenes/Vendors/Vendors.create'
import VendorEdit from '../scenes/Vendors/Vendors.edit'
import TyresList from '../scenes/Tyres/Tyres.list'
import TyresNew from '../scenes/Tyres/Tyres.preorder.create'
import TyreEditSimple from '../scenes/Tyres/Tyres.preorder.edit'
import TyreEditFull from '../scenes/Tyres/Tyres.edit'
import TyreView from '../scenes/Tyres/Tyres.preorder.view'

import Startup from './startup'

const OnlyAnonymousRoute = ({ component: Component, ...rest }) => {
  const auth = useSelector((s) => s.auth)
  const func = (props) =>
    !!auth.user && !!auth.token ? (
      <Redirect to={{ pathname: '/login' }} />
    ) : (
      <Component {...props} />
    )
  return <Route {...rest} render={func} />
}

const PrivateRoute = ({ component: Component, ...rest }) => {
  const auth = useSelector((s) => s.auth)
  const func = (props) =>
    !!auth.user && !!auth.token ? (
      <Component {...props} />
    ) : (
      <Redirect
        to={{
          pathname: '/login'
        }}
      />
    )
  return <Route {...rest} render={func} />
}

const AdminRoute = ({ component: Component, ...rest }) => {
  const auth = useSelector((s) => s.auth)
  const func = (props) =>
    !!auth.user && !!auth.token && !!auth.roles.includes('admin') ? (
      <Component {...props} />
    ) : (
      <Redirect
        to={{
          pathname: '/access'
        }}
      />
    )
  return <Route {...rest} render={func} />
}

const BossRoute = ({ component: Component, ...rest }) => {
  const auth = useSelector((s) => s.auth)
  const func = (props) =>
    !!auth.user && !!auth.token && !!auth.roles.includes('boss') ? (
      <Component {...props} />
    ) : (
      <Redirect
        to={{
          pathname: '/access'
        }}
      />
    )
  return <Route {...rest} render={func} />
}

const types = {
  component: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }),
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string
  }),
  token: PropTypes.string
}

const defaults = {
  location: {
    pathname: ''
  },
  user: null,
  token: ''
}

OnlyAnonymousRoute.propTypes = types
PrivateRoute.propTypes = types

PrivateRoute.defaultProps = defaults
OnlyAnonymousRoute.defaultProps = defaults

const RouterSelector = (props) =>
  typeof window !== 'undefined' ? <ConnectedRouter {...props} /> : <StaticRouter {...props} />

const RootComponent = (props) => {
  return (
    <Provider store={store}>
      <RouterSelector history={history} location={props.location} context={props.context}>
        <Startup>
          <Switch>
            {/* <Route exact path="/" component={() => <Registration />} /> */}
            <PrivateRoute exact path="/" component={() => <Dashboard />} />
            <Route exact path="/registration" component={() => <Registration />} />
            <Route exact path="/login" component={() => <LoginForm />} />
            <PrivateRoute exact path="/admin" component={() => <AdminPannel />} />
            <PrivateRoute exact path="/room" component={() => <Room />} />
            <PrivateRoute exact path="/chat" component={() => <ChatView />} />
            <PrivateRoute exact path="/" component={() => <Dashboard />} />
            <Route exact path="/access" component={() => <Access />} />
            <BossRoute exact path="/boss" component={() => <Boss />} />
            <PrivateRoute exact path="/autoparts/order/list" component={AutopartsList} />
            <PrivateRoute exact path="/autoparts/order/create" component={AutopartsNew} />
            <PrivateRoute exact path="/autoparts/edit/:id" component={AutopartEditSimple} />
            <PrivateRoute exact path="/autoparts/editfull/:id" component={AutopartEditFull} />
            <PrivateRoute exact path="/autoparts/view/:id" component={AutopartView} />
            <AdminRoute exact path="/place/list" component={PlaceList} />
            <PrivateRoute exact path="/place/create" component={PlaceNew} />
            <PrivateRoute exact path="/place/edit/:id" component={PlaceEdit} />
            <AdminRoute exact path="/employee/list" component={EmployeeList} />
            <PrivateRoute exact path="/employee/create" component={EmployeeNew} />
            <PrivateRoute exact path="/employee/edit/:id" component={EmployeeEdit} />
            <AdminRoute exact path="/account/list" component={AccountList} />
            <PrivateRoute exact path="/account/create" component={AccountNew} />
            {/* <Route exact path="/register" component={RegisterCommon} /> */}
            <PrivateRoute exact path="/account/edit/:id" component={AccountEdit} />
            <PrivateRoute exact path="/customer/list" component={CustomerList} />
            <PrivateRoute exact path="/customer/create" component={CustomerNew} />
            <PrivateRoute exact path="/customer/edit/:id" component={CustomerEdit} />
            <PrivateRoute exact path="/razval/list" component={RazvalList} />
            <PrivateRoute exact path="/razval/create" component={RazvalNew} />
            <PrivateRoute exact path="/razval/edit/:id" component={RazvalEdit} />
            <PrivateRoute exact path="/settings" component={SettingEdit} />
            <AdminRoute exact path="/material/list" component={MaterialList} />
            <PrivateRoute exact path="/material/create" component={MaterialNew} />
            <PrivateRoute exact path="/material/edit/:id" component={MaterialEdit} />
            <AdminRoute exact path="/shinomontazhprice/list" component={ShinomontazhpriceList} />
            <PrivateRoute exact path="/shinomontazhprice/create" component={ShinomontazhpriceNew} />
            <PrivateRoute exact path="/vendor/list" component={VendorList} />
            <PrivateRoute exact path="/vendor/create" component={VendorNew} />
            <PrivateRoute exact path="/vendor/edit/:id" component={VendorEdit} />
            <PrivateRoute
              exact
              path="/shinomontazhprice/edit/:id"
              component={ShinomontazhpriceEdit}
            />
            <PrivateRoute exact path="/shinomontazh/list" component={ShinomontazhsList} />
            <PrivateRoute exact path="/shinomontazhboss/list" component={ShinomontazhsListBoss} />
            <PrivateRoute exact path="/shinomontazh/create" component={ShinomontazhsNew} />
            <PrivateRoute exact path="/shinomontazh/edit/:id" component={ShinomontazhEditFull} />
            <PrivateRoute exact path="/tyres/order/list" component={TyresList} />
            <PrivateRoute exact path="/tyres/order/create" component={TyresNew} />
            <PrivateRoute exact path="/tyres/edit/:id" component={TyreEditSimple} />
            <PrivateRoute exact path="/tyres/editfull/:id" component={TyreEditFull} />
            <PrivateRoute exact path="/tyres/view/:id" component={TyreView} />
            <Route component={() => <NotFound />} />
          </Switch>
        </Startup>
      </RouterSelector>
    </Provider>
  )
}

export default RootComponent
