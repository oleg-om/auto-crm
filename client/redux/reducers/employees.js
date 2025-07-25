import {
  GET_EMPLOYEES,
  CREATE_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE,
  UPDATE_EMPLOYEE_REPORT,
  UPDATE_CURRENT_EMPLOYEE_REPORT
} from '../actions/employees'
import {
  CREATE_EMPLOYEE_DATA,
  DELETE_EMPLOYEE_DATA,
  GET_EMPLOYEES_DATA,
  UPDATE_EMPLOYEE_DATA
} from '../actions/employeesReport'

const initialState = {
  list: [],
  report: [],
  employee: null,
  data: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_EMPLOYEES: {
      return { ...state, list: action.employees }
    }
    case CREATE_EMPLOYEE: {
      return { ...state, list: [...state.list, action.employee] }
    }
    case UPDATE_EMPLOYEE: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.employee.id === it.id ? action.employee : it
        })
      }
    }
    case DELETE_EMPLOYEE: {
      return {
        list: state.list.filter((it) => {
          return action.id !== it.id
        })
      }
    }
    case UPDATE_EMPLOYEE_REPORT: {
      return { ...state, report: action.report }
    }
    case UPDATE_CURRENT_EMPLOYEE_REPORT: {
      return { ...state, employee: action.employee }
    }
    case GET_EMPLOYEES_DATA: {
      return { ...state, data: action.employees }
    }
    case UPDATE_EMPLOYEE_DATA: {
      return {
        ...state,
        data: state.data.map((it) => {
          return action?.employeeId === it.id ? action.employee : it
        })
      }
    }
    default:
      return state
  }
}

export function getEmployees() {
  return (dispatch) => {
    fetch('/api/v1/employee')
      .then((r) => r.json())
      .then(({ data: employees }) => {
        dispatch({ type: GET_EMPLOYEES, employees })
      })
  }
}

export function createEmployee(name) {
  return (dispatch) => {
    fetch('/api/v1/employee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: employee }) => {
        dispatch({ type: CREATE_EMPLOYEE, employee })
      })
  }
}

export function updateEmployee(id, name) {
  return (dispatch) => {
    fetch(`/api/v1/employee/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: employee }) => {
        dispatch({ type: UPDATE_EMPLOYEE, employee })
      })
  }
}

export function deleteEmployee(id) {
  return (dispatch) => {
    fetch(`/api/v1/employee/${id}`, {
      method: 'DELETE'
    })
      .then((r) => r.json())
      .then(() => {
        dispatch({ type: DELETE_EMPLOYEE, id })
      })
  }
}

export function updateEmployeeReport(data) {
  return (dispatch) => {
    dispatch({ type: UPDATE_EMPLOYEE_REPORT, report: data })
  }
}

export function updateCurrentEmployeeReport(data) {
  return (dispatch) => {
    dispatch({ type: UPDATE_CURRENT_EMPLOYEE_REPORT, employee: data })
  }
}

export function getEmployeesData(yearmonth) {
  return (dispatch) => {
    fetch(`/api/v1/employeereportmonth?yearmonth=${yearmonth}`)
      .then((r) => r.json())
      .then(({ data: employees }) => {
        dispatch({ type: GET_EMPLOYEES_DATA, employees })
      })
  }
}

export function createEmployeeData(name) {
  return (dispatch) => {
    fetch('/api/v1/employeereport', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: employee }) => {
        dispatch({ type: CREATE_EMPLOYEE_DATA, employee })
      })
  }
}

export function updateEmployeeData(id, name) {
  return (dispatch) => {
    fetch(`/api/v1/employeereport/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: employee }) => {
        dispatch({ type: UPDATE_EMPLOYEE_DATA, employee })
      })
  }
}

export function deleteEmployeeData(id) {
  return (dispatch) => {
    fetch(`/api/v1/employeereport/${id}`, {
      method: 'DELETE'
    })
      .then((r) => r.json())
      .then(() => {
        dispatch({ type: DELETE_EMPLOYEE_DATA, id })
      })
  }
}
