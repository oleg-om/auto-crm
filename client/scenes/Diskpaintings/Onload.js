import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { getItemsByPage } from '../../redux/reducers/diskpaintings'
import { getOrganizations } from '../../redux/reducers/organizations'
import { checkQueryParamsAre } from '../../hooks/saveFilterParams'

const OnLoad = (page, showSearch) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getOrganizations())
  }, [dispatch])

  const { search } = useLocation()
  useEffect(() => {
    if (checkQueryParamsAre(showSearch, search)) {
      dispatch(getItemsByPage(page))
    }
  }, [dispatch, page, showSearch])
}

export default OnLoad
