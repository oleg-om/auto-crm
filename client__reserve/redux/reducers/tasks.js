import { GET_TASKS, CREATE_TASK, UPDATE_STATUS } from '../actions/tasks'

const initialState = {
  list: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_TASKS: {
      return { ...state, list: action.tasks }
    }
    case CREATE_TASK: {
      return { ...state, list: [...state.list, action.task] }
    }
    case UPDATE_STATUS: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.task.id === it.id ? action.task : it
        })
      }
    }

    default:
      return state
  }
}

export function getTasks() {
  return (dispatch) => {
    fetch('/api/v1/task')
      .then((r) => r.json())
      .then(({ data: tasks }) => {
        dispatch({ type: GET_TASKS, tasks })
      })
  }
}

export function getTask() {
  return (dispatch) => {
    fetch('/api/v1/task:uuid')
      .then((r) => r.json())
      .then(({ data: task }) => {
        dispatch({ type: GET_TASKS, task })
      })
  }
}

export function createTask(name) {
  return (dispatch) => {
    fetch('/api/v1/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: task }) => {
        dispatch({ type: CREATE_TASK, task })
      })
  }
}

export function updateStatus(id, status) {
  return (dispatch) => {
    fetch(`/api/v1/task/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status
      })
    })
      .then((r) => r.json())
      .then(({ data: task }) => {
        dispatch({ type: UPDATE_STATUS, task })
      })
  }
}
