import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { socket } from '../../redux/sockets/socketReceivers'
import DiskpaintingsEdit from '../../components/diskpaintings/diskpaintings.work.edit'
import Navbar from '../../components/Navbar'
import { updateDiskpainting } from '../../redux/reducers/diskpaintings'

const DiskpaintingEditFull = () => {
  socket.connect()
  const { id } = useParams()
  const { num } = useParams(1)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])

  useEffect(() => {
    fetch(`/api/v1/diskpainting/${id}`)
      .then((r) => r.json())
      .then(({ data: diskpainting }) => {
        setList([diskpainting])
        setLoading(true)
      })
  }, [id])

  toast.configure()

  const updateDiskpaintingLocal = (idOfItem, name) => {
    dispatch(updateDiskpainting(idOfItem, name))
    socket.emit('edit diskpainting')
  }

  const loadingComponent = () => {
    return (
      <div className="flex w-100 justify-center my-3">
        <button
          type="button"
          className="bg-main-500 p-3 text-white rounded flex items-center"
          disabled
        >
          <div className="flex justify-center items-center pr-3">
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
      <div className="container mx-auto px-4 mt-3" key={id}>
        {loading
          ? list.map((it) => (
              <DiskpaintingsEdit
                key={it.id_diskpaintings}
                {...it}
                updateDiskpainting={updateDiskpaintingLocal}
                num={num}
              />
            ))
          : loadingComponent()}
      </div>
    </div>
  )
}

export default DiskpaintingEditFull
