import React, { useEffect } from 'react'
import { socket } from '../../redux'
import ChannelList from './channelList'
import ChatInfo from './topBarChatContent'

const ChatView = () => {
  useEffect(() => {
    socket.connect()
  }, [])
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
