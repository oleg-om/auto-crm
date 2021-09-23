import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { socket } from '../../redux/sockets/socketReceivers'
import TyresEdit from '../../components/tyres/tyres.order.edit'
import Navbar from '../../components/Navbar'
import { updateTyre, getTyre } from '../../redux/reducers/tyres'

const TyreEditFull = () => {
  socket.connect()
  const { id } = useParams()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getTyre(id))
  }, [dispatch, id])
  const { num } = useParams(1)
  const list = useSelector((s) => s.tyres.item)
  const updateTyreLocal = (idOfItem, name) => {
    dispatch(updateTyre(idOfItem, name))
    socket.emit('edit tyre')
  }
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 mt-3">
        {list.map((it) => (
          <TyresEdit key={id} {...it} updateTyre={updateTyreLocal} num={num} />
        ))}
      </div>
    </div>
  )
}

export default TyreEditFull
