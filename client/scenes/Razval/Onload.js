import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { socket } from '../../redux/sockets/socketReceivers'
import { getRazvals } from '../../redux/reducers/razvals'
import { getOils } from '../../redux/reducers/oils'

const OnLoad = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getRazvals())
  }, [dispatch])

  useEffect(() => {
    dispatch(getOils())
  }, [dispatch])

  useEffect(() => {
    socket.on('update razval', function () {
      dispatch(getRazvals())
    })
  }, [])

  useEffect(() => {
    socket.on('update edited razval', function () {
      dispatch(getRazvals())
    })
  }, [])

  useEffect(() => {
    socket.on('update oil', function () {
      dispatch(getOils())
    })
  }, [])

  useEffect(() => {
    socket.on('update edited oil', function () {
      dispatch(getOils())
    })
  }, [])
}

export default OnLoad
