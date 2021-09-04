import React from 'react'
import { useDispatch } from 'react-redux'
import { registration } from '../../redux/reducers/auth'

const ButtonRegistration = () => {
  const dispatch = useDispatch()
  return (
    <button
      type="button"
      className="bg-teal-700 hover:bg-teal-600 text-white font-bold rounded mb-3 h-8 mt-2 items-center mr-2  w-full flex justify-center py-2 px-4"
      onClick={() => dispatch(registration())}
    >
      Registration
    </button>
  )
}

export default ButtonRegistration
