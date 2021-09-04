import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
// import { socket } from '../../redux/sockets/socketReceivers'
import { getShinomontazhsLastTwoDays } from '../../redux/reducers/shinomontazhs'

const OnLoad = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getShinomontazhsLastTwoDays())
  }, [dispatch])

  // useEffect(() => {
  //   socket.on('update shinomontazh', function () {
  //     dispatch(getShinomontazhsLastTwoDays())
  //   })
  // }, [])

  // useEffect(() => {
  //   socket.on('update edited shinomontazh', function () {
  //     dispatch(getShinomontazhsLastTwoDays())
  //   })
  // }, [])
}

export default OnLoad
