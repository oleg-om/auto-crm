import React from 'react'
import { useSelector } from 'react-redux'
import uuid from 'react-uuid'
import UserChatInfo from './userChatInfo'

const Message = () => {
  const { receivedMess } = useSelector((s) => s.messages)
  return (
    <>
      {receivedMess.map((message) => {
        return (
          <div key={uuid()}>
            <UserChatInfo userName={Object.keys(message)} />
            <p className="font-light text-md text-grey-darkest pt-1">{Object.values(message)}</p>
          </div>
        )
      })}
    </>
  )
}

export default Message
