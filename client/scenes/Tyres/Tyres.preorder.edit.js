import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { socket } from '../../redux/sockets/socketReceivers'
import TyreUpdate from '../../components/tyres/tyres.preorder.edit'
import Navbar from '../../components/Navbar'
import { updateTyre } from '../../redux/reducers/tyres'

const TyreEditSimple = () => {
  socket.connect()
  const { id } = useParams()
  const { num } = useParams(1)
  const dispatch = useDispatch()
  const list = useSelector((s) => s.tyres.list).filter((it) => JSON.stringify(it.id_tyres) === id)
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
