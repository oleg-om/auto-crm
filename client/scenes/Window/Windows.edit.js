import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { socket } from '../../redux/sockets/socketReceivers'
import StosEdit from '../../components/stos/stos.work.edit'
import Navbar from '../../components/Navbar'
import { getType } from './Windows.list'
import { updateWindow } from '../../redux/reducers/windows'
import { updateCond } from '../../redux/reducers/conds'
import { usePrices } from './Onload'

const WindowEditFull = () => {
  usePrices()
  socket.connect()
  const { id } = useParams()
  const { num } = useParams(1)
  const location = useLocation()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  useEffect(() => {
    fetch(`/api/v1/${getType(location)}/${id}`)
      .then((r) => r.json())
      .then(({ data: windows }) => {
        setList([windows])
        setLoading(true)
      })
  }, [id])

  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const updateWindowLocal = (idOfItem, name) => {
    if (getType(location) === 'window') {
      dispatch(updateWindow(idOfItem, name))
      socket.emit(`edit ${getType(location)}`)
    } else if (getType(location) === 'cond') {
      dispatch(updateCond(idOfItem, name))
      socket.emit(`edit ${getType(location)}`)
    }
  }

  const stoPrintOne = (sto) => {
    socket.emit(`${getType(location)} one print`, sto)
    notify('Печатаю один чек')
  }

  const stoPrintTwo = (sto) => {
    socket.emit(`${getType(location)} two print`, sto)
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
                key={it[`id_${getType(location)}s`]}
                {...it}
                updateSto={updateWindowLocal}
                stoPrintOne={stoPrintOne}
                stoPrintTwo={stoPrintTwo}
                num={num}
                type={getType(location)}
              />
            ))
          : loadingComponent()}
      </div>
    </div>
  )
}

export default WindowEditFull
