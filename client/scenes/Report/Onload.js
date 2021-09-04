import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { socket } from '../../redux/sockets/socketReceivers'
import { getShinomontazhs } from '../../redux/reducers/shinomontazhs'

const OnLoad = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getShinomontazhs())
  }, [dispatch])

  useEffect(() => {
    socket.on('update shinomontazh', function () {
      dispatch(getShinomontazhs())
    })
  }, [])

  useEffect(() => {
    socket.on('update edited shinomontazh', function () {
      dispatch(getShinomontazhs())
    })
  }, [])
}

export default OnLoad
