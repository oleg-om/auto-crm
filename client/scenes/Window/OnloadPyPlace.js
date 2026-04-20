import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
// import { socket } from '../../redux/sockets/socketReceivers'
import { getCondprices } from '../../redux/reducers/cond.prices'
import { getItemsFiltered as getWindowItemsFiltered } from '../../redux/reducers/windows'
import { getCondItemsFiltered } from '../../redux/reducers/conds'
import useSaveFilter, { checkQueryParamsAre } from '../../hooks/saveFilterParams'
import { getWindowprices } from '../../redux/reducers/window.prices'
// import { socketCondition } from '../../utils/utils'
// import { getSocketName } from './Onload'

const getFunc = (location) => {
  if (location.pathname.includes('window')) {
    return getWindowprices()
  }
  return getCondprices()
}

const getItemsFilteredThunk = (location) =>
  location.pathname.includes('window') ? getWindowItemsFiltered : getCondItemsFiltered

const OnLoadPlace = (page, showSearch, place) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const filterObj = { page, place }
  const { queryParamsToApi } = useSaveFilter(filterObj)

  useEffect(() => {
    dispatch(getFunc(location))
  }, [dispatch, location])

  const { search } = useLocation()
  useEffect(() => {
    if (checkQueryParamsAre(showSearch, search) && place !== undefined && place !== null && place !== '') {
      dispatch(getItemsFilteredThunk(location)(queryParamsToApi))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- same deps as Sto/OnloadPyPlace
  }, [dispatch, page, showSearch, place, location])

  // useEffect(() => {
  //   socket.on(`update ${getSocketName(location)}`, function () {
  //     if (socketCondition(showSearch, page)) {
  //       dispatch(getItemsFilteredFunc(page, place, location))
  //     }
  //   })
  // }, [])
  //
  // useEffect(() => {
  //   socket.on(`update edited ${getSocketName(location)}`, function () {
  //     if (socketCondition(showSearch, page)) {
  //       dispatch(getItemsFilteredFunc(page, place, location))
  //     }
  //   })
  // }, [])
}

export default OnLoadPlace
