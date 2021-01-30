import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import TyreViewOrder from '../../components/tyres/tyres.view'
import Navbar from '../../components/Navbar'
import { updateTyre } from '../../redux/reducers/tyres'

const TyreView = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const list = useSelector((s) => s.tyres.list).filter((it) => JSON.stringify(it.id_tyres) === id)
  const employeeList = useSelector((s) => s.employees.list)
  const placesList = useSelector((s) => s.places.list)
  const updateTyreLocal = (idOfItem, name) => {
    dispatch(updateTyre(idOfItem, name))
  }
  const settings = useSelector((s) => s.settings.list)

  return (
    <div>
      <Navbar />
      <div className="mx-auto px-4 mt-3">
        {list.map((it) => (
          <TyreViewOrder
            key={id}
            {...it}
            updateTyre={updateTyreLocal}
            employeeList={employeeList.find((item) => item.id === it.employee)}
            processList={employeeList.find((item) => item.id === it.process)}
            placesList={placesList.find((item) => item.id === it.place)}
            settings={settings}
          />
        ))}
      </div>
    </div>
  )
}

export default TyreView
