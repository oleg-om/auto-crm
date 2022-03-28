import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { socket } from '../../redux/sockets/socketReceivers'
import StosEdit from '../../components/stos/stos.work.edit'
import Navbar from '../../components/Navbar'
import { updateSto } from '../../redux/reducers/stos'

const StoEditFull = () => {
  socket.connect()
  const { id } = useParams()
  const { num } = useParams(1)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  useEffect(() => {
    fetch(`/api/v1/sto/${id}`)
      .then((r) => r.json())
      .then(({ data: stos }) => {
        setList([stos])
        setLoading(true)
      })
  }, [id])

  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const updateStoLocal = (idOfItem, name) => {
    dispatch(updateSto(idOfItem, name))
    socket.emit('edit sto')
  }

  const stoPrintOne = (sto) => {
    socket.emit('sto one print', sto)
    notify('Печатаю один чек')
  }

  const stoPrintTwo = (sto) => {
    socket.emit('sto two print', sto)
    notify('Печатаю два чека')
  }
  const loadingComponent = () => {
    return (
      <div className="flex w-100 justify-center my-3">
        <button
          type="button"
          className="bg-blue-500 p-3 text-white rounded flex items-center"
          disabled
        >
          <div className=" flex justify-center items-center pr-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-4 border-white" />
          </div>
          Загрузка...
        </button>
      </div>
    )
  }
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 mt-3" key={id}>
        {loading
          ? list.map((it) => (
              <StosEdit
                key={it.id_stos}
                {...it}
                updateSto={updateStoLocal}
                stoPrintOne={stoPrintOne}
                stoPrintTwo={stoPrintTwo}
                num={num}
              />
            ))
          : loadingComponent()}
      </div>
    </div>
  )
}

export default StoEditFull
