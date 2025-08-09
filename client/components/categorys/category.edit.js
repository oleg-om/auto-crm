import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import Modal from '../Modal.delete'
import 'react-toastify/dist/ReactToastify.css'
import categoryList from '../../lists/category-list'
import SubmitButtons from '../shared/buttons/OrderSubmitButtons'

const CategoryUpdate = (props) => {
  const [isOpen, SetIsOpen] = useState(false)
  const history = useHistory()

  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  const [state, setState] = useState({
    name: props.name,
    type: props.type,
    phone: props.phone
  })
  const removeCategory = (e) => {
    props.deleteCategory(props.id, e.target.value)
    history.push('/category/list')
    notify('Категория удалена')
  }
  const changeCategory = () => {
    if (!state.name) notify('Поле Название пустое')
    else if (!state.type) notify('Поле Подкатегория пустое')
    else {
      props.updateCategory(props.id, state)
      history.push('/category/list')
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
          <div className="md:w-1/3 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Название
            </label>
            <input
              className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
              value={state.name}
              name="name"
              id="name"
              placeholder="Введите название категории"
              required
              onChange={onChange}
            />
          </div>

          <div className="md:w-1/3 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Подкатегория
            </label>
            <select
              className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
              value={state.type}
              name="type"
              id="type"
              required
              onChange={onChange}
            >
              <option value="" disabled hidden className="text-gray-800">
                Выберите подкатегорию
              </option>
              {categoryList.map((it) => {
                return (
                  <option value={it.value} key={it.id}>
                    {it.name}
                  </option>
                )
              })}
            </select>
          </div>
        </div>
      </div>
      <SubmitButtons
        sendData={changeCategory}
        deleteButton
        deleteButtonAction={() => SetIsOpen(true)}
      />
      <Modal open={isOpen} onClose={() => SetIsOpen(false)} onSubmit={removeCategory} />
    </div>
  )
}

export default CategoryUpdate
