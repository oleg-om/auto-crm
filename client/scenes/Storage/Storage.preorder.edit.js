import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { socket } from '../../redux/sockets/socketReceivers'
import StorageUpdate from '../../components/storage/storage.preorder.edit'
import Navbar from '../../components/Navbar'
import { updateStorage } from '../../redux/reducers/storage'

const StorageEditSimple = () => {
  const { id } = useParams()
  const { num } = useParams(1)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  useEffect(() => {
    fetch(`/api/v1/storage/${id}`)
      .then((r) => r.json())
      .then(({ data: storage }) => {
        setList([storage])
        setLoading(true)
      })
  }, [id])
  socket.connect()

  const employeeList = useSelector((s) => s.employees.list)
  const placesList = useSelector((s) => s.places.list)
  const updateStorageLocal = (idOfItem, name) => {
    dispatch(updateStorage(idOfItem, name))
    socket.emit('edit storage')
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
      <div className="mx-auto container px-4 mt-3">
        {loading
          ? list.map((it) => (
              <StorageUpdate
                key={id}
                {...it}
                updateStorage={updateStorageLocal}
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

export default StorageEditSimple
