import { useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { socket } from '../../redux/sockets/socketReceivers'
import { getAutopartsByPage } from '../../redux/reducers/autoparts'
import { getVendors } from '../../redux/reducers/vendors'
import { socketCondition } from '../../utils/utils'

import { checkQueryParamsAre } from '../../hooks/saveFilterParams'

const OnLoad = (page, showSearch) => {
  const dispatch = useDispatch()

  const { search } = useLocation()
  useEffect(() => {
    if (checkQueryParamsAre(showSearch, search)) {
      dispatch(getAutopartsByPage(page))
    }
  }, [dispatch, page, showSearch, search])

  useEffect(() => {
    dispatch(getVendors())
  }, [dispatch])

  // Мемоизируем обработчик сокета
  const handleSocketUpdate = useCallback(() => {
    if (socketCondition(showSearch, page)) {
      dispatch(getAutopartsByPage(page))
    }
  }, [dispatch, page, showSearch])

  useEffect(() => {
    socket.on('update autopart', handleSocketUpdate)
    socket.on('update edited autopart', handleSocketUpdate)

    // Cleanup функция для удаления слушателей
    return () => {
      socket.off('update autopart', handleSocketUpdate)
      socket.off('update edited autopart', handleSocketUpdate)
    }
  }, [handleSocketUpdate])
}

export default OnLoad
