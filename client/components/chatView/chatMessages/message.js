import React from 'react'
import { useSelector } from 'react-redux'
import uuid from 'react-uuid'

const Message = () => {
  const { receivedMess } = useSelector((s) => s.messages)
  console.log(receivedMess)
  return (
    <>
      {receivedMess.map((it) => {
        return (
          <p className="font-light text-md text-grey-darkest pt-1" key={uuid()}>
            {it}
          </p>
        )
      })}
    </>
  )
}

export default Message
