import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { socket } from '../../redux/sockets/socketReceivers'
import { getAutopartsByPage } from '../../redux/reducers/autoparts'
import { getVendors } from '../../redux/reducers/vendors'

const OnLoad = (page, showSearch) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!showSearch) {
      dispatch(getAutopartsByPage(page))
    }
  }, [dispatch, page, showSearch])

  useEffect(() => {
    dispatch(getVendors())
  }, [dispatch])

  useEffect(() => {
    socket.on('update autopart', function () {
      dispatch(getAutopartsByPage(page))
    })
  }, [])

  useEffect(() => {
    socket.on('update edited autopart', function () {
      dispatch(getAutopartsByPage(page))
    })
  }, [])
}

export default OnLoad
