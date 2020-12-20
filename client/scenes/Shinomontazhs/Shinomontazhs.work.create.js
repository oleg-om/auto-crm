import React from 'react'
import { useDispatch } from 'react-redux'
import { socket } from '../../redux/sockets/socketReceivers'
import ShinomontazhsCreate from '../../components/shinomontazhs/shinomontazhs.work.create'
import { createShinomontazh } from '../../redux/reducers/shinomontazhs'
import Navbar from '../../components/Navbar'

const ShinomontazhsNew = () => {
  socket.connect()
  const dispatch = useDispatch()
  const create = (name) => {
    dispatch(createShinomontazh(name))
    socket.emit('new shinomontazh')
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 pt-3">
        <ShinomontazhsCreate create={create} />
      </div>
    </div>
  )
}

export default ShinomontazhsNew
