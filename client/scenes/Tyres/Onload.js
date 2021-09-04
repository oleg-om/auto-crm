import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { socket } from '../../redux/sockets/socketReceivers'
import { getTyres } from '../../redux/reducers/tyres'
import { getVendors } from '../../redux/reducers/vendors'

const OnLoad = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getTyres())
  }, [dispatch])

  useEffect(() => {
    dispatch(getVendors())
  }, [dispatch])

  useEffect(() => {
    socket.on('update tyre', function () {
      dispatch(getTyres())
    })
  }, [])

  useEffect(() => {
    socket.on('update edited tyre', function () {
      dispatch(getTyres())
    })
  }, [])

  useEffect(() => {
    socket.on('update tyre from oline shop', function () {
      dispatch(getTyres())
    })
  }, [])
}

export default OnLoad
