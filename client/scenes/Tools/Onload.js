import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { socket } from '../../redux/sockets/socketReceivers'
import { getToolsByPage } from '../../redux/reducers/tools'
import { getVendors } from '../../redux/reducers/vendors'

const OnLoad = (page, showSearch) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!showSearch) {
      dispatch(getToolsByPage(page))
    }
  }, [dispatch, page, showSearch])

  useEffect(() => {
    dispatch(getVendors())
  }, [dispatch])

  useEffect(() => {
    socket.on('update tool', function () {
      dispatch(getToolsByPage(page))
    })
  }, [])

  useEffect(() => {
    socket.on('update edited tool', function () {
      dispatch(getToolsByPage(page))
    })
  }, [])
}

export default OnLoad
