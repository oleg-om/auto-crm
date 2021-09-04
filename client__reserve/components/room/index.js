import React from 'react'
import AddRoomButton from './addRoomButton'
import RoomName from './roomName'

const Room = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <form className="mt-8">
        <div className="rounded-b-md">
          <RoomName />
        </div>
        <AddRoomButton />
      </form>
    </div>
  )
}

export default Room
