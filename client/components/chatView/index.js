import React from 'react'
import ChannelList from './channelList'
import ChatInfo from './topBarChatContent'

const ChatView = () => {
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
