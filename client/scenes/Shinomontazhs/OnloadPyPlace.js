import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
// import { socket } from '../../redux/sockets/socketReceivers'
import { getItemsFiltered } from '../../redux/reducers/shinomontazhs'

const OnLoadPlace = (page, showSearch, place) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!showSearch) {
      dispatch(getItemsFiltered(page, place))
    }
  }, [dispatch, page, showSearch, place])

  // useEffect(() => {
  //   socket.on('update sto', function () {
  //     dispatch(getShinomontazhsLastTwoDays())
  //   })
  // }, [])

  // useEffect(() => {
  //   socket.on('update edited sto', function () {
  //     dispatch(getShinomontazhsLastTwoDays())
  //   })
  // }, [])
}

export default OnLoadPlace
