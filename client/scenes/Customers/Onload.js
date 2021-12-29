import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
// import { getTyres } from '../../redux/reducers/tyres'
import { getItemsByPage } from '../../redux/reducers/customers'

const OnLoad = (page, showSearch) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!showSearch) {
      dispatch(getItemsByPage(page))
    }
  }, [dispatch, page, showSearch])
}

export default OnLoad
