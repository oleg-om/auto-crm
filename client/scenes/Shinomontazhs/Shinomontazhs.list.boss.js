import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useParams, useHistory } from 'react-router-dom'
import NumberFormat from 'react-number-format'
import cx from 'classnames'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { socket } from '../../redux/sockets/socketReceivers'
import ShinomontazhsRowBoss from '../../components/shinomontazhs/shinomontazhs.row.boss'
import { updateStatus, getShinomontazhs } from '../../redux/reducers/shinomontazhs'
import Navbar from '../../components/Navbar'
import Pagination from '../Pagination'
import onLoad from './Onload'
// import taskStatuses from '../../lists/task-statuses'

const ShinomontazhsListBoss = () => {
  onLoad()
  const dispatch = useDispatch()
  const list = useSelector((s) => s.shinomontazhs.list)
  const revList = [].concat(list).reverse()
  const placesList = useSelector((s) => s.places.list)
  const employeeList = useSelector((s) => s.employees.list)
  const role = useSelector((s) => s.auth.roles)

  const history = useHistory()
  const { num } = useParams(1)

  socket.connect()
  // useEffect(() => {
  //   socket.on('update shinomontazh', function () {
  //     dispatch(getShinomontazhs())
  //   })
  // }, [])
  const settings = useSelector((s) => s.settings.list)
  const updateStatusLocal = (id, status) => {
    dispatch(updateStatus(id, status))
  }

  const [currentPage, setCurrentPage] = useState(num ? Number(num) : 1)
  const postsPerPage = 14
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage

  const currentPosts = revList.slice(indexOfFirstPost, indexOfLastPost)

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
    history.push(`/shinomontazhboss/list/${pageNumber}`)
  }

  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState({
    phone: '',
    number: '',
    status: '',
    vinnumber: '',
    place: ''
  })
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    if (currentPage !== 1 || showSearch === true) {
      dispatch(getShinomontazhs())
    }
  }, [currentPage, showSearch])

  const onChangePhone = (e) => {
    const { name, value } = e.target
    setSearch(() => ({
      [name]: value,
      number: '',
      status: '',
      vinnumber: '',
      place: ''
    }))
  }
  const onChangeNumber = (e) => {
    const { name, value } = e.target
    setSearch(() => ({
      [name]: value,
      phone: '',
      status: '',
      vinnumber: '',
      place: ''
    }))
  }
  // const onChangeStatus = (e) => {
  //   const { name, value } = e.target
  //   setSearch(() => ({
  //     [name]: value,
  //     phone: '',
  //     number: '',
  //     vinnumber: '',
  //     place: ''
  //   }))
  // }
  // const onChangeVin = (e) => {
  //   const { name, value } = e.target
  //   setSearch(() => ({
  //     [name]: value.toUpperCase().replace(/\s/g, ''),
  //     phone: '',
  //     number: '',
  //     status: '',
  //     place: ''
  //   }))
  // }
  const onChangePlace = (e) => {
    const { name, value } = e.target
    setSearch(() => ({
      [name]: value,
      phone: '',
      number: '',
      status: '',
      vinnumber: ''
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
  const currentPostsFiltered = revList.filter(
    (it) =>
      it.phone === search.phone ||
      JSON.stringify(it.id_shinomontazhs) === search.number ||
      it.status === search.status ||
      it.place === search.place ||
      it.vinnumber === search.vinnumber
  )
  const currentPostsFilteredSliced = currentPostsFiltered.slice(indexOfFirstPost, indexOfLastPost)
  const onReset = () => {
    setShowSearch(false)
    setSearch(() => ({
      phone: '',
      number: '',
      status: '',
      vinnumber: '',
      place: ''
    }))
  }
  const onFilter = () => {
    if (
      search.phone === '' &&
      search.number === '' &&
      search.status === '' &&
      search.vinnumber === '' &&
      search.place === ''
    ) {
      notify('Заполните хотябы одно поле')
    } else {
      setShowSearch(true)
    }
  }

  return (
    <div>
      <Navbar />
      <div>
        <div className="mx-auto px-4">
          <div className="py-3 px-4 my-3 rounded-lg shadow bg-white">
            <div className="-mx-3 md:flex">
              <button
                type="button"
                className="text-sm py-1 px-3 mt-3 ml-3 mb-2 md:mb-0 lg:mt-6 bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg"
                onClick={() => dispatch(getShinomontazhs())}
              >
                <svg
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="20"
                  height="20"
                  viewBox="0 0 28.265 28.265"
                  xmlSpace="preserve"
                  className="fill-current text-white"
                >
                  <g>
                    <path
                      d="M14.133,28.265c-7.061,0-12.805-5.75-12.805-12.809c0-7.06,5.744-12.807,12.805-12.807c0.469,0,0.943,0.027,1.414,0.08
		v-2.07c0-0.266,0.164-0.508,0.406-0.611c0.252-0.098,0.531-0.043,0.723,0.148l4.537,4.547c0.258,0.258,0.258,0.67,0,0.932
		l-4.535,4.557c-0.193,0.188-0.473,0.246-0.725,0.143c-0.242-0.104-0.406-0.344-0.406-0.609V7.47
		c-0.469-0.086-0.941-0.125-1.414-0.125c-4.473,0-8.113,3.639-8.113,8.111c0,4.471,3.641,8.113,8.113,8.113s8.111-3.643,8.111-8.113
		c0-0.363,0.295-0.66,0.662-0.66h3.369c0.365,0,0.662,0.297,0.662,0.66C26.937,22.515,21.189,28.265,14.133,28.265z"
                    />
                  </g>
                </svg>
              </button>
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
                        'border-red-300 focus:border-red-500':
                          search.number.length >= 1 && showSearch === true
                      }
                    )}
                    value={search.number}
                    name="number"
                    type="number"
                    onChange={onChangeNumber}
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
                        'border-red-300 focus:border-red-500':
                          search.phone.length >= 1 && showSearch === true
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
              {/* <div className="md:w-1/2 px-3 mb-6 md:mb-0">
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
              </div> */}
              {/* <div className="md:w-1/2 px-3 mb-6 md:mb-0">
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
                          search.status.length >= 1 && showSearch === true
                      }
                    )}
                    value={search.status}
                    name="status"
                    onChange={onChangeStatus}
                  >
                    <option value="" disabled hidden>
                      Все
                    </option>
                    {taskStatuses.map((it) => (
                      <option key={it}>{it}</option>
                    ))}
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
              </div> */}
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Сортировка по точке
                </label>
                <div className="flex-shrink w-full inline-block relative">
                  <select
                    className={cx(
                      'block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded',
                      {
                        'border-red-300 focus:border-red-500':
                          search.place.length >= 1 && showSearch === true
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
                    {revList.filter((it) => it.status === taskStatuses[0]).length}
                  </button>
                </div>
              </div> */}

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
        <div className="overflow-x-auto rounded-lg overflow-y-auto relative lg:my-3 mt-1 lg:shadow lg:mx-4">
          <table className="border-collapse w-full">
            <thead>
              <tr>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                  №
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                  Авто
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                  Гос. номер
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                  Исп
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                  Точка
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                  Статус
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                  Начало
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                  Завершение
                </th>
                <th className="p-1 lg:p-3 lg:font-bold lg:uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                  Cумма
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {showSearch === false
                ? currentPosts.map((it) => (
                    <ShinomontazhsRowBoss
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
                : currentPostsFilteredSliced.map((it) => (
                    <ShinomontazhsRowBoss
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
              <b className="text-center text-gray-700">Загрузка...</b>
            </div>
          ) : null}
          {showSearch === false && currentPosts.length === 0 && loading === false ? (
            <div className="w-full bg-white py-2 flex justify-center">
              <b className="text-center text-gray-700">
                Что-то пошло не так. Возможно нет ни одного заказа, попробуйте создать первый. Если
                заказы есть, перезагрузите страницу
              </b>
            </div>
          ) : null}
        </div>
        <div className="overflow-x-auto mb-2 rounded-lg shadow overflow-y-auto relative mt-3 md:bg-gray-300 sm:bg-gray-300 lg:mx-4">
          {showSearch === false ? (
            <Pagination
              postsPerPage={postsPerPage}
              totalPosts={revList.length}
              paginate={paginate}
              currentPage={currentPage}
              currentPosts={currentPosts}
            />
          ) : (
            <Pagination
              postsPerPage={postsPerPage}
              totalPosts={currentPostsFiltered.length}
              paginate={paginate}
              currentPage={currentPage}
              currentPosts={currentPostsFiltered}
            />
          )}
        </div>

        <Link to={`/shinomontazhboss/create/${num ? Number(num) : ''}`}>
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

export default ShinomontazhsListBoss
