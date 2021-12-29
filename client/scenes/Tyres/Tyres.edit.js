import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { socket } from '../../redux/sockets/socketReceivers'
import TyresEdit from '../../components/tyres/tyres.order.edit'
import Navbar from '../../components/Navbar'
import { updateTyre } from '../../redux/reducers/tyres'

const TyreEditFull = () => {
  socket.connect()
  const { id } = useParams()
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
  const { num } = useParams(1)
  const updateTyreLocal = (idOfItem, name) => {
    dispatch(updateTyre(idOfItem, name))
    socket.emit('edit tyre')
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
          ? list.map((it) => <TyresEdit key={id} {...it} updateTyre={updateTyreLocal} num={num} />)
          : loadingComponent()}
      </div>
    </div>
  )
}

export default TyreEditFull
