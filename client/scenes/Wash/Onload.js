import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { socket } from '../../redux/sockets/socketReceivers'
import { getItemsByPage } from '../../redux/reducers/washs'
import { getWashprices } from '../../redux/reducers/wash.prices'

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
    if (page)
      socket.on('update wash', function () {
        dispatch(getItemsByPage(page))
      })
  }, [])

  useEffect(() => {
    if (page)
      socket.on('update edited wash', function () {
        dispatch(getItemsByPage(page))
      })
  }, [])
}

export default OnLoad
