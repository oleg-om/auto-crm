const initialState = {
  socketsInfo: []
}

export function updateSocketsInfo(socketsInfo) {
  return {
    type: 'UPDATE_SOCKETS_INFO',
    socketsInfo
  }
}

export default function socketInfoUsers(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_SOCKETS_INFO':
      return {
        ...state,
        socketsInfo: action.socketsInfo
      }
    default:
      return state
  }
}
