import { GET_TYRES, GET_TYRE, CREATE_TYRE, UPDATE_TYRE_STATUS, UPDATE_TYRE } from '../actions/tyres'
import { socket } from '../sockets/socketReceivers'

socket.connect()

const initialState = {
  list: [],
  item: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_TYRES: {
      return {
        ...state,
        list: action.tyres,
        isLoaded: action.isLoaded,
        currentPage: action.currentPage,
        numberOfPages: action.numberOfPages
      }
    }
    case GET_TYRE: {
      return { ...state, item: [action.tyre], isLoaded: action.isLoaded }
    }
    case CREATE_TYRE: {
      return { ...state, list: [action.tyre, ...state.list] }
    }
    case UPDATE_TYRE: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.tyre.id_tyres === it.id_tyres ? action.tyre : it
        })
      }
    }
    case UPDATE_TYRE_STATUS: {
      return {
        ...state,
        list: state.list.map((it) => {
          return action.tyre.id === it.id ? action.tyre : it
        })
      }
    }

    default:
      return state
  }
}

export function getTyres() {
  return (dispatch) => {
    dispatch({ type: GET_TYRES, isLoaded: false })
    fetch('/api/v1/tyre')
      .then((r) => r.json())
      .then(({ data: tyres }) => {
        dispatch({ type: GET_TYRES, tyres })
      })
  }
}

export function getTyre(id) {
  return (dispatch) => {
    fetch(`/api/v1/tyre/${id}`)
      .then((r) => r.json())
      .then(({ data: tyre }) => {
        dispatch({ type: GET_TYRE, tyre })
      })
  }
}

export function getItemsByPage(page) {
  return (dispatch) => {
    dispatch({ type: GET_TYRES, isLoaded: false })
    fetch(`/api/v1/tyrebypage/${page}`)
      .then((r) => r.json())
      .then(({ data: tyres, currentPage, numberOfPages }) => {
        dispatch({ type: GET_TYRES, tyres, currentPage, numberOfPages, isLoaded: true })
      })
  }
}

export function getItemsFiltered(
  page,
  status,
  vin,
  place,
  phone,
  number,
  sizeone,
  sizetwo,
  sizethree
) {
  return (dispatch) => {
    dispatch({ type: GET_TYRES, isLoaded: false })
    fetch(
      `/api/v1/tyrefilter${page ? `?page=${page}` : ''}${status ? `&status=${status}` : ''}${
        vin ? `&vin=${vin}` : ''
      }${place ? `&place=${place}` : ''}${phone ? `&phone=${phone}` : ''}${
        number ? `&number=${number}` : ''
      }${sizeone ? `&sizeone=${sizeone}` : ''}${sizetwo ? `&sizetwo=${sizetwo}` : ''}${
        sizethree ? `&sizethree=${sizethree}` : ''
      }`
    )
      .then((r) => r.json())
      .then(({ data: tyres, currentPage, numberOfPages }) => {
        dispatch({ type: GET_TYRES, tyres, currentPage, numberOfPages, isLoaded: true })
      })
  }
}

export function createTyre(name) {
  return (dispatch) => {
    fetch('/api/v1/tyre', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: tyre }) => {
        // socket.emit('new tyre', { tyre })
        dispatch({ type: CREATE_TYRE, tyre })
      })
  }
}

export function updateStatus(id, status) {
  return (dispatch) => {
    fetch(`/api/v1/tyre/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status
      })
    })
      .then((r) => r.json())
      .then(({ data: tyre }) => {
        dispatch({ type: UPDATE_TYRE_STATUS, tyre })
      })
  }
}

export function updateTyre(id, name) {
  return (dispatch) => {
    fetch(`/api/v1/tyre/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    })
      .then((r) => r.json())
      .then(({ data: tyre }) => {
        dispatch({ type: UPDATE_TYRE, tyre })
      })
  }
}
