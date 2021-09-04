import React from 'react'
import { useSelector } from 'react-redux'

const ChatName = () => {
  const { currentRoom } = useSelector((s) => s.messages)
  return <h3 className="text-grey-darkest text-md mb-1 font-extrabold">#{currentRoom}</h3>
}

export default ChatName
