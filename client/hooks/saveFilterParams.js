import { useHistory, useLocation } from 'react-router-dom'

function useSaveFilter(filterParams) {
  const { search } = useLocation()
  const history = useHistory()

  const filter = { ...filterParams }
  // remove null filter values
  if (filter) {
    Object.keys(filter).forEach((key) => {
      if (!filter[key]) {
        delete filter[key]
      }
    })
  }
  // init query url
  const queryParams = new URLSearchParams(filter).toString()
  const navigateWithQueryParams = (path) => {
    console.log('navigate', path, queryParams)
    history.push({
      pathname: path,
      search: `?${queryParams}`, // query string
      state: {
        // location state
        update: true
      }
    })
  }

  const getQueryParams = () => {
    return new URLSearchParams(search)
  }

  const currentQueryParams = getQueryParams().toString()

  const queryStringToObject = (url) => {
    return Object.fromEntries(new URLSearchParams(url))
  }

  const getQueryParamsToApi = () => {
    const filterToApi = { ...filter }

    if (filterToApi.regnumber) {
      filterToApi.reg = filterToApi.regnumber
      delete filterToApi.regnumber
    }

    if (filterToApi.phone) {
      filterToApi.phone = filterToApi.phone.slice(-9)
    }

    return `?${new URLSearchParams(filterToApi).toString()}`
  }

  const queryParamsToApi = getQueryParamsToApi()

  return {
    navigateWithQueryParams,
    getQueryParams,
    currentQueryParams,
    queryParamsToApi,
    queryStringToObject
  }
}

export default useSaveFilter
