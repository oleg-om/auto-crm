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
import Report from '../scenes/Report/Report'
import StoragesList from '../scenes/Storage/Storage.list'
import StoragesNew from '../scenes/Storage/Storage.preorder.create'
import StorageEditSimple from '../scenes/Storage/Storage.preorder.edit'
import StorageEditFull from '../scenes/Storage/Storage.edit'
import StorageView from '../scenes/Storage/Storage.preorder.view'
import ScrollToTop from '../components/ScrollToTop'
import Startup from './startup'

import ToolsList from '../scenes/Tools/Tools.list'
import ToolsNew from '../scenes/Tools/Tools.preorder.create'
import ToolEditSimple from '../scenes/Tools/Tools.preorder.edit'
import ToolEditFull from '../scenes/Tools/Tools.edit'
import ToolView from '../scenes/Tools/Tools.preorder.view'

import StopriceList from '../scenes/Sto.prices/Sto.prices.list'
import StopriceNew from '../scenes/Sto.prices/Sto.prices.create'
import StopriceEdit from '../scenes/Sto.prices/Sto.prices.edit'
import StosList from '../scenes/Sto/Stos.list'
import StosListBoss from '../scenes/Sto/Stos.list.boss'
import StosNew from '../scenes/Sto/Stos.work.create'
import StoEditFull from '../scenes/Sto/Stos.edit'

import CategoryList from '../scenes/Categorys/Categorys.list'
import CategoryNew from '../scenes/Categorys/Categorys.create'
import CategoryEdit from '../scenes/Categorys/Categorys.edit'

import WashpriceList from '../scenes/Wash.prices/Wash.prices.list'
import WashpriceNew from '../scenes/Wash.prices/Wash.prices.create'
import WashpriceEdit from '../scenes/Wash.prices/Wash.prices.edit'
import WashsList from '../scenes/Wash/Washs.list'
import WashsListBoss from '../scenes/Wash/Washs.list.boss'
import WashsNew from '../scenes/Wash/Washs.work.create'
import WashEditFull from '../scenes/Wash/Washs.edit'
import PreentryList from '../scenes/ShinomontazhPreentry/ShinomontazhPreentry.list'

import WindowpriceList from '../scenes/Window.prices/Window.prices.list'
import WindowpriceNew from '../scenes/Window.prices/Window.prices.create'
import WindowpriceEdit from '../scenes/Window.prices/Window.prices.edit'
import WindowsList from '../scenes/Window/Windows.list'
import WindowsNew from '../scenes/Window/Windows.work.create'
import WindowEditFull from '../scenes/Window/Windows.edit'
import OilList from '../scenes/Razval/Oil.list'

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
          <ScrollToTop />
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
            <PrivateRoute exact path="/autoparts/order/list/:num" component={AutopartsList} />
            <PrivateRoute exact path="/autoparts/order/list/" component={AutopartsList} />
            <PrivateRoute exact path="/autoparts/order/create/:num" component={AutopartsNew} />
            <PrivateRoute exact path="/autoparts/order/create" component={AutopartsNew} />
            <PrivateRoute exact path="/autoparts/edit/:id/:num" component={AutopartEditSimple} />
            <PrivateRoute exact path="/autoparts/edit/:id" component={AutopartEditSimple} />
            <PrivateRoute exact path="/autoparts/editfull/:id/:num" component={AutopartEditFull} />
            <PrivateRoute exact path="/autoparts/editfull/:id" component={AutopartEditFull} />
            <PrivateRoute exact path="/autoparts/view/:id/:num" component={AutopartView} />
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
            <PrivateRoute exact path="/customer/list/:num" component={CustomerList} />
            <PrivateRoute exact path="/customer/create" component={CustomerNew} />
            <PrivateRoute exact path="/customer/edit/:id" component={CustomerEdit} />
            <PrivateRoute exact path="/razval/list" component={RazvalList} />
            <PrivateRoute exact path="/oil/list" component={OilList} />
            <PrivateRoute exact path="/settings" component={SettingEdit} />
            <PrivateRoute exact path="/material/list" component={MaterialList} />
            <PrivateRoute exact path="/material/create" component={MaterialNew} />
            <PrivateRoute exact path="/material/edit/:id" component={MaterialEdit} />
            <PrivateRoute
              exact
              path="/shinomontazhprice/list/:type"
              component={ShinomontazhpriceList}
            />
            <PrivateRoute exact path="/shinomontazhprice/create" component={ShinomontazhpriceNew} />
            <PrivateRoute exact path="/vendor/list" component={VendorList} />
            <PrivateRoute exact path="/vendor/create" component={VendorNew} />
            <PrivateRoute exact path="/vendor/edit/:id" component={VendorEdit} />
            <PrivateRoute
              exact
              path="/shinomontazhprice/:type/edit/:id"
              component={ShinomontazhpriceEdit}
            />
            <PrivateRoute exact path="/shinomontazh/list/:num" component={ShinomontazhsList} />
            <PrivateRoute exact path="/shinomontazh/list" component={ShinomontazhsList} />
            <PrivateRoute
              exact
              path="/shinomontazhboss/list/:num"
              component={ShinomontazhsListBoss}
            />
            <PrivateRoute exact path="/shinomontazhboss/list" component={ShinomontazhsListBoss} />
            <PrivateRoute exact path="/shinomontazh/create/:num" component={ShinomontazhsNew} />
            <PrivateRoute exact path="/shinomontazh/create" component={ShinomontazhsNew} />
            <PrivateRoute exact path="/shinomontazhboss/create/:num" component={ShinomontazhsNew} />
            <PrivateRoute exact path="/shinomontazhboss/create" component={ShinomontazhsNew} />
            <PrivateRoute
              exact
              path="/shinomontazh/edit/:id/:num"
              component={ShinomontazhEditFull}
            />
            <PrivateRoute exact path="/shinomontazh/edit/:id" component={ShinomontazhEditFull} />
            <PrivateRoute
              exact
              path="/shinomontazhboss/edit/:id/:num"
              component={ShinomontazhEditFull}
            />
            <PrivateRoute
              exact
              path="/shinomontazhboss/edit/:id"
              component={ShinomontazhEditFull}
            />
            <PrivateRoute exact path="/tyres/order/list/:num" component={TyresList} />
            <PrivateRoute exact path="/tyres/order/list" component={TyresList} />
            <PrivateRoute exact path="/tyres/order/create/:num" component={TyresNew} />
            <PrivateRoute exact path="/tyres/order/create" component={TyresNew} />
            <PrivateRoute exact path="/tyres/edit/:id/:num" component={TyreEditSimple} />
            <PrivateRoute exact path="/tyres/edit/:id" component={TyreEditSimple} />
            <PrivateRoute exact path="/tyres/editfull/:id/:num" component={TyreEditFull} />
            <PrivateRoute exact path="/tyres/editfull/:id" component={TyreEditFull} />
            <PrivateRoute exact path="/tyres/view/:id/:num" component={TyreView} />
            <PrivateRoute exact path="/tyres/view/:id" component={TyreView} />
            <PrivateRoute exact path="/report" component={Report} />
            <PrivateRoute exact path="/storages/order/list/:num" component={StoragesList} />
            <PrivateRoute exact path="/storages/order/list/" component={StoragesList} />
            <PrivateRoute exact path="/storages/order/create/:num" component={StoragesNew} />
            <PrivateRoute exact path="/storages/order/create" component={StoragesNew} />
            <PrivateRoute exact path="/storages/edit/:id/:num" component={StorageEditSimple} />
            <PrivateRoute exact path="/storages/edit/:id" component={StorageEditSimple} />
            <PrivateRoute exact path="/storages/editfull/:id/:num" component={StorageEditFull} />
            <PrivateRoute exact path="/storages/editfull/:id" component={StorageEditFull} />
            <PrivateRoute exact path="/storages/view/:id/:num" component={StorageView} />
            <PrivateRoute exact path="/storages/view/:id" component={StorageView} />
            <PrivateRoute exact path="/tools/order/list/:num" component={ToolsList} />
            <PrivateRoute exact path="/tools/order/list/" component={ToolsList} />
            <PrivateRoute exact path="/tools/order/create/:num" component={ToolsNew} />
            <PrivateRoute exact path="/tools/order/create" component={ToolsNew} />
            <PrivateRoute exact path="/tools/edit/:id/:num" component={ToolEditSimple} />
            <PrivateRoute exact path="/tools/edit/:id" component={ToolEditSimple} />
            <PrivateRoute exact path="/tools/editfull/:id/:num" component={ToolEditFull} />
            <PrivateRoute exact path="/tools/editfull/:id" component={ToolEditFull} />
            <PrivateRoute exact path="/tools/view/:id/:num" component={ToolView} />
            <PrivateRoute exact path="/tools/view/:id" component={ToolView} />

            <PrivateRoute exact path="/stoprice/list/:type" component={StopriceList} />
            <PrivateRoute exact path="/stoprice/create" component={StopriceNew} />
            <PrivateRoute exact path="/stoprice/:type/edit/:id" component={StopriceEdit} />
            <PrivateRoute exact path="/sto/list/:num" component={StosList} />
            <PrivateRoute exact path="/sto/list" component={StosList} />
            <PrivateRoute exact path="/stoboss/list/:num" component={StosListBoss} />
            <PrivateRoute exact path="/stoboss/list" component={StosListBoss} />
            <PrivateRoute exact path="/sto/create/:num" component={StosNew} />
            <PrivateRoute exact path="/sto/create" component={StosNew} />
            <PrivateRoute exact path="/stoboss/create/:num" component={StosNew} />
            <PrivateRoute exact path="/stoboss/create" component={StosNew} />
            <PrivateRoute exact path="/sto/edit/:id/:num" component={StoEditFull} />
            <PrivateRoute exact path="/sto/edit/:id" component={StoEditFull} />
            <PrivateRoute exact path="/stoboss/edit/:id/:num" component={StoEditFull} />
            <PrivateRoute exact path="/stoboss/edit/:id" component={StoEditFull} />

            <PrivateRoute exact path="/category/list" component={CategoryList} />
            <PrivateRoute exact path="/category/create" component={CategoryNew} />
            <PrivateRoute exact path="/category/edit/:id" component={CategoryEdit} />
            {/* wash */}
            <PrivateRoute exact path="/washprice/list/" component={WashpriceList} />
            <PrivateRoute exact path="/washprice/list/:type" component={WashpriceList} />
            <PrivateRoute exact path="/washprice/create" component={WashpriceNew} />
            <PrivateRoute exact path="/washprice/:type/edit/:id" component={WashpriceEdit} />
            <PrivateRoute exact path="/wash/list/:num" component={WashsList} />
            <PrivateRoute exact path="/wash/list" component={WashsList} />
            <PrivateRoute exact path="/washboss/list/:num" component={WashsListBoss} />
            <PrivateRoute exact path="/washboss/list" component={WashsListBoss} />
            <PrivateRoute exact path="/wash/create/:num" component={WashsNew} />
            <PrivateRoute exact path="/wash/create" component={WashsNew} />
            <PrivateRoute exact path="/washboss/create/:num" component={WashsNew} />
            <PrivateRoute exact path="/washboss/create" component={WashsNew} />
            <PrivateRoute exact path="/wash/edit/:id/:num" component={WashEditFull} />
            <PrivateRoute exact path="/wash/edit/:id" component={WashEditFull} />
            <PrivateRoute exact path="/washboss/edit/:id/:num" component={WashEditFull} />
            <PrivateRoute exact path="/washboss/edit/:id" component={WashEditFull} />

            <PrivateRoute exact path="/preentry/shinomontazh" component={PreentryList} />
            <PrivateRoute exact path="/preentry/sto" component={PreentryList} />
            <PrivateRoute exact path="/preentry/oil" component={PreentryList} />
            {/* window */}
            <PrivateRoute exact path="/windowprice/list/" component={WindowpriceList} />
            <PrivateRoute exact path="/windowprice/list/:type" component={WindowpriceList} />
            <PrivateRoute exact path="/windowprice/create" component={WindowpriceNew} />
            <PrivateRoute exact path="/windowprice/:type/edit/:id" component={WindowpriceEdit} />

            <PrivateRoute exact path="/window/list/:num" component={WindowsList} />
            <PrivateRoute exact path="/window/list" component={WindowsList} />
            <PrivateRoute exact path="/windowboss/list/:num" component={WindowsList} />
            <PrivateRoute exact path="/windowboss/list" component={WindowsList} />
            <PrivateRoute exact path="/window/create/:num" component={WindowsNew} />
            <PrivateRoute exact path="/window/create" component={WindowsNew} />
            <PrivateRoute exact path="/windowboss/create/:num" component={WindowsNew} />
            <PrivateRoute exact path="/windowboss/create" component={WindowsNew} />
            <PrivateRoute exact path="/window/edit/:id/:num" component={WindowEditFull} />
            <PrivateRoute exact path="/window/edit/:id" component={WindowEditFull} />
            <PrivateRoute exact path="/windowboss/edit/:id/:num" component={WindowEditFull} />
            <PrivateRoute exact path="/windowboss/edit/:id" component={WindowEditFull} />
            {/* cond */}
            <PrivateRoute exact path="/condprice/list/" component={WindowpriceList} />
            <PrivateRoute exact path="/condprice/list/:type" component={WindowpriceList} />
            <PrivateRoute exact path="/condprice/create" component={WindowpriceNew} />
            <PrivateRoute exact path="/condprice/:type/edit/:id" component={WindowpriceEdit} />

            <PrivateRoute exact path="/cond/list/:num" component={WindowsList} />
            <PrivateRoute exact path="/cond/list" component={WindowsList} />
            <PrivateRoute exact path="/condboss/list/:num" component={WindowsList} />
            <PrivateRoute exact path="/condboss/list" component={WindowsList} />
            <PrivateRoute exact path="/cond/create/:num" component={WindowsNew} />
            <PrivateRoute exact path="/cond/create" component={WindowsNew} />
            <PrivateRoute exact path="/condboss/create/:num" component={WindowsNew} />
            <PrivateRoute exact path="/condboss/create" component={WindowsNew} />
            <PrivateRoute exact path="/cond/edit/:id/:num" component={WindowEditFull} />
            <PrivateRoute exact path="/cond/edit/:id" component={WindowEditFull} />
            <PrivateRoute exact path="/condboss/edit/:id/:num" component={WindowEditFull} />
            <PrivateRoute exact path="/condboss/edit/:id" component={WindowEditFull} />

            <Route component={() => <NotFound />} />
          </Switch>
        </Startup>
      </RouterSelector>
    </Provider>
  )
}

export default RootComponent
