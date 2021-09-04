import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import StorageViewOrder from '../../components/storage/storage.view'
import Navbar from '../../components/Navbar'
import { updateStorage } from '../../redux/reducers/storage'

const StorageView = () => {
  const { id } = useParams()
  const { num } = useParams(1)
  const dispatch = useDispatch()
  const list = useSelector((s) => s.storages.list).filter(
    (it) => JSON.stringify(it.id_storages) === id
  )
  const employeeList = useSelector((s) => s.employees.list)
  const placesList = useSelector((s) => s.places.list)
  const updateStorageLocal = (idOfItem, name) => {
    dispatch(updateStorage(idOfItem, name))
  }
  const settings = useSelector((s) => s.settings.list)

  return (
    <div>
      <Navbar />
      <div className="mx-auto px-4 mt-3">
        {list.map((it) => (
          <StorageViewOrder
            key={id}
            {...it}
            updateStorage={updateStorageLocal}
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

export default StorageView
