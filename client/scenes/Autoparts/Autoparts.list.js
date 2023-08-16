import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import { socket } from '../../redux/sockets/socketReceivers'
import AutopartsRow from '../../components/autoparts/autoparts.row'
import { updateStatus, getAutopartsFiltered } from '../../redux/reducers/autoparts'
import Navbar from '../../components/Navbar'
import Pagination from '../Pagination'
import onLoad from './Onload'
import useFilter, { ServiceFilter } from '../../components/shared/filter'
import useSaveFilter from '../../hooks/saveFilterParams'

const AutopartsList = () => {
  const { num } = useParams(1)
  const { search, setSearch, showSearch, setShowSearch, applyFilter } = useFilter(
    num,
    getAutopartsFiltered
  )

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

  const [currentPage] = useState(num ? Number(num) : 1)
  const postsPerPage = 14
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage

  const currentPosts = revList.slice(indexOfFirstPost, indexOfLastPost)

  const { navigateWithQueryParams, searchParamsToUrl } = useSaveFilter(search)

  const paginate = (pageNumber) => {
    navigateWithQueryParams(`/autoparts/order/list/${pageNumber}`)
  }

  useEffect(() => {
    if (showSearch === false && currentPosts.length === 0 && loading === true) {
      setTimeout(() => setLoading(false), 10000)
    } else {
      setLoading(true)
    }
    return () => {}
  }, [currentPosts.length, showSearch, loading])

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

  return (
    <div>
      <Navbar />
      <div>
        <ServiceFilter
          filters={['number', 'phone', 'process', 'status', 'place', 'regnumber']}
          search={search}
          setSearch={setSearch}
          showSearch={showSearch}
          setShowSearch={setShowSearch}
          path="autoparts/order"
          applyFilter={applyFilter}
        />
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
                      searchParamsToUrl={searchParamsToUrl}
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
