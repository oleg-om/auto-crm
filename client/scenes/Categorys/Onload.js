import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getCategorys } from '../../redux/reducers/categorys'

const OnLoad = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getCategorys())
  }, [dispatch])
}

export default OnLoad
