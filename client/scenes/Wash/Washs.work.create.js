import React, { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { socket } from '../../redux/sockets/socketReceivers'
import ShinomontazhsCreate from '../../components/washs/washs.work.create'
import { createWash } from '../../redux/reducers/washs'
import Navbar from '../../components/Navbar'
import UpdateModal from '../../components/washs/updatecutomer.modal'
import { createCustomer, updateCustomer } from '../../redux/reducers/customers'
import onLoad from './Onload'

const ShinomontazhsNew = () => {
  onLoad()
  socket.connect()
  const dispatch = useDispatch()
  const create = (name) => {
    dispatch(createWash(name))
    socket.emit('new wash')
  }
  const { num } = useParams(1)

  const history = useHistory()
  const checkLink = () => history.location.pathname.split('/').includes('washboss')
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
      history.push('/washboss/list')
    } else {
      history.push('/wash/list')
    }
    notify('Запись добавлена')
  }

  const disUpdateCust = () => {
    setModalIsOpen(false)
    create(order)
    if (checkLink()) {
      history.push('/washboss/list')
    } else {
      history.push('/wash/list')
    }
    notify('Запись добавлена')
  }

  const openAndUpdate = useCallback((idOfItem, name, state) => {
    setModalIsOpen(true)
    setActiveCustomerId(idOfItem)
    setActiveCustomerName(name)
    setOrder(state)
  }, [])

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
          num={num}
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
