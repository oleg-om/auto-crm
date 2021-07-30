import React from 'react'
import UserChatInfo from './userChatInfo'
import Message from './message'
import AddMessage from './addMessage'

const Chat = () => {
  return (
    <div className="px-6 py-4 flex-1 overflow-scroll-x">
      <div className="flex flex-col">
        <UserChatInfo />
        <Message />
        <br />
        <AddMessage />
      </div>
    </div>
  )
}

export default Chat
