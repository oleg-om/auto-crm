import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useParams, useHistory } from 'react-router-dom'
import NumberFormat from 'react-number-format'
import cx from 'classnames'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { socket } from '../../redux/sockets/socketReceivers'
import AutopartsRow from '../../components/autoparts/autoparts.row'
import { updateStatus, getAutopartsFiltered } from '../../redux/reducers/autoparts'
import Navbar from '../../components/Navbar'
import Pagination from '../Pagination'
import taskStatuses from '../../lists/task-statuses'
import onLoad from './Onload'
import { handleEnterpress } from '../../utils/utils'

const AutopartsList = () => {
  const { num } = useParams(1)
  const [showSearch, setShowSearch] = useState(false)
  onLoad(num ? Number(num) : 1, showSearch)
  const dispatch = useDispatch()
  const list = useSelector((s) => s.autoparts.list)
  const curPage = useSelector((s) => s.autoparts.currentPage)
  const totalPages = useSelector((s) => s.autoparts.numberOfPages)
  const isLoaded = useSelector((s) => s.autoparts.isLoaded)
  const revList = [].concat(list).reverse()
  const placesList = useSelector((s) => s.places.list)
  const employeeList = useSelector((s) => s.employees.list)
  const role = useSelector((s) => s.auth.roles)
  socket.connect()
  // useEffect(() => {
  //   socket.on('update autopart', function () {
  //     dispatch(getAutoparts())
  //   })
  // }, [])
  const settings = useSelector((s) => s.settings.list)
  const updateStatusLocal = (id, status) => {
    dispatch(updateStatus(id, status))
  }

  const [loading, setLoading] = useState(true)

  const history = useHistory()

  const [currentPage, setCurrentPage] = useState(num ? Number(num) : 1)
  const postsPerPage = 14
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage

  const currentPosts = revList.slice(indexOfFirstPost, indexOfLastPost)

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
    history.push(`/autoparts/order/list/${pageNumber}`)
  }

  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const [search, setSearch] = useState({
    phone: '',
    number: '',
    status: '',
    process: '',
    place: '',
    regnumber: ''
  })
  console.log('search: ', search)
  const onChangePhone = (e) => {
    const { name, value } = e.target
    setSearch((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }
  const onChangeNumber = (e) => {
    const { name, value } = e.target
    setSearch((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }
  const onChangeCustomerUppercaseRussian = (e) => {
    const { name, value } = e.target
    setSearch((prevState) => ({
      ...prevState,
      [name]: value
        .toUpperCase()
        .replace(/\s/g, '')
        .replace(/[^а-яё0-9]/i, '')
    }))
  }
  const onChangeStatus = (e) => {
    const { name, value } = e.target
    setSearch((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const onChangePlace = (e) => {
    const { name, value } = e.target
    setSearch((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }
  useEffect(() => {
    if (showSearch === false && currentPosts.length === 0 && loading === true) {
      setTimeout(() => setLoading(false), 10000)
    } else {
      setLoading(true)
    }
    return () => {}
  }, [currentPosts.length, showSearch, loading])

  useEffect(() => {
    if (showSearch) {
      const phoneArray = search.phone.split(' ')
      const phoneToRest = phoneArray[phoneArray.length - 1].replace(/_/g, '')
      if (
        (search.phone !== '' && phoneToRest.length > 6) ||
        search.status ||
        search.process ||
        search.place ||
        search.number ||
        search.regnumber
      ) {
        dispatch(
          getAutopartsFiltered(
            num ? Number(num) : 1,
            search.status ? search.status : '',
            search.process ? search.process : '',
            search.place ? search.place : '',
            phoneToRest && search.phone ? phoneToRest : '',
            search.number ? search.number : '',
            search.regnumber ? search.regnumber : ''
          )
        )
      }
    }
  }, [dispatch, num, showSearch, search])

  const onReset = () => {
    console.log('onReset')
    setShowSearch(false)
    setSearch(() => ({
      phone: '',
      number: '',
      status: '',
      process: '',
      place: '',
      regnumber: ''
    }))
    history.push(`/autoparts/order/list/1`)
  }
  const onFilter = () => {
    console.log('onFilter', search.phone)
    if (
      search.phone === '' &&
      search.number === '' &&
      search.status === '' &&
      search.process === '' &&
      search.place === '' &&
      search.regnumber === ''
    ) {
      notify('Заполните хотябы одно поле фильтра')
    } else {
      setShowSearch(true)
      history.push(`/autoparts/order/list/1`)
    }
  }

  const loadingComponent = () => {
    return (
      <div className="flex w-100 justify-center my-3">
        <button
          type="button"
          className="bg-blue-500 p-3 text-white rounded flex items-center"
          disabled
        >
          <div className=" flex justify-center items-center pr-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-4 border-white" />
          </div>
          Загрузка...
        </button>
      </div>
    )
  }

  const onEterPress = (e) => {
    handleEnterpress(e, onFilter)
  }

  return (
    <div>
      <Navbar />
      <div>
        <div className="mx-auto px-4">
          <div className="py-3 px-4 my-3 rounded-lg shadow bg-white">
            <div className="-mx-3 md:flex">
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Номер заказа
                </label>
                <div className="flex-shrink w-full inline-block relative">
                  <input
                    className={cx(
                      'block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded',
                      {
                        'border-red-300 focus:border-red-500': search.number && showSearch === true
                      }
                    )}
                    value={search.number}
                    name="number"
                    type="number"
                    onChange={onChangeNumber}
                    onKeyDown={onEterPress}
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
                  Телефон
                </label>
                <div className="flex-shrink w-full inline-block relative">
                  <NumberFormat
                    className={cx(
                      'block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded',
                      {
                        'border-red-300 focus:border-red-500': search.phone && showSearch === true
                      }
                    )}
                    format="+7 (###) ###-##-##"
                    mask="_"
                    name="phone"
                    placeholder="Начинайте ввод с 978"
                    value={search.phone}
                    onChange={onChangePhone}
                    onKeyDown={onEterPress}
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
                  Обработал
                </label>
                <div className="flex-shrink w-full inline-block relative">
                  <select
                    className={cx(
                      'block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded',
                      {
                        'border-red-300 focus:border-red-500': search.status && showSearch === true
                      }
                    )}
                    value={search.process}
                    name="process"
                    onChange={onChangePlace}
                  >
                    <option value="" disabled hidden>
                      Все
                    </option>
                    {employeeList
                      .filter((it) => it.role.includes('Обработка заказов (запчасти)'))
                      .map((it) => {
                        return (
                          <option key={it.id} value={it.id}>
                            {it.name} {it.surname}
                          </option>
                        )
                      })}
                  </select>
                  <div className="pointer-events-none absolute top-0 mt-2  right-0 flex items-center px-2 text-gray-600">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Показать заказы
                </label>
                <div className="flex-shrink w-full inline-block relative">
                  <select
                    className={cx(
                      'block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded',
                      {
                        'border-red-300 focus:border-red-500':
                          search && search.status && showSearch === true
                      }
                    )}
                    value={search && search.status ? search.status : ''}
                    name="status"
                    onChange={onChangeStatus}
                  >
                    <option value="" disabled hidden>
                      Все
                    </option>
                    {taskStatuses.map((it) => (
                      <option key={it}>{it}</option>
                    ))}
                    <option value="itemsInStock">Товар на складе</option>
                  </select>
                  <div className="pointer-events-none absolute top-0 mt-2  right-0 flex items-center px-2 text-gray-600">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Сорт. по точке
                </label>
                <div className="flex-shrink w-full inline-block relative">
                  <select
                    className={cx(
                      'block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded',
                      {
                        'border-red-300 focus:border-red-500': search.place && showSearch === true
                      }
                    )}
                    value={search.place}
                    name="place"
                    onChange={onChangePlace}
                  >
                    <option value="" disabled hidden>
                      Все
                    </option>
                    {placesList.map((it) => {
                      return (
                        <option key={it.id} value={it.id}>
                          {it.name}
                        </option>
                      )
                    })}
                  </select>
                  <div className="pointer-events-none absolute top-0 mt-2  right-0 flex items-center px-2 text-gray-600">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              {/* <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Новых заказов
                </label>
                <div className="flex-shrink w-full">
                  <button
                    type="button"
                    className="appearance-none w-full text-left bg-grey-lighter border border-yellow-500 focus:outline-none py-1 px-4 pr-8 rounded"
                  >
                    {list ? list.filter((it) => it.status === taskStatuses[0]).length : 0}
                  </button>
                </div>
              </div> */}
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Гос номер
                </label>
                <div className="flex-shrink w-full inline-block relative">
                  <input
                    className={cx(
                      'block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded',
                      {
                        'border-red-300 focus:border-red-500':
                          search.regnumber && showSearch === true
                      }
                    )}
                    value={search.regnumber}
                    name="regnumber"
                    type="regnumber"
                    onChange={onChangeCustomerUppercaseRussian}
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
                  type="button"
                  className="text-sm py-1 px-4 mt-3 lg:mt-6 w-full bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg"
                  onClick={onFilter}
                >
                  Фильтр
                </button>
                <button
                  type="button"
                  className="ml-2 text-sm py-1 px-4 mt-3 lg:mt-6 w-full bg-gray-200 text-gray-700 hover:text-gray-600 hover:bg-gray-400 rounded-lg"
                  onClick={onReset}
                >
                  Сбросить
                </button>
              </div>
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
        <div className="mx-auto px-4">
          <table className="border-collapse w-full rounded-lg shadow">
            <thead>
              <tr>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  №
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Клиент
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Заказ
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Авто
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Телефон
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Принял
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Точка
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Обработал
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Статус
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Дата
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {list && list.length > 0
                ? list.map((it) => (
                    <AutopartsRow
                      key={it.id}
                      {...it}
                      updateStatus={updateStatusLocal}
                      role={role}
                      employeeList={employeeList.find((item) => item.id === it.employee)}
                      processList={employeeList.find((item) => item.id === it.process)}
                      placesList={placesList.find((item) => item.id === it.place)}
                      settings={settings}
                      num={num}
                    />
                  ))
                : null}
            </tbody>
          </table>
          {showSearch === true && isLoaded && list && list.length === 0 ? (
            <div className="w-full bg-white py-2 flex justify-center">
              <b className="text-center text-gray-700">Записей не найдено</b>
            </div>
          ) : null}
          {!isLoaded ? loadingComponent() : null}
          {showSearch === false && list && list.length === 0 && isLoaded ? (
            <div className="w-full bg-white py-2 flex justify-center">
              <b className="text-center text-gray-700">
                Нет ни одного заказа, попробуйте создать первый. Если заказы есть, перезагрузите
                страницу
              </b>
            </div>
          ) : null}
        </div>
        <div className="mb-2 rounded-lg relative mt-3 px-4">
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={postsPerPage * totalPages}
            paginate={paginate}
            currentPage={curPage ? Number(curPage) : 1}
            currentPosts={list}
          />
        </div>

        <Link to={`/autoparts/order/create/${num ? Number(num) : ''}`}>
          <button
            type="button"
            className="fixed bottom-0 left-0 p-6 shadow bg-blue-600 text-white opacity-75 text-l hover:opacity-100 hover:bg-blue-700 hover:text-white rounded-full my-3 mx-3"
          >
            Новый
            <br />
            заказ
          </button>
        </Link>
      </div>
    </div>
  )
}

export default AutopartsList
