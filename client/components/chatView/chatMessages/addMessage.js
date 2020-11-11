import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { socket } from '../../../redux/index'
import { addMessage } from '../../../redux/reducers/messages'

const AddMessage = () => {
  const { messages, currentRoom } = useSelector((s) => s.messages)
  const dispatch = useDispatch()
  return (
    <div className="flex m-6 rounded-lg border-2 border-grey overflow-hidden">
      <button
        type="button"
        className="text-3xl text-grey px-3 border-r-2 border-grey"
        onClick={() => {
          socket.emit('send mess', { messages, currentRoom })
          dispatch(addMessage(''))
        }}
      >
        +
      </button>
      <input
        type="text"
        className="w-full px-4"
        placeholder="Message to #general"
        value={messages}
        onChange={(e) => dispatch(addMessage(e.target.value))}
      />
    </div>
  )
}

export default AddMessage
