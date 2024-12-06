import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { socket } from '../../redux/sockets/socketReceivers'
import ShinomontazhsEdit from '../../components/shinomontazhs/shinomontazhs.work.edit'
import Navbar from '../../components/Navbar'
import { updateShinomontazh } from '../../redux/reducers/shinomontazhs'
import { printWithAdditionalInfo } from '../../utils/utils'

const ShinomontazhEditFull = () => {
  socket.connect()
  const { id } = useParams()
  const { num } = useParams(1)
  const dispatch = useDispatch()
  const auth = useSelector((s) => s.auth)
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  useEffect(() => {
    fetch(`/api/v1/shinomontazh/${id}`)
      .then((r) => r.json())
      .then(({ data: shinomontazhs }) => {
        setList([shinomontazhs])
        setLoading(true)
      })
  }, [id])

  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const updateShinomontazhLocal = (idOfItem, name) => {
    dispatch(updateShinomontazh(idOfItem, name))
    socket.emit('edit shinomontazh')
  }

  const shinomontazhPrintOne = (shinomontazh) => {
    socket.emit('shinomontazh one print', printWithAdditionalInfo(shinomontazh, auth))
    notify('Печатаю один чек')
  }

  const shinomontazhPrintTwo = (shinomontazh) => {
    socket.emit('shinomontazh two print', printWithAdditionalInfo(shinomontazh, auth))
    notify('Печатаю два чека')
  }
  const loadingComponent = () => {
    return (
      <div className="flex w-100 justify-center my-3">
        <button
          type="button"
          className="bg-main-500 p-3 text-white rounded flex items-center"
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
              <ShinomontazhsEdit
                key={it.id_shinomontazhs}
                {...it}
                updateShinomontazh={updateShinomontazhLocal}
                shinomontazhPrintOne={shinomontazhPrintOne}
                shinomontazhPrintTwo={shinomontazhPrintTwo}
                num={num}
              />
            ))
          : loadingComponent()}
      </div>
    </div>
  )
}

export default ShinomontazhEditFull
