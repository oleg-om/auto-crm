import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { socket } from '../../redux/sockets/socketReceivers'
import TyresEdit from '../../components/tyres/tyres.order.edit'
import Navbar from '../../components/Navbar'
import { updateTyre } from '../../redux/reducers/tyres'

const TyreEditFull = () => {
  socket.connect()
  const { id } = useParams()
  const { num } = useParams(1)
  const dispatch = useDispatch()
  const list = useSelector((s) => s.tyres.list).filter((it) => JSON.stringify(it.id_tyres) === id)

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
