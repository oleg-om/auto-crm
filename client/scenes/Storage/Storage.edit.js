import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { socket } from '../../redux/sockets/socketReceivers'
import StoragesEdit from '../../components/storage/storage.order.edit'
import Navbar from '../../components/Navbar'
import { updateStorage } from '../../redux/reducers/storage'

const StorageEditFull = () => {
  socket.connect()
  const { id } = useParams()
  const { num } = useParams(1)
  const dispatch = useDispatch()
  const list = useSelector((s) => s.storages.list).filter(
    (it) => JSON.stringify(it.id_storages) === id
  )

  const updateStorageLocal = (idOfItem, name) => {
    dispatch(updateStorage(idOfItem, name))
    socket.emit('edit storage')
  }
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 mt-3">
        {list.map((it) => (
          <StoragesEdit key={id} {...it} updateStorage={updateStorageLocal} num={num} />
        ))}
      </div>
    </div>
  )
}

export default StorageEditFull
