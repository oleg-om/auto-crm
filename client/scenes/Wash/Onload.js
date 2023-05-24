import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { socket } from '../../redux/sockets/socketReceivers'
import { getItemsByPage } from '../../redux/reducers/washs'
import { getWashprices } from '../../redux/reducers/wash.prices'
import { socketCondition } from '../../utils/utils'

const OnLoad = (page, showSearch) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getWashprices())
  }, [dispatch])

  useEffect(() => {
    if (!showSearch && page) {
      dispatch(getItemsByPage(page))
    }
  }, [dispatch, page, showSearch])

  useEffect(() => {
    socket.on('update wash', function () {
      if (socketCondition(showSearch, page)) {
        dispatch(getItemsByPage(page))
      }
    })
  }, [])

  useEffect(() => {
    socket.on('update edited wash', function () {
      if (socketCondition(showSearch, page)) {
        dispatch(getItemsByPage(page))
      }
    })
  }, [])
}

export default OnLoad
