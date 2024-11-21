import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import ToolViewOrder from '../../components/tools/tools.view'
import Navbar from '../../components/Navbar'
import { updateTool } from '../../redux/reducers/tools'
import { getVendors } from '../../redux/reducers/vendors'

const ToolView = () => {
  const { id } = useParams()
  const { num } = useParams(1)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  useEffect(() => {
    fetch(`/api/v1/tool/${id}`)
      .then((r) => r.json())
      .then(({ data: tool }) => {
        setList([tool])
        setLoading(true)
      })
    dispatch(getVendors())
  }, [id])
  const employeeList = useSelector((s) => s.employees.list)
  const placesList = useSelector((s) => s.places.list)
  const updateToolLocal = (idOfItem, name) => {
    dispatch(updateTool(idOfItem, name))
  }
  const settings = useSelector((s) => s.settings.list)

  const loadingComponent = () => {
    return (
      <div className="flex w-100 justify-center my-3">
        <button
          type="button"
          className="bg-main-500 p-3 text-white rounded flex items-center"
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
              <ToolViewOrder
                key={id}
                {...it}
                updateTool={updateToolLocal}
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

export default ToolView
