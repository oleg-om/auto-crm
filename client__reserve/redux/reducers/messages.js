const initialState = {
  messages: '',
  currentRoom: 'general',
  receivedMess: []
}

export function addMessage(message) {
  return {
    type: 'ADD_MESSAGE',
    message
  }
}

export function updateCurrencyRoom(roomName) {
  return {
    type: 'UPDATE_CURRENCY_ROOM',
    roomName
  }
}

export function receivedNewMessage(message) {
  return {
    type: 'RECEIVED_NEW_MESSAGE',
    message
  }
}

export function deleteRecivedMessages() {
  return {
    type: 'DELETE_RECIVED_MESSAGES'
  }
}

export default function messages(state = initialState, action) {
  switch (action.type) {
    case 'ADD_MESSAGE': {
      return { ...state, messages: action.message }
    }
    case 'RECEIVED_NEW_MESSAGE': {
      return {
        ...state,
        receivedMess: [...state.receivedMess, ...action.message]
      }
    }
    case 'UPDATE_CURRENCY_ROOM': {
      return {
        ...state,
        currentRoom: action.roomName
      }
    }
    case 'DELETE_RECIVED_MESSAGES': {
      return {
        ...state,
        receivedMess: []
      }
    }
    default:
      return state
  }
}
