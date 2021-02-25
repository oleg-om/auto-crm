import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { socket } from '../../redux/sockets/socketReceivers'
import ShinomontazhsCreate from '../../components/shinomontazhs/shinomontazhs.work.create'
import { createShinomontazh } from '../../redux/reducers/shinomontazhs'
import Navbar from '../../components/Navbar'
import UpdateModal from '../../components/shinomontazhs/updatecutomer.modal'
import { createCustomer, updateCustomer } from '../../redux/reducers/customers'

const ShinomontazhsNew = () => {
  socket.connect()
  const dispatch = useDispatch()
  const create = (name) => {
    dispatch(createShinomontazh(name))
    socket.emit('new shinomontazh')
  }

  const history = useHistory()
  const checkLink = () => history.location.pathname.split('/').includes('shinomontazhboss')
  toast.configure()
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
    if (checkLink()) {
      history.push('/shinomontazhboss/list')
    } else {
      history.push('/shinomontazh/list')
    }
    notify('Запись добавлена')
  }

  const disUpdateCust = () => {
    setModalIsOpen(false)
    create(order)
    if (checkLink()) {
      history.push('/shinomontazhboss/list')
    } else {
      history.push('/shinomontazh/list')
    }
    notify('Запись добавлена')
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
      <div className="lg:container w-full mx-auto px-4 pt-3">
        <ShinomontazhsCreate
          create={create}
          createCust={createCust}
          openAndUpdate={openAndUpdate}
          setModalIsOpen={setModalIsOpen}
          checkLink={checkLink()}
        />
      </div>
      <UpdateModal
        open={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        onSubmit={() => updateCust(activeCustomerId, activeCustomerName)}
        onDisSubmit={() => disUpdateCust()}
        activeCustomerName={activeCustomerName}
      />
    </div>
  )
}

export default ShinomontazhsNew
