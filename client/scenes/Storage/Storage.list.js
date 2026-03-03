import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { socket } from '../../redux/sockets/socketReceivers'
import StoragesRow from '../../components/storage/storage.row'
import { updateStatus, getItemsFiltered } from '../../redux/reducers/storage'
import Navbar from '../../components/Navbar'
import Pagination from '../Pagination'
import onLoad from './Onload'
import useSaveFilter from '../../hooks/saveFilterParams'
import useFilter, { ServiceFilter } from '../../components/shared/filter'

const StoragesList = () => {
  const { num } = useParams(1)
  const { search, setSearch, showSearch, setShowSearch, applyFilter } = useFilter(
    num,
    getItemsFiltered
  )

  onLoad(num ? Number(num) : 1, showSearch)
  const dispatch = useDispatch()
  const list = useSelector((s) => s.storage.list)
  const curPage = useSelector((s) => s.storage.currentPage)
  const totalPages = useSelector((s) => s.storage.numberOfPages)
  const isLoaded = useSelector((s) => s.storage.isLoaded)
  const placesList = useSelector((s) => s.places.list)
  const employeeList = useSelector((s) => s.employees.list)
  const role = useSelector((s) => s.auth.roles)
  socket.connect()
  // useEffect(() => {
  //   socket.on('update storage', function () {
  //     dispatch(getStorages())
  //   })
  // }, [])
  const settings = useSelector((s) => s.settings.list)
  const updateStatusLocal = (id, status) => {
    dispatch(updateStatus(id, status))
  }

  const postsPerPage = 14

  const { navigateWithQueryParams, searchParamsToUrl } = useSaveFilter(search)

  const paginate = (pageNumber) => {
    navigateWithQueryParams(`/storages/order/list/${pageNumber}`)
  }


  // useEffect(() => {
  //   if (showSearch === false && currentPosts.length === 0 && loading === true) {
  //     setTimeout(() => setLoading(false), 10000)
  //   } else {
  //     setLoading(true)
  //   }
  //   return () => {}
  // }, [currentPosts.length, showSearch, loading])

  // const currentPostsFiltered = revList.filter(
  //   (it) =>
  //     (JSON.stringify(it.id_storages) === search.number || !search.number) &&
  //     (it.phone === search.phone || !search.phone) &&
  //     (it.vinnumber === search.vinnumber || !search.vinnumber) &&
  //     (it.status === search.status || !search.status) &&
  //     (it.place === search.place || !search.place)
  // )

  const loadingComponent = () => {
    return (
      <div className="flex w-100 justify-center my-3">
        <button
          type="button"
          className="bg-main-500 p-3 text-white rounded flex items-center"
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
          path="storages/order"
          search={search}
          setSearch={setSearch}
          showSearch={showSearch}
          setShowSearch={setShowSearch}
          filters={['number', 'phone', 'status', 'place']}
          applyFilter={applyFilter}
        />
        <div className="mx-auto px-4">
          <table className="border-collapse w-full rounded-lg shadow">
            <thead>
              <tr>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                  №
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                  Клиент
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                  Хранение
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                  Телефон
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                  Принял
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                  Точка
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                  Статус
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  От
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  До
                </th>
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {list && list.length > 0
                ? list.map((it) => (
                    <StoragesRow
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

        <Link to={`/storages/order/create/${num ? Number(num) : 1}`}>
          <button
            type="button"
            className="fixed bottom-0 left-0 p-6 shadow bg-main-600 text-white opacity-75 text-l hover:opacity-100 hover:bg-main-700 hover:text-white rounded-full my-3 mx-3"
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

export default StoragesList
