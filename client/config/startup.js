import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { trySignIn } from '../redux/reducers/auth'

const Startup = (props) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(trySignIn())
  }, [dispatch])

  return props.children
}

Startup.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
}

export default Startup
