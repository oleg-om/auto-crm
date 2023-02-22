import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { socket } from '../../redux/sockets/socketReceivers'
import { getByMonth } from '../../redux/reducers/shinomontazhs'
// import { getByMonthOil } from '../../redux/reducers/oils'

const OnLoad = (dt) => {
  console.log('dt: ', dt)
  // const toDate = new Date(dt)
  // const getMonth = toDate.getMonth()
  const year = dt.getFullYear()
  const month = `0${dt.getMonth() + 1}`.slice(-2)
  const yearmonth = `${year}-${month}`
  const day = dt.getDate()
  console.log('day: ', day)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getByMonth(year, month, day, dt.toISOString()))
  }, [dispatch, dt])

  // useEffect(() => {
  //   dispatch(getByMonthOil(yearmonth))
  // }, [dispatch, getMonth])

  useEffect(() => {
    socket.on('update razval', function () {
      dispatch(getByMonth(yearmonth))
    })
  }, [])

  useEffect(() => {
    socket.on('update edited razval', function () {
      dispatch(getByMonth(yearmonth))
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
