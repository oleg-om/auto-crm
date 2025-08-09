import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { NumericFormat as NumberFormat } from 'react-number-format'
import 'react-toastify/dist/ReactToastify.css'

const SettingUpdate = (props) => {
  const [state, setState] = useState({
    helpphone: props.helpphone,
    lastKerchshina: props.lastKerchshina
  })
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  const changeSetting = () => {
    props.updateSetting(props.id, state)
    notify('Данные изменены')
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
        <div className="-mx-3 md:flex">
          <div className="md:w-full px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Телефон поддержки автозапчастей
            </label>
            <NumberFormat
              format="+7 (###) ###-##-##"
              mask="_"
              className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
              type="text"
              placeholder="Автозапчасти - номер поддержки"
              value={state.helpphone}
              name="helpphone"
              id="helpphone"
              onChange={onChange}
            />
          </div>
          <div className="md:w-full px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Начиная с какого номера грузить заказы по шинам?
            </label>
            <input
              className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
              type="number"
              placeholder="Введите номер"
              value={state.lastKerchshina}
              name="lastKerchshina"
              id="lastKerchshina"
              onChange={onChange}
            />
          </div>
        </div>
      </div>
      <div className=" flex my-2">
        <button
          className="my-3 py-2 w-full px-3 bg-main-600 text-white hover:bg-main-700 hover:text-white rounded-lg"
          type="button"
          onClick={changeSetting}
        >
          Сохранить
        </button>
      </div>
    </div>
  )
}

export default SettingUpdate
