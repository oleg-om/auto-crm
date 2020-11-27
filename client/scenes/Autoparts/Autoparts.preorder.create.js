import React from 'react'
import { useDispatch } from 'react-redux'
import { socket } from '../../redux/sockets/socketReceivers'
import AutopartsCreate from '../../components/autoparts/autoparts.preorder.create'
import { createAutopart } from '../../redux/reducers/autoparts'
import { createCustomer } from '../../redux/reducers/customers'
import Navbar from '../../components/Navbar'

const AutopartsNew = () => {
  socket.connect()
  const dispatch = useDispatch()
  const create = (name) => {
    dispatch(createAutopart(name))
    socket.emit('new autopart')
  }
  const createCust = (name) => {
    dispatch(createCustomer(name))
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 pt-3">
        <AutopartsCreate create={create} createCust={createCust} />
      </div>
    </div>
  )
}

export default AutopartsNew
