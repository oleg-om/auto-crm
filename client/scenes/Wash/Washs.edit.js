import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { socket } from '../../redux/sockets/socketReceivers'
import WashsEdit from '../../components/washs/washs.work.edit'
import Navbar from '../../components/Navbar'
import { updateWash } from '../../redux/reducers/washs'
import onLoad from './Onload'

const WashEditFull = () => {
  onLoad()
  socket.connect()
  const { id } = useParams()
  const { num } = useParams(1)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  useEffect(() => {
    fetch(`/api/v1/wash/${id}`)
      .then((r) => r.json())
      .then(({ data: washs }) => {
        setList([washs])
        setLoading(true)
      })
  }, [id])

  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const updateWashLocal = (idOfItem, name) => {
    dispatch(updateWash(idOfItem, name))
    socket.emit('edit wash')
  }

  const washPrintOne = (wash) => {
    socket.emit('wash one print', wash)
    notify('Печатаю один чек')
  }

  const washPrintTwo = (wash) => {
    socket.emit('wash two print', wash)
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
              <WashsEdit
                key={it.id_washs}
                {...it}
                updateWash={updateWashLocal}
                washPrintOne={washPrintOne}
                washPrintTwo={washPrintTwo}
                num={num}
              />
            ))
          : loadingComponent()}
      </div>
    </div>
  )
}

export default WashEditFull
