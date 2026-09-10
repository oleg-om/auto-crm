import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
// import { useDispatch } from 'react-redux'
// import { searchOff } from '../redux/reducers/common'

export default function ScrollToTop() {
  const { pathname, state } = useLocation()

  // const dispatch = useDispatch()

  useEffect(() => {
    // A route change can be "virtual" - e.g. opening a dialog that's wired
    // up as its own route (see Employees.list.tsx) - and shouldn't reset
    // the scroll position of the page underneath it. Such navigations pass
    // `state: { preserveScroll: true }` to opt out of the reset.
    if (state?.preserveScroll) return
    window.scrollTo(0, 0)
    // dispatch(searchOff())
  }, [pathname, state])

  return null
}
