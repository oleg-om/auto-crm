import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
// import { socket } from '../../redux/sockets/socketReceivers'
import { getItemsFiltered } from '../../redux/reducers/washs'
import { getWashprices } from '../../redux/reducers/wash.prices'

const OnLoadPlace = (page, showSearch, place) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getWashprices())
  }, [dispatch])

  useEffect(() => {
    if (!showSearch) {
      dispatch(getItemsFiltered(page, place))
    }
  }, [dispatch, page, showSearch, place])

  // useEffect(() => {
  //   socket.on('update wash', function () {
  //     dispatch(getWashsLastTwoDays())
  //   })
  // }, [])

  // useEffect(() => {
  //   socket.on('update edited wash', function () {
  //     dispatch(getWashsLastTwoDays())
  //   })
  // }, [])
}

export default OnLoadPlace
