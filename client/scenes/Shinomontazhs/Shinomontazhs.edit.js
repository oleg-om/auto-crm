import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { socket } from '../../redux/sockets/socketReceivers'
import ShinomontazhsEdit from '../../components/shinomontazhs/shinomontazhs.work.edit'
import Navbar from '../../components/Navbar'
import { updateShinomontazh } from '../../redux/reducers/shinomontazhs'

const ShinomontazhEditFull = () => {
  socket.connect()
  const { id } = useParams()
  const dispatch = useDispatch()
  const list = useSelector((s) => s.shinomontazhs.list).filter(
    (it) => JSON.stringify(it.id_shinomontazhs) === id
  )

  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const updateShinomontazhLocal = (idOfItem, name) => {
    dispatch(updateShinomontazh(idOfItem, name))
    socket.emit('new shinomontazh')
  }

  const shinomontazhPrintOne = (shinomontazh) => {
    socket.emit('shinomontazh one print', shinomontazh)
    notify('Печатаю один чек')
  }

  const shinomontazhPrintTwo = (shinomontazh) => {
    socket.emit('shinomontazh two print', shinomontazh)
    notify('Печатаю два чека')
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 mt-3">
        {list.map((it) => (
          <ShinomontazhsEdit
            key={id}
            {...it}
            updateShinomontazh={updateShinomontazhLocal}
            shinomontazhPrintOne={shinomontazhPrintOne}
            shinomontazhPrintTwo={shinomontazhPrintTwo}
          />
        ))}
      </div>
    </div>
  )
}

export default ShinomontazhEditFull
