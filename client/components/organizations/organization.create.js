import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import NumberFormat from 'react-number-format'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import SubmitButtons from '../shared/buttons/OrderSubmitButtons'

const OrganizationCreate = (props) => {
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const history = useHistory()
  const [state, setState] = useState({
    name: '',
    phone: ''
  })

  const onChange = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const sendData = () => {
    if (!state.name) {
      notify('Поле Название пустое')
    } else {
      props.create(state)
      history.push('/organization/list')
      notify('Запись добавлена')
    }
  }

  return (
    <div>
      <div className="bg-white shadow rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
        <div className="-mx-3 md:flex flex-wrap">
          <div className="md:w-1/2 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="name"
            >
              Название *
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
              value={state.name}
              name="name"
              id="name"
              placeholder="Введите название организации"
              required
              onChange={onChange}
            />
          </div>
          <div className="md:w-1/2 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="phone"
            >
              Телефон
            </label>
            <NumberFormat
              format="+7 (###) ###-##-##"
              mask="_"
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
              value={state.phone}
              name="phone"
              id="phone"
              placeholder="Введите телефон"
              onChange={onChange}
            />
          </div>
        </div>
      </div>

      <SubmitButtons sendData={sendData} submitText="Создать" />
    </div>
  )
}

export default OrganizationCreate
