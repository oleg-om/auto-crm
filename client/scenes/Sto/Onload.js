import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
// import { socket } from '../../redux/sockets/socketReceivers'
import { getItemsByPage } from '../../redux/reducers/stos'

const OnLoad = (page, showSearch) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!showSearch) {
      dispatch(getItemsByPage(page))
    }
  }, [dispatch, page, showSearch])

  // useEffect(() => {
  //   socket.on('update sto', function () {
  //     dispatch(getItemsByPage(page))
  //   })
  // }, [])
  //
  // useEffect(() => {
  //   socket.on('update edited sto', function () {
  //     dispatch(getItemsByPage(page))
  //   })
  // }, [])
}

export default OnLoad
