import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { socket } from '../../redux/sockets/socketReceivers'
import { getAutoparts } from '../../redux/reducers/autoparts'

const OnloadAutoparts = () => {
  socket.connect()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAutoparts())
  }, [dispatch])

  useEffect(() => {
    socket.on('update autopart', () => {
      dispatch(getAutoparts())
    })
  }, [])

  useEffect(() => {
    socket.on('update edited autopart', () => {
      dispatch(getAutoparts())
    })
  }, [])
}

export default OnloadAutoparts
