import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { socket } from '../../redux/sockets/socketReceivers'
import { getByMonth, setPreentryLoading } from '../../redux/reducers/shinomontazhs'
import { getStoByMonth, setPreentryStoLoading } from '../../redux/reducers/stos'

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
        dispatch(getByMonth(year, month, day, dt ? dt.toISOString() : null))
      }
      if (isSto || isOil) {
        dispatch(setPreentryStoLoading())
        dispatch(getStoByMonth(year, month, day, isOil))
      }
    }
  }, [dispatch, dt, preentryType])

  useEffect(() => {
    if (isShinomontazh) {
      socket.on('update shinomontazh', function () {
        dispatch(getByMonth(year, month, day, dt ? dt.toISOString() : null))
      })
    }
    if (isSto || isOil) {
      socket.on('update sto', function () {
        dispatch(getStoByMonth(year, month, day, isOil))
      })
    }
  }, [])

  useEffect(() => {
    if (isShinomontazh) {
      socket.on('update edited shinomontazh', function () {
        dispatch(getByMonth(year, month, day, dt ? dt.toISOString() : null))
      })
    }
    if (isSto || isOil) {
      socket.on('update edited sto', function () {
        dispatch(getStoByMonth(year, month, day, isOil))
      })
    }
  }, [])
}

export default OnLoad
