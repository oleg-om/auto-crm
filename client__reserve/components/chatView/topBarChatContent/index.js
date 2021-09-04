import React from 'react'
import ChatName from './chatName'
import ChatDescription from './chatDescription'
import SearchElement from './searchElement'
import Chat from '../chatMessages'

const ChatInfo = () => {
  return (
    <div className="w-full flex flex-col">
      <div className="border-b flex px-6 py-2 items-center">
        <div className="flex flex-col">
          <ChatName />
          <ChatDescription />
        </div>
        <SearchElement />
      </div>
      <Chat />
    </div>
  )
}

export default ChatInfo
