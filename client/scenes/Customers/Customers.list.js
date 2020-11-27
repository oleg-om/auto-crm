import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import NumberFormat from 'react-number-format'
import cx from 'classnames'
import { toast } from 'react-toastify'
import CustomerRow from '../../components/customers/customer'
import { deleteCustomer } from '../../redux/reducers/customers'
import Navbar from '../../components/Navbar'
import Modal from '../../components/Modal.delete'
import 'react-toastify/dist/ReactToastify.css'
import Pagination from '../Pagination'

const CustomerList = () => {
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  const dispatch = useDispatch()
  const list = useSelector((s) => s.customers.list)
  const place = useSelector((s) => s.places.list)
  const [isOpen, setIsOpen] = useState(false)
  const [itemId, setItemId] = useState('')

  const openAndDelete = (id) => {
    setIsOpen(true)
    setItemId(id)
  }
  const deleteCustomerLocal = (id) => {
    dispatch(deleteCustomer(id))
    setIsOpen(false)
    notify('Клиент удален')
  }
  const [search, setSearch] = useState({
    phone: '',
    vinnumber: '',
    regnumber: ''
  })
  const [showSearch, setShowSearch] = useState(false)
  const onChangePhone = (e) => {
    const { name, value } = e.target
    setSearch(() => ({
      [name]: value,
      vinnumber: '',
      regnumber: ''
    }))
  }
  const onChangeVin = (e) => {
    const { name, value } = e.target
    setSearch(() => ({
      [name]: value.toUpperCase().replace(/\s/g, ''),
      phone: '',
      regnumber: ''
    }))
  }
  const onChangeReg = (e) => {
    const { name, value } = e.target
    setSearch(() => ({
      [name]: value.toUpperCase().replace(/\s/g, ''),
      phone: '',
      vinnumber: ''
    }))
  }
  const onReset = () => {
    setShowSearch(false)
    setSearch(() => ({
      number: '',
      vinnumber: '',
      regnumber: ''
    }))
  }
  const onFilter = () => {
    if (search.phone === '' && search.vinnumber === '' && search.regnumber === '') {
      notify('Заполните хотябы одно поле')
    } else {
      setShowSearch(true)
    }
  }
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 14
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage

  const currentPosts = list.slice(indexOfFirstPost, indexOfLastPost)
  useEffect(() => {
    if (showSearch === false && currentPosts.length === 0 && loading === true) {
      setTimeout(() => setLoading(false), 10000)
    } else {
      setLoading(true)
    }
    return () => {}
  }, [currentPosts.length, showSearch, loading])
  const currentPostsFiltered = list
    .filter(
      (it) =>
        it.phone === search.phone ||
        it.regnumber === search.regnumber ||
        it.vinnumber === search.vinnumber
    )
    .slice(indexOfFirstPost, indexOfLastPost)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  // console.log(search.phone.length)
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl py-4 border-b mb-6">Список клиентов</h1>
        <div className="py-3 px-4 my-3 rounded-lg shadow bg-white">
          <div className="-mx-3 md:flex">
            <div className="md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Поиск по номеру телефона
              </label>
              <div className="flex-shrink w-full inline-block relative">
                <NumberFormat
                  className={cx(
                    'block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded',
                    {
                      'border-red-300 focus:border-red-500':
                        showSearch === true && search.phone.length >= 1
                    }
                  )}
                  format="+7 (###) ###-##-##"
                  mask="_"
                  name="phone"
                  placeholder="Начинайте ввод с 978"
                  value={search.phone}
                  onChange={onChangePhone}
                />
                <div className="pointer-events-none absolute top-0 mt-2  right-0 flex items-center px-2 text-gray-600">
                  <svg
                    version="1.1"
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg "
                    xlink="http://www.w3.org/1999/xlink "
                    x="0px "
                    y="0px "
                    viewBox="0 0 52.966 52.966 "
                    space="preserve "
                  >
                    <path
                      d="M51.704,51.273L36.845,35.82c3.79-3.801,6.138-9.041,6.138-14.82c0-11.58-9.42-21-21-21s-21,9.42-21,21s9.42,21,21,21 c5.083,0,9.748-1.817,13.384-4.832l14.895,15.491c0.196,0.205,0.458,0.307,0.721,0.307c0.25,0,0.499-0.093,0.693-0.279 C52.074,52.304,52.086,51.671,51.704,51.273z
                            M21.983,40c-10.477,0-19-8.523-19-19s8.523-19,19-19s19,8.523,19,19 S32.459,40,21.983,40z "
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Поиск по VIN
              </label>
              <div className="flex-shrink w-full inline-block relative">
                <input
                  className={cx(
                    'block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded',
                    {
                      'border-red-300 focus:border-red-500':
                        search.vinnumber.length >= 1 && showSearch === true
                    }
                  )}
                  name="vinnumber"
                  value={search.vinnumber}
                  onChange={onChangeVin}
                />
                <div className="pointer-events-none absolute top-0 mt-2  right-0 flex items-center px-2 text-gray-600">
                  <svg
                    version="1.1"
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg "
                    xlink="http://www.w3.org/1999/xlink "
                    x="0px "
                    y="0px "
                    viewBox="0 0 52.966 52.966 "
                    space="preserve "
                  >
                    <path
                      d="M51.704,51.273L36.845,35.82c3.79-3.801,6.138-9.041,6.138-14.82c0-11.58-9.42-21-21-21s-21,9.42-21,21s9.42,21,21,21 c5.083,0,9.748-1.817,13.384-4.832l14.895,15.491c0.196,0.205,0.458,0.307,0.721,0.307c0.25,0,0.499-0.093,0.693-0.279 C52.074,52.304,52.086,51.671,51.704,51.273z
                            M21.983,40c-10.477,0-19-8.523-19-19s8.523-19,19-19s19,8.523,19,19 S32.459,40,21.983,40z "
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Поиск по гос.номеру
              </label>
              <div className="flex-shrink w-full inline-block relative">
                <input
                  className={cx(
                    'block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded',
                    {
                      'border-red-300 focus:border-red-500':
                        search.regnumber.length >= 1 && showSearch === true
                    }
                  )}
                  name="regnumber"
                  value={search.regnumber}
                  onChange={onChangeReg}
                />
                <div className="pointer-events-none absolute top-0 mt-2  right-0 flex items-center px-2 text-gray-600">
                  <svg
                    version="1.1"
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg "
                    xlink="http://www.w3.org/1999/xlink "
                    x="0px "
                    y="0px "
                    viewBox="0 0 52.966 52.966 "
                    space="preserve "
                  >
                    <path
                      d="M51.704,51.273L36.845,35.82c3.79-3.801,6.138-9.041,6.138-14.82c0-11.58-9.42-21-21-21s-21,9.42-21,21s9.42,21,21,21 c5.083,0,9.748-1.817,13.384-4.832l14.895,15.491c0.196,0.205,0.458,0.307,0.721,0.307c0.25,0,0.499-0.093,0.693-0.279 C52.074,52.304,52.086,51.671,51.704,51.273z
                            M21.983,40c-10.477,0-19-8.523-19-19s8.523-19,19-19s19,8.523,19,19 S32.459,40,21.983,40z "
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex content-end  px-3 mb-6 md:mb-0">
              <button
                className="text-sm py-1 px-4 mt-3 lg:mt-6 w-full bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg"
                onClick={onFilter}
                type="button"
              >
                Фильтр
              </button>
              <button
                className="ml-2 text-sm py-1 px-4 mt-3 lg:mt-6 w-full bg-gray-200 text-gray-700 hover:text-gray-600 hover:bg-gray-400 rounded-lg"
                onClick={onReset}
                type="button"
              >
                Сбросить
              </button>
            </div>
          </div>
        </div>
        {showSearch ? (
          <div className="mx-2">
            <b className="text-gray-700">Вы применили фильтр</b>
            <button type="button" className="mx-1 hover:text-blue-600" onClick={onReset}>
              ✖
            </button>
          </div>
        ) : null}
        <div className="overflow-x-auto rounded-lg overflow-y-auto relative lg:my-3 mt-1 lg:shadow">
          <table className="border-collapse w-full">
            <thead>
              <tr>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Имя
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Телефон
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Авто
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {showSearch === false
                ? currentPosts.map((it, index) => (
                    <CustomerRow key={index} place={place} deleteCustomer={openAndDelete} {...it} />
                  ))
                : currentPostsFiltered.map((it, index) => (
                    <CustomerRow key={index} place={place} deleteCustomer={openAndDelete} {...it} />
                  ))}
            </tbody>
          </table>
          {showSearch === true && currentPostsFiltered.length === 0 ? (
            <div className="w-full bg-white py-2 flex justify-center">
              <b className="text-center text-gray-700">Записей не найдено</b>
            </div>
          ) : null}
          {showSearch === false && currentPosts.length === 0 && loading === true ? (
            <div className="w-full bg-white py-2 flex justify-center">
              <b className="text-center text-gray-700">Идет загрузка...</b>
            </div>
          ) : null}
          {showSearch === false && currentPosts.length === 0 && loading === false ? (
            <div className="w-full bg-white py-2 flex justify-center">
              <b className="text-center text-gray-700">
                Что-то пошло не так. Возможно нет ни одной записи, попробуйте создать первую. Если
                записи есть, перезагрузите страницу
              </b>
            </div>
          ) : null}
        </div>
        <div className="overflow-x-auto mb-2 rounded-lg shadow overflow-y-auto relative mt-3 md:bg-gray-300 sm:bg-gray-300 ">
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={list.length}
            paginate={paginate}
            currentPage={currentPage}
            currentPosts={currentPosts}
          />
        </div>
        {/* <Link to="/customer/create">
          <button className="py-2 w-full bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg lg:my-3 my-0">
            Добавить нового клиента
          </button>
        </Link> */}
        <Link to="/customer/create">
          <button
            type="button"
            className="fixed bottom-0 h-32 w-32 left-0 p-6 shadow bg-blue-600 text-white text-l hover:bg-blue-700 hover:text-white rounded-full my-3 mx-3"
          >
            Новый
            <br />
            клиент
          </button>
        </Link>
      </div>
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={() => deleteCustomerLocal(itemId)}
      />
    </div>
  )
}

export default CustomerList
