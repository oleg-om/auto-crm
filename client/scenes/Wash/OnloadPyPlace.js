import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
// import { socket } from '../../redux/sockets/socketReceivers'
import { getItemsFiltered } from '../../redux/reducers/washs'
import { getWashprices } from '../../redux/reducers/wash.prices'
import useSaveFilter, { checkQueryParamsAre } from '../../hooks/saveFilterParams'

const OnLoadPlace = (page, showSearch, place) => {
  const dispatch = useDispatch()

  const filterObj = { page, place }
  const { queryParamsToApi } = useSaveFilter(filterObj)

  useEffect(() => {
    dispatch(getWashprices())
  }, [dispatch])

  const { search } = useLocation()
  useEffect(() => {
    if (checkQueryParamsAre(showSearch, search) && place) {
      dispatch(getItemsFiltered(queryParamsToApi))
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
