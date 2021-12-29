import { GET_COMMONS, UPDATE_COMMON } from '../actions/commons'

const initialState = {
  num: 1,
  search: false,
  type: 'none'
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_COMMONS: {
      return { ...state, list: action.commons }
    }
    case UPDATE_COMMON: {
      return {
        ...state,
        ...action.common
      }
    }
    default:
      return state
  }
}

export function getCommons() {
  return (dispatch) => {
    dispatch({ type: GET_COMMONS })
  }
}

export function updateCommon(common) {
  return (dispatch) => {
    dispatch({ type: UPDATE_COMMON, common })
  }
}
export function updateAutopart(id, name) {
  return (dispatch) => {
    name
      .then((r) => r.json())
      .then(({ data: common }) => {
        dispatch({ type: UPDATE_COMMON, common })
      })
  }
}
