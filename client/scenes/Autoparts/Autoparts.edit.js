import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { socket } from '../../redux/sockets/socketReceivers'
import AutopartsEdit from '../../components/autoparts/autoparts.order.edit'
import Navbar from '../../components/Navbar'
import { updateAutopart } from '../../redux/reducers/autoparts'

const AutopartEditFull = () => {
  socket.connect()
  const { id } = useParams()
  const { num } = useParams(1)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  useEffect(() => {
    fetch(`/api/v1/autopart/${id}`)
      .then((r) => r.json())
      .then(({ data: autopart }) => {
        setList([autopart])
        setLoading(true)
      })
  }, [id])

  const updateAutopartLocal = (idOfItem, name) => {
    dispatch(updateAutopart(idOfItem, name))
    socket.emit('edit autopart')
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
              <AutopartsEdit key={id} {...it} updateAutopart={updateAutopartLocal} num={num} />
            ))
          : loadingComponent()}
      </div>
    </div>
  )
}

export default AutopartEditFull
