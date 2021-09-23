import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getVendors } from '../../redux/reducers/vendors'

const OnLoad = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getVendors())
  }, [dispatch])
}

export default OnLoad
