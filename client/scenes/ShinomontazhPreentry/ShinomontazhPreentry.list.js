import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
// import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { deleteEmployee } from '../../redux/reducers/employees'

import { createCustomer } from '../../redux/reducers/customers'
import Navbar from '../../components/Navbar'
import RazvalSidebar from './ShinomontazhPreentry.sidebar'
import Modal from '../../components/Modal.delete'
import ModalView from '../../components/shinomontazhentry/Entry.modal'
import ModalCreate from '../../components/shinomontazhentry/ShinomontazhEntryCreate'
import ModalEdit from '../../components/shinomontazhentry/Entry.modal.edit'
import AccessModal from '../../components/shinomontazhentry/access.modal'
import 'react-toastify/dist/ReactToastify.css'
import { socket } from '../../redux/sockets/socketReceivers'
import onLoad from './Onload'
import ShinomontazhEntryRow from '../../components/shinomontazhentry/ShinomontazhEntryRow'
import {
  createShinomontazh,
  updateShinomontazh,
  deleteShinomontazh
} from '../../redux/reducers/shinomontazhs'
import { Loading } from '../Shinomontazhs/Shinomontazhs.list'

const PreentryList = () => {
  const location = useLocation()
  const dispatch = useDispatch()

  const getPreentryType = () => {
    if (location?.pathname.includes('/shinomontazh')) {
      return 'shinomontazh'
    }
    return 'shinomontazh'
  }
  const getPreentryTypeRus = () => {
    if (location?.pathname.includes('/shinomontazh')) {
      return 'Шиномонтаж'
    }
    return 'Шиномонтаж'
  }

  const preentryType = getPreentryType()
  const preentryTypeRus = getPreentryTypeRus()

  const isShinomontazh = preentryType === 'shinomontazh'

  const getPreentryCreateFunc = (it) => {
    if (isShinomontazh) {
      dispatch(createShinomontazh(it))
    }
    return () => {}
  }

  const getPreentryUpdateFunc = (id, it) => {
    if (isShinomontazh) {
      dispatch(updateShinomontazh(id, it))
    }
    return () => {}
  }

  const getPreentryDeleteFunc = (id) => {
    if (isShinomontazh) {
      dispatch(deleteShinomontazh(id))
    }
    return () => {}
  }

  const [activeDay, setActiveDay] = useState(new Date())
  onLoad(activeDay, preentryType)
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const place = useSelector((s) => s.places.list)
  const employee = useSelector((s) => s.employees.list)

  const shinomontazhList = useSelector((s) => s.shinomontazhs.list)
  const isLoaded = useSelector((s) => s.shinomontazhs.isLoaded)

  const getData = () => {
    if (isShinomontazh) {
      return shinomontazhList
    }
    return []
  }

  const dataList = getData()

  const auth = useSelector((s) => s.auth)
  const [isOpen, setIsOpen] = useState(false)

  const [createIsOpen, setCreateIsOpen] = useState(false)
  const [editIsOpen, setEditIsOpen] = useState(false)

  const [deleteIsOpen, setDeleteIsOpen] = useState(false)

  const [accessIsOpen, setAccessIsOpen] = useState(false)

  const [itemId, setItemId] = useState('')
  const [itemType, setItemType] = useState('')

  const [activeTime, setActiveTime] = useState('')
  const [activeAdress, setActiveAdress] = useState({})
  const [activePost, setActivePost] = useState()

  socket.connect()

  const openAndEdit = (id, type, address) => {
    setIsOpen(true)
    setItemId(id)
    setItemType(type)
    setActiveAdress(address)
  }
  const openAndCreate = (time, address, type, actAdr, postNumber) => {
    setCreateIsOpen(true)
    setItemType(type)
    setActiveTime(time)
    setActiveAdress(address)
    setActivePost(postNumber)
  }
  const openAndEditTime = () => {
    setIsOpen(false)
    setEditIsOpen(true)
  }
  const openAndDelete = () => {
    setIsOpen(false)
    setEditIsOpen(true)
    setDeleteIsOpen(true)
  }
  const openAndDeleteAccess = () => {
    setAccessIsOpen(false)
    setEditIsOpen(false)
    setDeleteIsOpen(true)
  }
  const openAccess = (id, type) => {
    setItemId(id)
    setItemType(type)
    setAccessIsOpen(true)
  }
  const updateEntryLocal = (idOfItem, name) => {
    getPreentryUpdateFunc(idOfItem, name)
    setIsOpen(false)
    setEditIsOpen(false)
    notify('Данные обновлены')
    socket.emit(`edit ${preentryType}`)
    setItemId('')
  }

  const createEntryLocal = (name) => {
    getPreentryCreateFunc(name)
    setCreateIsOpen(false)
    notify(`Запись на ${preentryTypeRus} добавлена`)
    // socket.emit('new razval', { name })
    setItemId('')
  }

  const createCust = (name) => {
    dispatch(createCustomer(name))
    notify('Создан новый клиент')
  }

  const deleteRazvalLocal = (id) => {
    getPreentryDeleteFunc(id)
    setDeleteIsOpen(false)
    setEditIsOpen(false)
    notify('Запись удалена')
    socket.emit(`edit ${preentryType}`)
    setItemId('')
  }

  const deleteEmployeeLocal = (id) => {
    dispatch(deleteEmployee(id))
    setIsOpen(false)
    notify('Сотрудник удален')
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-row">
        <RazvalSidebar setActiveDay={setActiveDay} activeDay={activeDay} />
        <div className="w-full mx-auto my-2">
          {isLoaded ? (
            <div className="rounded-lg relative lg:my-3 mt-1 flex flex-wrap mx-3">
              {place
                .filter((it) => it.id === auth.place)
                .filter((it) => it[preentryType] === 'true')
                .map((it) => (
                  <div key={it.id}>
                    <ShinomontazhEntryRow
                      key={it.id}
                      place={place}
                      editItem={openAndEdit}
                      createItem={openAndCreate}
                      changeItem={openAndEditTime}
                      openAccess={openAccess}
                      adress={it}
                      activeDay={activeDay}
                      dataList={dataList || []}
                      activePlace="true"
                      activeAdress={auth.place}
                      activeRole={auth.roles}
                      preentryType={preentryType}
                      preentryTypeRus={preentryTypeRus}
                      viewType={it[`${preentryType}Type`]}
                      {...it}
                    />
                  </div>
                ))}
              {place
                .filter((it) => it.id !== auth.place)
                .filter((it) => it[preentryType] === 'true')
                .map((it) => (
                  <div key={it.id}>
                    <ShinomontazhEntryRow
                      key={it.id}
                      place={place}
                      editItem={openAndEdit}
                      createItem={openAndCreate}
                      changeItem={openAndEditTime}
                      openAccess={openAccess}
                      adress={it}
                      activeDay={activeDay}
                      dataList={dataList || []}
                      activePlace="false"
                      activeAdress={auth.place}
                      activeRole={auth.roles}
                      preentryType={preentryType}
                      preentryTypeRus={preentryTypeRus}
                      viewType={it[`${preentryType}Type`]}
                      {...it}
                    />
                  </div>
                ))}
            </div>
          ) : (
            <Loading />
          )}
        </div>
        <ModalView
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onSubmit={() => deleteEmployeeLocal(itemId)}
          itemId={itemId}
          itemType={itemType}
          place={place}
          employee={employee}
          updateRazval={updateEntryLocal}
          activeAdress={auth.place}
          changeItem={openAndEditTime}
          preentryType={preentryType}
        />
        <ModalCreate
          open={createIsOpen}
          onClose={() => setCreateIsOpen(false)}
          onSubmit={() => deleteEmployeeLocal(itemId)}
          itemId={itemId}
          itemType={itemType}
          place={place}
          employee={auth}
          createFunc={createEntryLocal}
          activeDay={activeDay}
          timeActive={activeTime}
          activeAdress={activeAdress}
          createIsOpen={createIsOpen}
          createCust={createCust}
          activePost={activePost}
          preentryType={preentryType}
        />
        <ModalEdit
          open={editIsOpen}
          onClose={() => setEditIsOpen(false)}
          onSubmit={() => deleteEmployeeLocal(itemId)}
          itemId={itemId}
          itemType={itemType}
          place={place}
          employee={employee}
          updateRazval={updateEntryLocal}
          deleteRazval={deleteRazvalLocal}
          activeAdress={activeAdress}
          deleteItem={openAndDelete}
          dataList={dataList}
          preentryType={preentryType}
        />
        <Modal
          open={deleteIsOpen}
          onClose={() => setDeleteIsOpen(false)}
          onSubmit={() => deleteRazvalLocal(itemId.id)}
          preentryType={preentryType}
        />
        <AccessModal
          open={accessIsOpen}
          onClose={() => setAccessIsOpen(false)}
          onSubmit={() => deleteEmployeeLocal(itemId)}
          itemId={itemId}
          itemType={itemType}
          place={place}
          employee={employee}
          updateRazval={updateEntryLocal}
          deleteRazval={deleteRazvalLocal}
          activeAdress={auth.place}
          deleteItem={openAndDeleteAccess}
          preentryType={preentryType}
        />
      </div>
      <Link to="/shinomontazh/create/">
        <button
          type="button"
          className="fixed bottom-0 right-0 p-6 shadow bg-blue-600 text-white opacity-75 text-2xl hover:opacity-100 hover:bg-blue-700 hover:text-white rounded-full my-3 mx-3"
        >
          Новый
          <br />
          заказ
        </button>
      </Link>
    </div>
  )
}

export default PreentryList
