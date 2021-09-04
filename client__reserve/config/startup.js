import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { trySignIn } from '../redux/reducers/auth'
import { getCustomers } from '../redux/reducers/customers'
import { getAutoparts } from '../redux/reducers/autoparts'
import { getPlaces } from '../redux/reducers/places'
import { getEmployees } from '../redux/reducers/employees'
import { getAccounts } from '../redux/reducers/accounts'
import { getRazvals } from '../redux/reducers/razvals'
import { getOils } from '../redux/reducers/oils'
import { getSettings } from '../redux/reducers/settings'
import { getMaterials } from '../redux/reducers/materials'
import { getShinomontazhprices } from '../redux/reducers/shinomotazh.prices'
import { getShinomontazhs, getShinomontazhsLastTwoDays } from '../redux/reducers/shinomontazhs'
import { getVendors } from '../redux/reducers/vendors'
import { getTyres } from '../redux/reducers/tyres'

const Startup = (props) => {
  const role = useSelector((s) => s.auth.roles)

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(trySignIn())
  }, [dispatch])

  useEffect(() => {
    if (
      role.includes('boss') ||
      role.includes('admin') ||
      role.includes('autopartfull') ||
      role.includes('autopartsimple')
    ) {
      dispatch(getAutoparts())
    }
  }, [dispatch, role])

  useEffect(() => {
    dispatch(getCustomers())
  }, [dispatch])

  useEffect(() => {
    dispatch(getPlaces())
  }, [dispatch])

  useEffect(() => {
    dispatch(getEmployees())
  }, [dispatch])

  useEffect(() => {
    if (role.includes('boss') || role.includes('admin')) {
      dispatch(getAccounts())
    }
  }, [dispatch, role])

  useEffect(() => {
    if (role.includes('boss') || role.includes('admin') || role.includes('razval')) {
      dispatch(getRazvals())
    }
  }, [dispatch, role])

  useEffect(() => {
    if (role.includes('boss') || role.includes('admin') || role.includes('razval')) {
      dispatch(getOils())
    }
  }, [dispatch, role])

  useEffect(() => {
    dispatch(getSettings())
  }, [dispatch])

  useEffect(() => {
    if (
      role.includes('boss') ||
      role.includes('admin') ||
      role.includes('shinomontazh') ||
      role.includes('bookkeeper')
    ) {
      dispatch(getMaterials())
    }
  }, [dispatch, role])

  useEffect(() => {
    if (
      role.includes('boss') ||
      role.includes('admin') ||
      role.includes('shinomontazh') ||
      role.includes('bookkeeper')
    ) {
      dispatch(getShinomontazhprices())
    }
  }, [dispatch, role])

  useEffect(() => {
    if (role.includes('boss') || role.includes('admin') || role.includes('bookkeeper')) {
      dispatch(getShinomontazhs())
    }
  }, [dispatch, role])

  useEffect(() => {
    if (
      role.includes('shinomontazh') &&
      !role.includes('boss') &&
      !role.includes('admin') &&
      !role.includes('bookkeeper')
    ) {
      dispatch(getShinomontazhsLastTwoDays())
    }
  }, [dispatch, role])

  useEffect(() => {
    dispatch(getVendors())
  }, [dispatch])

  useEffect(() => {
    if (
      role.includes('boss') ||
      role.includes('admin') ||
      role.includes('tyrefull') ||
      role.includes('tyresimple')
    ) {
      dispatch(getTyres())
    }
  }, [dispatch, role])

  return props.children
}

Startup.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
}

export default Startup
