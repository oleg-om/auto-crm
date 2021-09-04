import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { socket } from '../../redux/sockets/socketReceivers'
import { getStorages } from '../../redux/reducers/storage'

const OnLoad = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getStorages())
  }, [dispatch])

  useEffect(() => {
    socket.on('update storage', function () {
      dispatch(getStorages())
    })
  }, [])

  useEffect(() => {
    socket.on('update edited storage', function () {
      dispatch(getStorages())
    })
  }, [])
}

export default OnLoad
