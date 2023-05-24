import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { socket } from '../../redux/sockets/socketReceivers'
import ShinomontazhsCreate from '../../components/stos/stos.work.create'
import Navbar from '../../components/Navbar'
import UpdateModal from '../../components/stos/updatecutomer.modal'
import { createCustomer, updateCustomer } from '../../redux/reducers/customers'
import { getType } from './Windows.list'
import { getFunc, usePrices } from './Onload'
import { createWindow } from '../../redux/reducers/windows'
import { createCond } from '../../redux/reducers/conds'

const WindowsNew = () => {
  socket.connect()
  const dispatch = useDispatch()

  const { num } = useParams(1)

  const location = useLocation()
  usePrices()

  const create = (name) => {
    if (getType(location) === 'window') {
      dispatch(createWindow(name))
      socket.emit('new window')
    } else if (getType(location) === 'cond') {
      dispatch(createCond(name))
      socket.emit('new cond')
    }
  }

  const history = useHistory()
  const checkLink = () => history.location.pathname.includes('boss')

  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [activeCustomerId, setActiveCustomerId] = useState('')
  const [activeCustomerName, setActiveCustomerName] = useState({})
  const [order, setOrder] = useState({})

  useEffect(() => {
    dispatch(getFunc(location))
  }, [dispatch])

  const createCust = (name) => {
    dispatch(createCustomer(name))
  }

  const updateCust = (idOfItem, name) => {
    dispatch(updateCustomer(idOfItem, name))
    setModalIsOpen(false)
    notify('Данные клиента изменены')
    create(order)
    if (checkLink()) {
      history.push(`/${getType(location)}boss/list`)
    } else {
      history.push(`/${getType(location)}/list`)
    }
    notify('Запись добавлена')
  }

  const disUpdateCust = () => {
    setModalIsOpen(false)
    create(order)
    if (checkLink()) {
      history.push(`/${getType(location)}boss/list`)
    } else {
      history.push(`/${getType(location)}/list`)
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
          num={num}
          type={getType(location)}
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

export default WindowsNew
