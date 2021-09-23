import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { socket } from '../../redux/sockets/socketReceivers'
// import { getTyres } from '../../redux/reducers/tyres'
import { getItemsByPage } from '../../redux/reducers/tyres'
import { getVendors } from '../../redux/reducers/vendors'

const OnLoad = (page, showSearch) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!showSearch) {
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
