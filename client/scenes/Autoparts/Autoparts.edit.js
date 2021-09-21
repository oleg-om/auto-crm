import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { socket } from '../../redux/sockets/socketReceivers'
import AutopartsEdit from '../../components/autoparts/autoparts.order.edit'
import Navbar from '../../components/Navbar'
import { updateAutopart, getAutopart } from '../../redux/reducers/autoparts'

const AutopartEditFull = () => {
  socket.connect()
  const { id } = useParams()
  const { num } = useParams(1)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getAutopart(id))
  }, [dispatch, id])
  const list = useSelector((s) => s.autoparts.item)

  const updateAutopartLocal = (idOfItem, name) => {
    dispatch(updateAutopart(idOfItem, name))
    socket.emit('edit autopart')
  }
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 mt-3">
        {list.map((it) => (
          <AutopartsEdit key={id} {...it} updateAutopart={updateAutopartLocal} num={num} />
        ))}
      </div>
    </div>
  )
}

export default AutopartEditFull
