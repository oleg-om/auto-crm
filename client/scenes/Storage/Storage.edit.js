import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
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

  const updateStorageLocal = (idOfItem, name) => {
    dispatch(updateStorage(idOfItem, name))
    socket.emit('edit storage')
  }
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
      <div className="container mx-auto px-4 mt-3">
        {loading
          ? list.map((it) => (
              <StoragesEdit key={id} {...it} updateStorage={updateStorageLocal} num={num} />
            ))
          : loadingComponent()}
      </div>
    </div>
  )
}

export default StorageEditFull
