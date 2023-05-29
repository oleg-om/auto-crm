import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
// import { socket } from '../../redux/sockets/socketReceivers'
import { getItemsByPage } from '../../redux/reducers/shinomontazhs'
// import { socketCondition } from '../../utils/utils'

const OnLoad = (page, showSearch) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!showSearch) {
      dispatch(getItemsByPage(page))
    }
  }, [dispatch, page, showSearch])

  // useEffect(() => {
  //   socket.on('update shinomontazh', function () {
  //     if (socketCondition(showSearch, page)) {
  //       dispatch(getItemsByPage(page))
  //     }
  //   })
  // }, [])
  //
  // useEffect(() => {
  //   socket.on('update edited shinomontazh', function () {
  //     if (socketCondition(showSearch, page)) {
  //       dispatch(getItemsByPage(page))
  //     }
  //   })
  // }, [])
}

export default OnLoad
