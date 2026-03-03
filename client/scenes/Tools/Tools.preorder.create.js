import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { socket } from '../../redux/sockets/socketReceivers'
import ToolsCreate from '../../components/tools/tools.preorder.create'
import { createTool } from '../../redux/reducers/tools'
import { createCustomer, updateCustomer } from '../../redux/reducers/customers'
import Navbar from '../../components/Navbar'
import UpdateModal from '../../components/tools/updatecutomer.modal'

const ToolsNew = () => {
  socket.connect()
  const dispatch = useDispatch()
  const create = (name) => {
    dispatch(createTool(name))
    socket.emit('new tool')
  }
  const { num } = useParams(1)
  const history = useHistory()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [activeCustomerId, setActiveCustomerId] = useState('')
  const [activeCustomerName, setActiveCustomerName] = useState({})
  const [order, setOrder] = useState({})

  const createCust = (name) => {
    dispatch(createCustomer(name))
  }

  const updateCust = (idOfItem, name) => {
    dispatch(updateCustomer(idOfItem, name))
    setModalIsOpen(false)
    notify('Данные клиента изменены')
    create(order)
    history.push(`/tools/order/list`)
    notify('Заказ добавлен')
  }

  const disUpdateCust = () => {
    setModalIsOpen(false)
    create(order)
    history.push(`/tools/order/list`)
    notify('Заказ добавлен')
  }

  const openAndUpdate = (idOfItem, name, state) => {
    setModalIsOpen(true)
    setActiveCustomerId(idOfItem)
    setActiveCustomerName(name)
    setOrder(state)
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 pt-3">
        <ToolsCreate
          create={create}
          createCust={createCust}
          openAndUpdate={openAndUpdate}
          setModalIsOpen={setModalIsOpen}
          num={num}
        />
      </div>
      <UpdateModal
        open={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        onSubmit={() => updateCust(activeCustomerId, activeCustomerName)}
        onDisSubmit={() => disUpdateCust()}
        activeCustomerName={activeCustomerName}
        num={num}
      />
    </div>
  )
}

export default ToolsNew
