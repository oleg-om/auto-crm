import { GET_TOOLS, GET_TOOL, CREATE_TOOL, UPDATE_TOOL_STATUS, UPDATE_TOOL } from '../actions/tools'
import { socket } from '../sockets/socketReceivers'

socket.connect()

const initialState = {
  list: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_TOOLS: {
      return {
        ...state,
        list: action.tools,
        isLoaded: action.isLoaded,
        currentPage: action.currentPage,
        numberOfPages: action.numberOfPages
      }
    }
    case GET_TOOL: {
      return { ...state, item: [action.tool], isLoaded: action.isLoaded }
    }

    case CREATE_TOOL: {
      return { ...state, list: [action.tool, ...state.list] }
    }
    case UPDATE_TOOL: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.tool.id_tools === it.id_tools ? action.tool : it
        })
      }
    }
    case UPDATE_TOOL_STATUS: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.tool.id === it.id ? action.tool : it
        })
      }
    }

    default:
      return state
  }
}

export function getTools() {
  return (dispatch) => {
    dispatch({ type: GET_TOOLS, isLoaded: false })
    fetch('/api/v1/tool')
      .then((r) => r.json())
      .then(({ data: tools }) => {
        dispatch({ type: GET_TOOLS, tools, isLoaded: true })
      })
  }
}

export function getToolsByPage(page) {
  return (dispatch) => {
    dispatch({ type: GET_TOOLS, isLoaded: false })
    fetch(`/api/v1/toolsbypage/${page}`)
      .then((r) => r.json())
      .then(({ data: tools, currentPage, numberOfPages }) => {
        dispatch({ type: GET_TOOLS, tools, currentPage, numberOfPages, isLoaded: true })
      })
  }
}

export function getToolsFiltered(page, status, process, place, phone, number, reg) {
  return (dispatch) => {
    dispatch({ type: GET_TOOLS, isLoaded: false })
    fetch(
      `/api/v1/toolsfilter${page ? `?page=${page}` : ''}${status ? `&status=${status}` : ''}${
        process ? `&process=${process}` : ''
      }${place ? `&place=${place}` : ''}${phone ? `&phone=${phone}` : ''}${
        number ? `&number=${number}` : ''
      }${reg ? `&reg=${reg}` : ''}`
    )
      .then((r) => r.json())
      .then(({ data: tools, currentPage, numberOfPages }) => {
        dispatch({ type: GET_TOOLS, tools, currentPage, numberOfPages, isLoaded: true })
      })
  }
}

export function getTool(id) {
  return (dispatch) => {
    fetch(`/api/v1/tool/${id}`)
      .then((r) => r.json())
      .then(({ data: tool }) => {
        dispatch({ type: GET_TOOL, tool })
      })
  }
}

export function createTool(name) {
  return (dispatch) => {
    fetch('/api/v1/tool', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: tool }) => {
        socket.emit('new tool', { tool })
        dispatch({ type: CREATE_TOOL, tool })
      })
  }
}

export function updateStatus(id, status) {
  return (dispatch) => {
    fetch(`/api/v1/tool/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status
      })
    })
      .then((r) => r.json())
      .then(({ data: tool }) => {
        dispatch({ type: UPDATE_TOOL_STATUS, tool })
      })
  }
}

export function updateTool(id, name) {
  return (dispatch) => {
    fetch(`/api/v1/tool/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: tool }) => {
        dispatch({ type: UPDATE_TOOL, tool })
      })
  }
}
