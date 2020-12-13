import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { trySignIn } from '../redux/reducers/auth'
import { getCustomers } from '../redux/reducers/customers'
import { getAutoparts } from '../redux/reducers/autoparts'
import { getPlaces } from '../redux/reducers/places'
import { getEmployees } from '../redux/reducers/employees'
import { getAccounts } from '../redux/reducers/accounts'
import { getRazvals } from '../redux/reducers/razvals'
import { getOils } from '../redux/reducers/oils'

const Startup = (props) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(trySignIn())
  }, [dispatch])

  useEffect(() => {
    dispatch(getAutoparts())
  }, [dispatch])

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
    dispatch(getAccounts())
  }, [dispatch])

  useEffect(() => {
    dispatch(getRazvals())
  }, [dispatch])

  useEffect(() => {
    dispatch(getOils())
  }, [dispatch])

  return props.children
}

Startup.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
}

export default Startup
