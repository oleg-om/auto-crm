import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { socket } from '../../redux/sockets/socketReceivers'
import { getByMonth, setPreentryLoading } from '../../redux/reducers/shinomontazhs'
import { getStoByMonth, setPreentryStoLoading } from '../../redux/reducers/stos'

const LOCAL_STORAGE_SHINOMONTAZH_KEY = 'AT_CRM_SHINOMONTAZH_PREENTRY_DATE'
const LOCAL_STORAGE_STO_KEY = 'AT_CRM_STO_PREENTRY_DATE'

const OnLoad = (dt, preentryType) => {
  const year = dt.getFullYear()
  const month = `0${dt.getMonth() + 1}`.slice(-2)

  const day = dt.getDate()

  const dispatch = useDispatch()

  const shinomontazhDate = useSelector((s) => s.shinomontazhs.preentryDate)
  const stoDate = useSelector((s) => s.stos.preentryDate)

  const isShinomontazh = preentryType === 'shinomontazh'
  const isSto = preentryType === 'sto'
  const isOil = preentryType === 'oil'

  const preentryDate = () => {
    if (isShinomontazh) {
      return shinomontazhDate
    }
    if (isSto || isOil) {
      return stoDate
    }
    return null
  }

  useEffect(() => {
    if (preentryDate() !== `${year}-${month}-${day}`) {
      if (isShinomontazh) {
        dispatch(setPreentryLoading())
        dispatch(getByMonth(year, month, day))
        localStorage.setItem(LOCAL_STORAGE_SHINOMONTAZH_KEY, `${year}-${month}-${day}`)
      }
      if (isSto || isOil) {
        dispatch(setPreentryStoLoading())
        dispatch(getStoByMonth(year, month, day, isOil))
        localStorage.setItem(LOCAL_STORAGE_STO_KEY, `${year}-${month}-${day}`)
      }
    }
  }, [dispatch, dt, preentryType])

  const updateShinomontazhWithSocket = () => {
    const localDate = localStorage.getItem(LOCAL_STORAGE_SHINOMONTAZH_KEY)?.split('-')
    const localDateYear = localDate[0]
    const localDateMonth = localDate[1]
    const localDateDay = localDate[2]

    if (localDateYear) {
      dispatch(getByMonth(localDateYear, localDateMonth, localDateDay))
    }
  }

  const updateStoWithSocket = () => {
    const localDate = localStorage.getItem(LOCAL_STORAGE_STO_KEY)?.split('-')
    const localDateYear = localDate[0]
    const localDateMonth = localDate[1]
    const localDateDay = localDate[2]

    if (localDateYear) {
      dispatch(getStoByMonth(localDateYear, localDateMonth, localDateDay, isOil))
    }
  }

  useEffect(() => {
    if (isShinomontazh) {
      socket.on('update shinomontazh', updateShinomontazhWithSocket)
    }
    if (isSto || isOil) {
      socket.on('update sto', updateStoWithSocket)
    }
  }, [])

  useEffect(() => {
    if (isShinomontazh) {
      socket.on('update edited shinomontazh', updateShinomontazhWithSocket)
    }
    if (isSto || isOil) {
      socket.on('update edited sto', updateStoWithSocket)
    }
  }, [])
}

export default OnLoad
