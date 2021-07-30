import React, { useEffect } from 'react'
import { push } from 'connected-react-router'
import { useDispatch } from 'react-redux'

const NotFound = () => {
  useEffect(() => {}, [])
  const dispatch = useDispatch()
  return (
    <div className="container main-wrapper aligner">
      <div className="aligner-item text-center ">
        <h1 className="display-1">404</h1>
        <p className="lead text-gray-800 mb-5">Страница не найдена</p>
        <p className="text-gray-500 mb-0">Кажется такой страницы не существует...</p>
        <br />
        <button
          className="bottom-0 py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg lg:my-3 my-0"
          type="button"
          tabIndex="0"
          onClick={() => {
            dispatch(push('/'))
          }}
        >
          {' '}
          Вернуться назад
        </button>
      </div>
    </div>
  )
}

NotFound.propTypes = {}

NotFound.defaultProps = {}

export default NotFound
