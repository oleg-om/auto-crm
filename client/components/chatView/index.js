import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { socket } from '../../redux'
import { deleteRecivedMessages } from '../../redux/reducers/messages'
import ChannelList from './channelList'
import ChatInfo from './topBarChatContent'

const ChatView = () => {
  const dispatch = useDispatch()
  const { currentRoom } = useSelector((s) => s.messages)
  const { token } = useSelector((s) => s.auth)

  useEffect(() => {
    if (socket.connected) {
      dispatch(deleteRecivedMessages())
      socket.emit('new login', { token, currentRoom })
      socket.emit('load history', currentRoom)
    } else {
      socket.connect()
    }
  }, [currentRoom])

  return (
    <div className="w-full shadow">
      <div className="flex">
        <ChannelList />
        <ChatInfo />
      </div>
    </div>
  )
}

export default ChatView
