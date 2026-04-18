import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import NumberFormat from 'react-number-format'
import Modal from '../Modal.delete'
import 'react-toastify/dist/ReactToastify.css'
import SubmitButtons from '../shared/buttons/OrderSubmitButtons'

const OrganizationUpdate = (props) => {
  const [isOpen, SetIsOpen] = useState(false)
  const history = useHistory()

  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  const [state, setState] = useState({
    name: props.name,
    phone: props.phone
  })
  const removeOrganization = (e) => {
    props.deleteOrganization(props.id, e.target.value)
    history.push('/organization/list')
    notify('Организация удалена')
  }
  const changeOrganization = () => {
    if (!state.name) {
      notify('Поле Название пустое')
    } else {
      props.updateOrganization(props.id, state)
      history.push('/organization/list')
      notify('Данные изменены')
    }
  }

  const onChange = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
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

      <SubmitButtons
        sendData={changeOrganization}
        deleteButton
        deleteButtonAction={() => SetIsOpen(true)}
      />
      <Modal open={isOpen} onClose={() => SetIsOpen(false)} onSubmit={removeOrganization} />
    </div>
  )
}

export default OrganizationUpdate
