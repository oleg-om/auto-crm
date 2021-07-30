import React from 'react'
import { Link } from 'react-router-dom'

const AddRoomButton = () => {
  return (
    <Link
      to="/chat"
      type="button"
      className="bg-teal-700 hover:bg-teal-600 text-white font-bold rounded mb-3 h-8 mt-2 items-center mr-2  w-full flex justify-center py-2 px-4"
    >
      JOIN
    </Link>
  )
}

export default AddRoomButton
