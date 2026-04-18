import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
// import { socket } from '../../redux/sockets/socketReceivers'
import { getItemsFiltered } from '../../redux/reducers/shinomontazhs'
import { getOrganizations } from '../../redux/reducers/organizations'
import useSaveFilter, { checkQueryParamsAre } from '../../hooks/saveFilterParams'

// import { socketCondition } from '../../utils/utils'

const OnLoadPlace = (page, showSearch, place) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getOrganizations())
  }, [dispatch])

  const filterObj = { page, place }
  const { queryParamsToApi } = useSaveFilter(filterObj)

  const { search } = useLocation()
  useEffect(() => {
    if (checkQueryParamsAre(showSearch, search) && place) {
      dispatch(getItemsFiltered(queryParamsToApi))
    }
  }, [dispatch, page, showSearch, place])

  // useEffect(() => {
  //   socket.on('update shinomontazh', function () {
  //     if (socketCondition(showSearch, page)) {
  //       dispatch(getItemsFiltered(page, place))
  //     }
  //   })
  // }, [])
  //
  // useEffect(() => {
  //   socket.on('update edited shinomontazh', function () {
  //     if (socketCondition(showSearch, page)) {
  //       dispatch(getItemsFiltered(page, place))
  //     }
  //   })
  // }, [])
}

export default OnLoadPlace
