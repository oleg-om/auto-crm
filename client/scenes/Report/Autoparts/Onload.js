import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getAutoparts } from '../../../redux/reducers/autoparts'
import { getVendors } from '../../../redux/reducers/vendors'

const OnLoad = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAutoparts())
  }, [dispatch])

  useEffect(() => {
    dispatch(getVendors())
  }, [dispatch])
}

export default OnLoad
