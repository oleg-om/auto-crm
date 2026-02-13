import { useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { socket } from '../../redux/sockets/socketReceivers'
import { getAutoparts } from '../../redux/reducers/autoparts'

const OnloadAutoparts = (num, showSearch, type) => {
  socket.connect()
  const dispatch = useDispatch()
  const checkNum = num >= 2

  useEffect(() => {
    if (type === 'autoparts' && !checkNum && showSearch === false) {
      dispatch(getAutoparts())
    } else if (type === 'autoparts' && (checkNum || showSearch === true)) {
      dispatch(getAutoparts())
    }
  }, [dispatch, checkNum, showSearch, type])

  // Мемоизируем обработчики сокетов
  const handleUpdateAutopart = useCallback(() => {
    if (!checkNum && !showSearch) {
      dispatch(getAutopartsLast())
    } else {
      dispatch(getAutoparts())
    }
  }, [dispatch, checkNum, showSearch])

  const handleUpdateEditedAutopart = useCallback(() => {
    if (!checkNum && !showSearch) {
      dispatch(getAutoparts())
    } else {
      dispatch(getAutoparts())
    }
  }, [dispatch, checkNum, showSearch])

  useEffect(() => {
    socket.on('update autopart', handleUpdateAutopart)
    socket.on('update edited autopart', handleUpdateEditedAutopart)

    // Cleanup функция для удаления слушателей
    return () => {
      socket.off('update autopart', handleUpdateAutopart)
      socket.off('update edited autopart', handleUpdateEditedAutopart)
    }
  }, [handleUpdateAutopart, handleUpdateEditedAutopart])
}

export default OnloadAutoparts
