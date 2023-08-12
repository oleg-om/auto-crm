import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
// import { socket } from '../../redux/sockets/socketReceivers'
import { getItemsFiltered } from '../../redux/reducers/stos'
// import { socketCondition } from '../../utils/utils'

const OnLoadPlace = (page, showSearch, place) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!showSearch && place) {
      dispatch(getItemsFiltered(page, place))
    }
  }, [dispatch, page, showSearch, place])

  // useEffect(() => {
  //   socket.on('update sto', function () {
  //     if (socketCondition(showSearch, page)) {
  //       dispatch(getItemsFiltered(page, place))
  //     }
  //   })
  // }, [])
  //
  // useEffect(() => {
  //   socket.on('update edited sto', function () {
  //     if (socketCondition(showSearch, page)) {
  //       dispatch(getItemsFiltered(page, place))
  //     }
  //   })
  // }, [])
}

export default OnLoadPlace
