import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import AutopartViewOrder from '../../components/autoparts/autoparts.view'
import Navbar from '../../components/Navbar'
import { updateAutopart, getAutopart } from '../../redux/reducers/autoparts'

const AutopartView = () => {
  const { id } = useParams()
  const { num } = useParams(1)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getAutopart(id))
  }, [dispatch, id])
  const list = useSelector((s) => s.autoparts.item)
  const employeeList = useSelector((s) => s.employees.list)
  const placesList = useSelector((s) => s.places.list)
  const updateAutopartLocal = (idOfItem, name) => {
    dispatch(updateAutopart(idOfItem, name))
  }
  const settings = useSelector((s) => s.settings.list)

  return (
    <div>
      <Navbar />
      <div className="mx-auto px-4 mt-3">
        {list
          ? list.map((it) => (
              <AutopartViewOrder
                key={id}
                {...it}
                updateAutopart={updateAutopartLocal}
                employeeList={employeeList.find((item) => item.id === it.employee)}
                processList={employeeList.find((item) => item.id === it.process)}
                placesList={placesList.find((item) => item.id === it.place)}
                settings={settings}
                num={num}
              />
            ))
          : null}
      </div>
    </div>
  )
}

export default AutopartView
