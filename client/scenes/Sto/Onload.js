import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
// import { socket } from '../../redux/sockets/socketReceivers'
import { getItemsByPage } from '../../redux/reducers/stos'

import { checkQueryParamsAre } from '../../hooks/saveFilterParams'

const OnLoad = (page, showSearch) => {
  const dispatch = useDispatch()

  const { search } = useLocation()
  useEffect(() => {
    if (checkQueryParamsAre(showSearch, search)) {
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
