import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { socket } from '../../redux/sockets/socketReceivers'
import { getByMonth } from '../../redux/reducers/razvals'
import { getByMonthOil } from '../../redux/reducers/oils'

const LOCAL_STORAGE_RAZVAL_KEY = 'AT_CRM_RAZVAL_PREENTRY_DATE'
const LOCAL_STORAGE_OIL_KEY = 'AT_CRM_OIL_PREENTRY_DATE'

const OnLoad = (dt) => {
  const toDate = new Date(dt)
  const getMonth = toDate.getMonth()
  const year = dt.getFullYear()
  const month = `0${dt.getMonth() + 1}`.slice(-2)
  const yearmonth = `${year}-${month}`

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getByMonth(yearmonth))
  }, [dispatch, getMonth])

  useEffect(() => {
    dispatch(getByMonthOil(yearmonth))
  }, [dispatch, getMonth])

  const updateRazvalWithSocket = () => {
    const localDate = localStorage.getItem(LOCAL_STORAGE_RAZVAL_KEY)?.split('-')
    const localDateYear = localDate[0]
    const localDateMonth = localDate[1]

    if (localDateYear) {
      dispatch(getByMonth(`${localDateYear}-${localDateMonth}`))
    }
  }

  const updateOilWithSocket = () => {
    const localDate = localStorage.getItem(LOCAL_STORAGE_OIL_KEY)?.split('-')
    const localDateYear = localDate[0]
    const localDateMonth = localDate[1]

    if (localDateYear) {
      dispatch(getByMonthOil(`${localDateYear}-${localDateMonth}`))
    }
  }

  useEffect(() => {
    socket.on('update razval', updateRazvalWithSocket)
  }, [])

  useEffect(() => {
    socket.on('update edited razval', updateRazvalWithSocket)
  }, [])

  useEffect(() => {
    socket.on('update oil', updateOilWithSocket)
  }, [])

  useEffect(() => {
    socket.on('update edited oil', updateOilWithSocket)
  }, [])
}

export default OnLoad
