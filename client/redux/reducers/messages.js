const initialState = {
  messages: '',
  receivedMess: []
}

export function addMessage(message) {
  return {
    type: 'ADD_MESSAGE',
    message
  }
}

export function receivedNewMessage(message) {
  return {
    type: 'RECEIVED_NEW_MESSAGE',
    message
  }
}

export default function messages(state = initialState, action) {
  switch (action.type) {
    case 'ADD_MESSAGE': {
      return { ...state, messages: action.message }
    }
    case 'RECEIVED_NEW_MESSAGE': {
      return { ...state, receivedMess: [...state.receivedMess, action.message] }
    }
    default:
      return state
  }
}
