import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import TyreViewOrder from '../../components/tyres/tyres.view'
import Navbar from '../../components/Navbar'
import { updateTyre } from '../../redux/reducers/tyres'
import onLoad from './Onload'

const TyreView = () => {
  onLoad()
  const { id } = useParams()
  const { num } = useParams(1)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  useEffect(() => {
    fetch(`/api/v1/tyre/${id}`)
      .then((r) => r.json())
      .then(({ data: tyre }) => {
        setList([tyre])
        setLoading(true)
      })
  }, [id])
  const employeeList = useSelector((s) => s.employees.list)
  const placesList = useSelector((s) => s.places.list)
  const updateTyreLocal = (idOfItem, name) => {
    dispatch(updateTyre(idOfItem, name))
  }
  const settings = useSelector((s) => s.settings.list)
  const loadingComponent = () => {
    return (
      <div className="flex w-100 justify-center my-3">
        <button
          type="button"
          className="bg-blue-500 p-3 text-white rounded flex items-center"
          disabled
        >
          <div className=" flex justify-center items-center pr-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-4 border-white" />
          </div>
          Загрузка...
        </button>
      </div>
    )
  }
  return (
    <div>
      <Navbar />
      <div className="mx-auto px-4 mt-3">
        {loading
          ? list.map((it) => (
              <TyreViewOrder
                key={id}
                {...it}
                updateTyre={updateTyreLocal}
                employeeList={employeeList.find((item) => item.id === it.employee)}
                processList={employeeList.find((item) => item.id === it.process)}
                placesList={placesList.find((item) => item.id === it.place)}
                settings={settings}
                num={num}
              />
            ))
          : loadingComponent()}
      </div>
    </div>
  )
}

export default TyreView
