import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
// import { socket } from '../../redux/sockets/socketReceivers'
import { getItemsByPage } from '../../redux/reducers/shinomontazhs'

import { checkQueryParamsAre } from '../../hooks/saveFilterParams'
// import { socketCondition } from '../../utils/utils'

const OnLoad = (page, showSearch) => {
  const dispatch = useDispatch()

  const { search } = useLocation()
  useEffect(() => {
    if (checkQueryParamsAre(showSearch, search)) {
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
