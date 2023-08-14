import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { socket } from '../../redux/sockets/socketReceivers'
// import { getTyres } from '../../redux/reducers/tyres'
import { getItemsByPage } from '../../redux/reducers/tyres'
import { getVendors } from '../../redux/reducers/vendors'

import { checkQueryParamsAre } from '../../hooks/saveFilterParams'

const OnLoad = (page, showSearch) => {
  const dispatch = useDispatch()

  const { search } = useLocation()
  useEffect(() => {
    if (checkQueryParamsAre(showSearch, search)) {
      dispatch(getItemsByPage(page))
    }
  }, [dispatch, page, showSearch])

  useEffect(() => {
    dispatch(getVendors())
  }, [dispatch])

  useEffect(() => {
    socket.on('update tyre', function () {
      dispatch(getItemsByPage(page))
    })
  }, [])

  useEffect(() => {
    socket.on('update edited tyre', function () {
      dispatch(getItemsByPage(page))
    })
  }, [])

  useEffect(() => {
    socket.on('update tyre from oline shop', function () {
      dispatch(getItemsByPage(page))
    })
  }, [])
}

export default OnLoad
