import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { socket } from '../../redux/sockets/socketReceivers'
import { getCondprices } from '../../redux/reducers/cond.prices'
import { getItemsByPage } from '../../redux/reducers/windows'
import { getCondItemsByPage } from '../../redux/reducers/conds'
import { getWindowprices } from '../../redux/reducers/window.prices'

export const getFunc = (location) => {
  if (location.pathname.includes('window')) {
    return getWindowprices()
  }
  return getCondprices()
}

const getSocketName = (location) => {
  if (location.pathname.includes('window')) {
    return 'window'
  }
  return 'cond'
}

const getItemsByPageFunc = (page, location) => {
  if (location.pathname.includes('window')) {
    return getItemsByPage(page)
  }
  return getCondItemsByPage(page)
}

export function usePrices() {
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    dispatch(getFunc(location))
  }, [dispatch, location])
}

const OnLoad = (page, showSearch) => {
  const dispatch = useDispatch()

  const location = useLocation()

  usePrices()

  useEffect(() => {
    if (!showSearch && page) {
      dispatch(getItemsByPageFunc(page, location))
    }
  }, [dispatch, page, showSearch, location])

  useEffect(() => {
    if (page)
      socket.on(`update ${getSocketName(location)}`, function () {
        dispatch(getItemsByPageFunc(page, location))
      })
  }, [])

  useEffect(() => {
    if (page)
      socket.on(`update edited ${getSocketName(location)}`, function () {
        dispatch(getItemsByPageFunc(page, location))
      })
  }, [])
}

export default OnLoad
