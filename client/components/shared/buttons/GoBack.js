import React from 'react'
import { useHistory } from 'react-router-dom'

const GoBack = () => {
  const history = useHistory()
  const goBack = () => {
    history.goBack()
  }
  return (
    <button
      type="button"
      onClick={goBack}
      className="my-3 mr-2 py-2 md:w-1/3 px-3 bg-red-600 text-white text-center hover:bg-red-700 hover:text-white rounded-lg"
    >
      Отмена
    </button>
  )
}

export default GoBack
