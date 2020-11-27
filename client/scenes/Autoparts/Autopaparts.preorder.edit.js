import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { socket } from '../../redux/sockets/socketReceivers'
import AutopartUpdate from '../../components/autoparts/autopaparts.preorder.edit'
import Navbar from '../../components/Navbar'
import { updateAutopart } from '../../redux/reducers/autoparts'

const AutopartEditSimple = () => {
  socket.connect()
  const { id } = useParams()
  const dispatch = useDispatch()
  const list = useSelector((s) => s.autoparts.list).filter(
    (it) => JSON.stringify(it.id_autoparts) === id
  )
  const updateAutopartLocal = (idOfItem, name) => {
    dispatch(updateAutopart(idOfItem, name))
    socket.emit('new autopart')
  }
  return (
    <div>
      <Navbar />
      <div className="mx-auto px-4 mt-3">
        {list.map((it) => (
          <AutopartUpdate key={id} {...it} updateAutopart={updateAutopartLocal} />
        ))}
      </div>
    </div>
  )
}

export default AutopartEditSimple
