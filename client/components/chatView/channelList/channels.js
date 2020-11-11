import React from 'react'
import { useSelector } from 'react-redux'

const Channels = () => {
  const { currentRoom } = useSelector((s) => s.messages)
  return (
    <>
      <div className="px-4 mb-2 font-sans text-white">Channel</div>
      <div className="bg-teal-dark mb-6 py-1 px-4 text-white font-semi-bold ">
        <span className="pr-1 text-grey-light">#</span>
        {currentRoom}
      </div>
    </>
  )
}

export default Channels
