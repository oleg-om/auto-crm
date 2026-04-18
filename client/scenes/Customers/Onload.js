import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
// import { getTyres } from '../../redux/reducers/tyres'
import { getItemsByPage } from '../../redux/reducers/customers'
import { getOrganizations } from '../../redux/reducers/organizations'

import { checkQueryParamsAre } from '../../hooks/saveFilterParams'

const OnLoad = (page, showSearch) => {
  const dispatch = useDispatch()

  const { search } = useLocation()
  
  useEffect(() => {
    dispatch(getOrganizations())
  }, [dispatch])
  
  useEffect(() => {
    if (checkQueryParamsAre(showSearch, search)) {
      dispatch(getItemsByPage(page))
    }
  }, [dispatch, page, showSearch])
}

export default OnLoad
