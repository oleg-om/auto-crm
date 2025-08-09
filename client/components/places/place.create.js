import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import SubmitButtons from '../shared/buttons/OrderSubmitButtons'

const PlaceCreate = (props) => {
  const [state, setState] = useState('')

  const onChange = ({ target: { value } }) => {
    setState(value)
  }

  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const history = useHistory()

  const sendData = () => {
    if (!state) notify('Поле пустое')
    else {
      props.create(state)
      history.push('/place/list')
      notify('Запись добавлена')
    }
  }

  return (
    <div>
      <div className="bg-white shadow rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
        <div className="-mx-3 md:flex">
          <div className="md:w-full px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Новая точка
            </label>
            <input
              className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
              value={state}
              name="address"
              id="address"
              placeholder="Например: ул. Мирошника 5, Автодом"
              required
              onChange={onChange}
            />
          </div>
        </div>
      </div>
      <SubmitButtons sendData={sendData} />
    </div>
  )
}

export default PlaceCreate
