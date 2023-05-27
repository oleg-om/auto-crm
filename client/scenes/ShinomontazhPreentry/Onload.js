import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { socket } from '../../redux/sockets/socketReceivers'
import { getByMonth, setPreentryLoading } from '../../redux/reducers/shinomontazhs'

const OnLoad = (dt) => {
  const year = dt.getFullYear()
  const month = `0${dt.getMonth() + 1}`.slice(-2)
  // const yearmonth = `${year}-${month}`
  const day = dt.getDate()

  const dispatch = useDispatch()
  const preentryDate = useSelector((s) => s.shinomontazhs.preentryDate)

  useEffect(() => {
    if (preentryDate !== `${year}-${month}-${day}`) {
      dispatch(setPreentryLoading())
      dispatch(getByMonth(year, month, day, dt ? dt.toISOString() : null))
    }
  }, [dispatch, dt])

  // useEffect(() => {
  //   dispatch(getByMonthOil(yearmonth))
  // }, [dispatch, getMonth])

  useEffect(() => {
    socket.on('update shinomontazh', function () {
      dispatch(getByMonth(year, month, day, dt ? dt.toISOString() : null))
    })
  }, [])

  useEffect(() => {
    socket.on('update edited shinomontazh', function () {
      dispatch(getByMonth(year, month, day, dt ? dt.toISOString() : null))
    })
  }, [])

  // useEffect(() => {
  //   socket.on('update oil', function () {
  //     dispatch(getByMonthOil(yearmonth))
  //   })
  // }, [])

  // useEffect(() => {
  //   socket.on('update edited oil', function () {
  //     dispatch(getByMonthOil(yearmonth))
  //   })
  // }, [])
}

export default OnLoad
