import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { socket } from '../../redux/sockets/socketReceivers'
import TyreUpdate from '../../components/tyres/tyres.preorder.edit'
import Navbar from '../../components/Navbar'
import { updateTyre, getTyre } from '../../redux/reducers/tyres'

const TyreEditSimple = () => {
  socket.connect()
  const { id } = useParams()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getTyre(id))
  }, [dispatch, id])
  const { num } = useParams(1)
  const list = useSelector((s) => s.tyres.item)
  const employeeList = useSelector((s) => s.employees.list)
  const placesList = useSelector((s) => s.places.list)
  const updateTyreLocal = (idOfItem, name) => {
    dispatch(updateTyre(idOfItem, name))
    socket.emit('edit tyre')
  }
  const settings = useSelector((s) => s.settings.list)
  return (
    <div>
      <Navbar />
      <div className="mx-auto px-4 mt-3">
        {list.map((it) => (
          <TyreUpdate
            key={id}
            {...it}
            updateTyre={updateTyreLocal}
            employeeList={employeeList.find((item) => item.id === it.employee)}
            processList={employeeList.find((item) => item.id === it.process)}
            placesList={placesList.find((item) => item.id === it.place)}
            settings={settings}
            num={num}
          />
        ))}
      </div>
    </div>
  )
}

export default TyreEditSimple
