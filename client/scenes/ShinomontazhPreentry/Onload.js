import { useEffect, useRef, useCallback } from 'react'
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

  // Используем useRef для хранения актуальной даты
  const currentDateRef = useRef(dt)

  // Обновляем ref при изменении даты
  useEffect(() => {
    currentDateRef.current = dt
  }, [dt])

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
  }, [dispatch, dt, preentryType, year, month, day, isShinomontazh, isSto, isOil])

  const updateShinomontazhWithSocket = useCallback(() => {
    // Используем текущую выбранную дату вместо localStorage
    const currentDt = currentDateRef.current
    const currentYear = currentDt.getFullYear()
    const currentMonth = `0${currentDt.getMonth() + 1}`.slice(-2)
    const currentDay = currentDt.getDate()

    dispatch(getByMonth(currentYear, currentMonth, currentDay))
  }, [dispatch])

  const updateStoWithSocket = useCallback(() => {
    // Используем текущую выбранную дату вместо localStorage
    const currentDt = currentDateRef.current
    const currentYear = currentDt.getFullYear()
    const currentMonth = `0${currentDt.getMonth() + 1}`.slice(-2)
    const currentDay = currentDt.getDate()

    dispatch(getStoByMonth(currentYear, currentMonth, currentDay, isOil))
  }, [dispatch, isOil])

  useEffect(() => {
    if (isShinomontazh) {
      socket.on('update shinomontazh', updateShinomontazhWithSocket)
    }
    if (isSto || isOil) {
      socket.on('update sto', updateStoWithSocket)
    }

    return () => {
      if (isShinomontazh) {
        socket.off('update shinomontazh', updateShinomontazhWithSocket)
      }
      if (isSto || isOil) {
        socket.off('update sto', updateStoWithSocket)
      }
    }
  }, [isShinomontazh, isSto, isOil, updateShinomontazhWithSocket, updateStoWithSocket])

  useEffect(() => {
    if (isShinomontazh) {
      socket.on('update edited shinomontazh', updateShinomontazhWithSocket)
    }
    if (isSto || isOil) {
      socket.on('update edited sto', updateStoWithSocket)
    }

    return () => {
      if (isShinomontazh) {
        socket.off('update edited shinomontazh', updateShinomontazhWithSocket)
      }
      if (isSto || isOil) {
        socket.off('update edited sto', updateStoWithSocket)
      }
    }
  }, [isShinomontazh, isSto, isOil, updateShinomontazhWithSocket, updateStoWithSocket])
}

export default OnLoad
