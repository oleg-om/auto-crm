import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getOrganizations } from '../../redux/reducers/organizations'

const OnLoad = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getOrganizations())
  }, [dispatch])
}

export default OnLoad
