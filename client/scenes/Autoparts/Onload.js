import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { socket } from '../../redux/sockets/socketReceivers'
import { getAutoparts } from '../../redux/reducers/autoparts'
import { getVendors } from '../../redux/reducers/vendors'

const OnLoad = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAutoparts())
  }, [dispatch])

  useEffect(() => {
    dispatch(getVendors())
  }, [dispatch])

  useEffect(() => {
    socket.on('update autopart', function () {
      dispatch(getAutoparts())
    })
  }, [])

  useEffect(() => {
    socket.on('update edited autopart', function () {
      dispatch(getAutoparts())
    })
  }, [])
}

export default OnLoad
