import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
// import { socket } from '../../redux/sockets/socketReceivers'
import { getCondprices } from '../../redux/reducers/cond.prices'
import { getItemsFiltered } from '../../redux/reducers/windows'
import { getCondItemsFiltered } from '../../redux/reducers/conds'
import { getWindowprices } from '../../redux/reducers/window.prices'

const getFunc = (location) => {
  if (location.pathname.includes('window')) {
    return getWindowprices()
  }
  return getCondprices()
}

const getItemsFilteredFunc = (page, place, location) => {
  if (location.pathname.includes('window')) {
    return getItemsFiltered(page, place)
  }
  return getCondItemsFiltered(page, place)
}

const OnLoadPlace = (page, showSearch, place) => {
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    dispatch(getFunc(location))
  }, [dispatch, location])

  useEffect(() => {
    if (!showSearch && place) {
      dispatch(getItemsFilteredFunc(page, place, location))
    }
  }, [dispatch, page, showSearch, place, location])

  // useEffect(() => {
  //   socket.on('update wash', function () {
  //     dispatch(getWashsLastTwoDays())
  //   })
  // }, [])

  // useEffect(() => {
  //   socket.on('update edited wash', function () {
  //     dispatch(getWashsLastTwoDays())
  //   })
  // }, [])
}

export default OnLoadPlace
