import React from 'react'
import { useDispatch } from 'react-redux'
import { updateCurrencyRoom } from '../../redux/reducers/messages'

const RoomName = () => {
  const dispatch = useDispatch()
  return (
    <div className="rounded-md shadow-sm">
      <input
        aria-label="Room Name"
        type="Room Name"
        name="Room Name"
        placeholder="Room Name"
        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
        onChange={(e) => {
          dispatch(updateCurrencyRoom(e.target.value))
        }}
      />
    </div>
  )
}

export default RoomName
