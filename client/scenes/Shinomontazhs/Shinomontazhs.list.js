import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useParams, useHistory } from 'react-router-dom'
// import NumberFormat from 'react-number-format'
// import cx from 'classnames'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { socket } from '../../redux/sockets/socketReceivers'
import ShinomontazhsRow from '../../components/shinomontazhs/shinomontazhs.row'
import { updateStatus } from '../../redux/reducers/shinomontazhs'
import Navbar from '../../components/Navbar'
import Pagination from '../Pagination'
import OnLoadPlace from './OnloadPyPlace'
// import taskStatuses from '../../lists/task-statuses'

export const Loading = () => {
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

const ShinomontazhsList = () => {
  const { num } = useParams(1)
  const [showSearch] = useState(false)
  const auth = useSelector((s) => s.auth)
  OnLoadPlace(num ? Number(num) : 1, showSearch, auth.place)
  const dispatch = useDispatch()
  const placesList = useSelector((s) => s.places.list)
  const employeeList = useSelector((s) => s.employees.list)

  const role = useSelector((s) => s.auth.roles)

  const history = useHistory()
  const postsPerPage = 14
  // function secondsDiff(d1, d2) {
  //   const secDiff = Math.floor((d2 - d1) / 1000)
  //   return secDiff
  // }
  const list = useSelector((s) => s.shinomontazhs.list)
  const curPage = useSelector((s) => s.shinomontazhs.currentPage)
  const totalPages = useSelector((s) => s.shinomontazhs.numberOfPages)
  const isLoaded = useSelector((s) => s.shinomontazhs.isLoaded)

  socket.connect()

  const settings = useSelector((s) => s.settings.list)
  const updateStatusLocal = (id, status) => {
    dispatch(updateStatus(id, status))
  }

  // const [loading] = useState(true)

  const paginate = (pageNumber) => {
    history.push(`/shinomontazh/list/${pageNumber}`)
  }
  toast.configure()
  // const notify = (arg) => {
  //   toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  // }
  console.log('list', list)
  return (
    <div>
      <Navbar />
      <div>
        {auth.roles.includes('boss') ? (
          <Link
            to="/shinomontazhboss/list"
            className="block mt-4 pt-3 lg:inline-block lg:mt-0 text-gray-800 hover:text-blue-700 ml-4"
          >
            ➜ Перейти в режим начальника
          </Link>
        ) : null}

        <div className="overflow-x-auto rounded-lg overflow-y-auto relative lg:my-3 mt-1 lg:shadow lg:mx-4">
          <table className="border-collapse w-full">
            <thead>
              <tr>
                <th className="p-1 lg:p-3 lg:font-bold lg:uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                  №
                </th>
                <th className="p-1 lg:p-3 lg:font-bold lg:uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                  Авто
                </th>
                <th className="p-1 lg:p-3 lg:font-bold lg:uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                  Гос. номер
                </th>
                <th className="p-1 lg:p-3 lg:font-bold lg:uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                  Статус
                </th>
                <th className="p-1 lg:p-3 lg:font-bold lg:uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                  Начало
                </th>
                <th className="p-1 lg:p-3 lg:font-bold lg:uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                  Конец
                </th>
                <th className="p-1 lg:p-3 lg:font-bold lg:uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                  Cумма
                </th>
                <th className="p-1 lg:p-3 lg:font-bold lg:uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {list && list.length > 0
                ? list.map((it) => (
                    <ShinomontazhsRow
                      key={it?.id}
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
          {!isLoaded ? <Loading /> : null}
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

        <Link to={`/shinomontazh/create/${num ? Number(num) : ''}`}>
          <button
            type="button"
            className="fixed bottom-0 left-0 p-6 shadow bg-blue-600 text-white opacity-75 text-2xl hover:opacity-100 hover:bg-blue-700 hover:text-white rounded-full my-3 mx-3"
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

export default ShinomontazhsList
