import { useHistory, useLocation } from 'react-router-dom'

function useSaveFilter(filterParams = {}) {
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
  const navigateWithQueryParams = (path, myQueryString) => {
    const searchObject =
      myQueryString || queryParams
        ? {
            search: myQueryString || `?${queryParams}` // query string
          }
        : {}

    history.push({
      pathname: path,
      ...searchObject
      // state: {
      //   // location state
      //   update: true
      // }
    })
  }

  const getQueryParams = () => {
    return new URLSearchParams(search)
  }

  const currentQueryParams = getQueryParams().toString()
  const searchParamsToUrl = getQueryParams().toString() ? `?${getQueryParams().toString()}` : ''
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
      // The masked input pads untyped digits with "_" (e.g. "+7 (978) 4__-__-__")
      // - strip those (but keep the dashes, which are part of the stored
      // format) so a still-partial phone searches by whatever was actually
      // typed instead of sending literal underscores that can never match a
      // real stored number.
      filterToApi.phone = filterToApi.phone.slice(-9).replace(/_/g, '')
    }

    return `?${new URLSearchParams(filterToApi).toString()}`
  }

  const queryParamsToApi = getQueryParamsToApi()

  return {
    navigateWithQueryParams,
    getQueryParams,
    currentQueryParams,
    queryParamsToApi,
    queryStringToObject,
    searchParamsToUrl
  }
}

export default useSaveFilter

export const checkQueryParamsAre = (showSearch, search) => {
  return !showSearch && !search
}
