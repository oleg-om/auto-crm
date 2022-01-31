import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { socket } from '../../redux/sockets/socketReceivers'
import ToolsEdit from '../../components/tools/tools.order.edit'
import Navbar from '../../components/Navbar'
import { updateTool } from '../../redux/reducers/tools'

const ToolEditFull = () => {
  socket.connect()
  const { id } = useParams()
  const { num } = useParams(1)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  useEffect(() => {
    fetch(`/api/v1/tool/${id}`)
      .then((r) => r.json())
      .then(({ data: tool }) => {
        setList([tool])
        setLoading(true)
      })
  }, [id])

  const updateToolLocal = (idOfItem, name) => {
    dispatch(updateTool(idOfItem, name))
    socket.emit('edit tool')
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
      <div className="container mx-auto px-4 mt-3">
        {loading
          ? list.map((it) => <ToolsEdit key={id} {...it} updateTool={updateToolLocal} num={num} />)
          : loadingComponent()}
      </div>
    </div>
  )
}

export default ToolEditFull
