import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { getItemsFiltered } from '../../redux/reducers/diskpaintings'
import { getOrganizations } from '../../redux/reducers/organizations'
import useSaveFilter, { checkQueryParamsAre } from '../../hooks/saveFilterParams'

const OnLoadPlace = (page, showSearch, place) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getOrganizations())
  }, [dispatch])

  const filterObj = { page, place }
  const { queryParamsToApi } = useSaveFilter(filterObj)

  const { search } = useLocation()
  useEffect(() => {
    if (checkQueryParamsAre(showSearch, search) && place !== undefined && place !== null && place !== '') {
      dispatch(getItemsFiltered(queryParamsToApi))
    }
  }, [dispatch, page, showSearch, place, queryParamsToApi])
}

export default OnLoadPlace
