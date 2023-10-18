import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
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
  updateShinomontazhPreentry,
  createShinomontazhPreentry,
  deleteShinomontazhPreentry
} from '../../redux/reducers/shinomontazhs'
import { Loading } from '../Shinomontazhs/Shinomontazhs.list'
import { createStoPreentry, deleteStoPreentry, updateStoPreentry } from '../../redux/reducers/stos'

const PreentryList = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  socket.connect()

  const getPreentryType = () => {
    if (location?.pathname.includes('/shinomontazh')) {
      return 'shinomontazh'
    }
    if (location?.pathname.includes('/oil')) {
      return 'oil'
    }
    return 'sto'
  }
  const getPreentryTypeRus = () => {
    if (location?.pathname.includes('/shinomontazh')) {
      return 'Шиномонтаж'
    }
    if (location?.pathname.includes('/oil')) {
      return 'Замена масла'
    }
    return 'Сто'
  }

  const preentryType = getPreentryType()
  const preentryTypeRus = getPreentryTypeRus()

  const isShinomontazh = preentryType === 'shinomontazh'
  const isSto = preentryType === 'sto'
  const isOil = preentryType === 'oil'

  const getPreentryCreateFunc = (it) => {
    if (isShinomontazh) {
      dispatch(createShinomontazhPreentry(it))
      socket.emit('new shinomontazh', { name: it })
    }
    if (isSto) {
      dispatch(createStoPreentry(it))
      socket.emit('new sto', { name: it })
    }
    if (isOil) {
      dispatch(createStoPreentry({ ...it, isOil: true }))
      socket.emit('new sto', { name: it })
    }
    return () => {}
  }

  const getPreentryUpdateFunc = (id, it) => {
    if (isShinomontazh) {
      dispatch(updateShinomontazhPreentry(id, it))
      socket.emit('edit shinomontazh', { name: it })
    }
    if (isSto || isOil) {
      dispatch(updateStoPreentry(id, it))
      socket.emit('edit sto', { name: it })
    }
    return () => {}
  }

  const getPreentryDeleteFunc = (id) => {
    if (isShinomontazh) {
      dispatch(deleteShinomontazhPreentry(id))
    }
    if (isSto || isOil) {
      dispatch(deleteStoPreentry(id))
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

  const shinomontazhList = useSelector((s) => s.shinomontazhs.preentryList)
  const stoList = useSelector((s) => s.stos.preentryList)
  const shinomontazhIsLoaded = useSelector((s) => s.shinomontazhs.preentryIsLoaded)
  const stoIsLoaded = useSelector((s) => s.stos.preentryIsLoaded)
  const getIsLoaded = () => {
    if (isShinomontazh) {
      return shinomontazhIsLoaded
    }
    if (isSto || isOil) {
      return stoIsLoaded
    }
    return false
  }

  const isLoaded = getIsLoaded()

  const getData = () => {
    if (isShinomontazh) {
      return shinomontazhList
    }
    if (isSto || isOil) {
      return stoList
    }
    return []
  }

  const dataList = getData()

  const getBoxesAmount = () => {
    if (isShinomontazh) {
      return 'shinomontazhquantity'
    }
    if (isSto) {
      return 'stoboxes'
    }
    if (isOil) {
      return 'oilquantity'
    }
    return ''
  }

  const getViewType = () => {
    if (isShinomontazh) {
      return 'shinomontazhType'
    }
    if (isSto) {
      return 'stoType'
    }
    if (isOil) {
      return 'razvalAndOilType'
    }
    return ''
  }

  const boxesAmount = getBoxesAmount()
  const viewType = getViewType()

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
      <div className="flex flex-row" key={preentryType}>
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
                      viewType={viewType}
                      boxesAmount={boxesAmount}
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
                      viewType={viewType}
                      boxesAmount={boxesAmount}
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
      <Link to={`/${preentryType}/create/`}>
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
