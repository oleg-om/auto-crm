import {
  GET_EMPLOYEES,
  GET_EMPLOYEES_ALL,
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
  // Full roster including inactive employees - populated only for the
  // Employees admin page (see getAllEmployees below); `list` stays
  // active-only since ~60 other pages across the app read it directly for
  // employee pickers and must never see inactive employees.
  allList: [],
  report: [],
  employee: null,
  data: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_EMPLOYEES: {
      return { ...state, list: action.employees }
    }
    case GET_EMPLOYEES_ALL: {
      return { ...state, allList: action.employees }
    }
    case CREATE_EMPLOYEE: {
      return {
        ...state,
        list: action.employee.active === false ? state.list : [...state.list, action.employee],
        allList: [...state.allList, action.employee]
      }
    }
    case UPDATE_EMPLOYEE: {
      const isActive = action.employee.active !== false
      const existsInList = state.list.some((it) => it.id === action.employee.id)
      let nextList = state.list
      if (isActive) {
        nextList = existsInList
          ? state.list.map((it) => (it.id === action.employee.id ? action.employee : it))
          : [...state.list, action.employee]
      } else if (existsInList) {
        nextList = state.list.filter((it) => it.id !== action.employee.id)
      }
      return {
        ...state,
        list: nextList,
        allList: state.allList.map((it) => (it.id === action.employee.id ? action.employee : it))
      }
    }
    case DELETE_EMPLOYEE: {
      return {
        ...state,
        list: state.list.filter((it) => {
          return action.id !== it.id
        }),
        allList: state.allList.filter((it) => {
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

// Used only by the Employees admin page, which needs to see inactive
// employees too (to be able to review and reactivate them).
export function getAllEmployees() {
  return (dispatch) => {
    fetch('/api/v1/employee?includeInactive=true')
      .then((r) => r.json())
      .then(({ data: employees }) => {
        dispatch({ type: GET_EMPLOYEES_ALL, employees })
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
