import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { socket } from '../../redux/sockets/socketReceivers'
import StorageUpdate from '../../components/storage/storage.preorder.edit'
import Navbar from '../../components/Navbar'
import { getStorage, updateStorage } from '../../redux/reducers/storage'

const StorageEditSimple = () => {
  const { id } = useParams()
  const { num } = useParams(1)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getStorage(id))
  }, [dispatch, id])

  const list = useSelector((s) => s.storage.item)
  socket.connect()

  const employeeList = useSelector((s) => s.employees.list)
  const placesList = useSelector((s) => s.places.list)
  const updateStorageLocal = (idOfItem, name) => {
    dispatch(updateStorage(idOfItem, name))
    socket.emit('edit storage')
  }
  const settings = useSelector((s) => s.settings.list)
  return (
    <div>
      <Navbar />
      <div className="mx-auto container px-4 mt-3">
        {list.map((it) => (
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
        ))}
      </div>
    </div>
  )
}

export default StorageEditSimple
