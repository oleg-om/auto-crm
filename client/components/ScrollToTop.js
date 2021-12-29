import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
// import { useDispatch } from 'react-redux'
// import { searchOff } from '../redux/reducers/common'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  // const dispatch = useDispatch()

  useEffect(() => {
    window.scrollTo(0, 0)
    // dispatch(searchOff())
  }, [pathname])

  return null
}
