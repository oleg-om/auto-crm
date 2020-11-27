import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import Modal from '../Modal.delete'
import 'react-toastify/dist/ReactToastify.css'

const PlaceUpdate = (props) => {
  const [isOpen, SetIsOpen] = useState(false)
  const [state, setState] = useState(props.name)
  const history = useHistory()
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  const removePlace = (e) => {
    props.deletePlace(props.id, e.target.value)
    history.push('/place/list')
    notify('Адрес удален')
  }
  const changePlace = () => {
    if (!state) notify('Поле пустое')
    else {
      props.updatePlace(props.id, state)
      history.push('/place/list')
      notify('Данные изменены')
    }
  }

  const onChange = ({ target: { value } }) => {
    setState(value)
  }

  return (
    <div>
      <div className="bg-white shadow rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
        <div className="-mx-3 md:flex">
          <div className="md:w-full px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Название объекта
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
              value={state}
              onChange={onChange}
            />
          </div>
        </div>
      </div>
      <div className=" flex my-2">
        <Link
          to="/place/list"
          className="my-3 mr-2 py-2 w-1/3 px-3 bg-green-600 text-white text-center hover:bg-green-700 hover:text-white rounded-lg"
        >
          Отмена
        </Link>
        <button
          className="my-3 mr-2 py-2 w-1/3 px-3 bg-red-600 text-white text-center hover:bg-red-700 hover:text-white rounded-lg"
          type="button"
          onClick={() => SetIsOpen(true)}
        >
          Удалить
        </button>
        <button
          className="my-3 ml-2 py-2 w-2/3 px-3 bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg"
          type="button"
          onClick={changePlace}
        >
          Сохранить
        </button>
      </div>
      <Modal open={isOpen} onClose={() => SetIsOpen(false)} onSubmit={removePlace} />
    </div>
  )
}

export default PlaceUpdate
