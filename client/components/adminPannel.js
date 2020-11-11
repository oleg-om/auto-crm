import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import uuid from 'react-uuid'
import { socket } from '../redux/index'

const AdminPannel = () => {
  const { socketsInfo } = useSelector((s) => s.socketInfoUsers)
  useEffect(() => {
    socket.connect()
    socket.emit('get clients')
  }, [])

  return (
    <div className="w-full flex flex-col">
      {Object.keys(socketsInfo).map((it) => {
        return (
          <div className="px-6 py-4 flex-1 overflow-scroll-x" key={uuid()}>
            <p>Name:{socketsInfo[it][0]}</p>
            <p>Socket: {it}</p>
            <button
              type="button"
              className="bg-teal-700 hover:bg-teal-600 text-white font-bold rounded mb-3 h-8 mt-2 items-center mr-2 flex  py-2 px-4"
              onClick={() => socket.emit('disconnect user', it)}
            >
              Disconnect
            </button>
            <br />
          </div>
        )
      })}
    </div>
  )
}

export default AdminPannel
