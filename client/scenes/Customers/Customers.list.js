import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import CustomerRow from '../../components/customers/customer'
import { deleteCustomer, getItemsFiltered } from '../../redux/reducers/customers'
import Navbar from '../../components/Navbar'
import Modal from '../../components/Modal.delete'
import 'react-toastify/dist/ReactToastify.css'
import Pagination from '../Pagination'
import onLoad from './Onload'
import useFilter, { ServiceFilter } from '../../components/shared/filter'
import useSaveFilter from '../../hooks/saveFilterParams'

const CustomerList = () => {
  const { num } = useParams(1)
  const { search, setSearch, showSearch, setShowSearch, applyFilter } = useFilter(
    num,
    getItemsFiltered
  )
  onLoad(num ? Number(num) : 1, showSearch)
  const dispatch = useDispatch()
  const list = useSelector((s) => s.customers.list)
  const curPage = useSelector((s) => s.customers.currentPage)
  const totalPages = useSelector((s) => s.customers.numberOfPages)
  const isLoaded = useSelector((s) => s.customers.isLoaded)

  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
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

  const postsPerPage = 14

  const { navigateWithQueryParams } = useSaveFilter(search)

  const paginate = (pageNumber) => {
    navigateWithQueryParams(`/customer/list/${pageNumber}`)
  }

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
      <div className="container mx-auto px-4">
        <h1 className="text-3xl py-4 border-b mb-6">Список клиентов</h1>
        <ServiceFilter
          path="customer"
          search={search}
          setSearch={setSearch}
          showSearch={showSearch}
          setShowSearch={setShowSearch}
          filters={['phone', 'vinnumber', 'regnumber']}
          applyFilter={applyFilter}
        />

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
              {list && list.length > 0
                ? list.map((it) => (
                    <CustomerRow key={it.id} place={place} deleteCustomer={openAndDelete} {...it} />
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
        <div className="overflow-x-auto mb-2 rounded-lg shadow overflow-y-auto relative mt-3 md:bg-gray-300 sm:bg-gray-300 ">
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={postsPerPage * totalPages}
            paginate={paginate}
            currentPage={curPage ? Number(curPage) : 1}
            currentPosts={list}
          />
        </div>
        {/* <Link to="/customer/create">
          <button className="py-2 w-full bg-main-600 text-white hover:bg-main-700 hover:text-white rounded-lg lg:my-3 my-0">
            Добавить нового клиента
          </button>
        </Link> */}
        <Link to="/customer/create">
          <button
            type="button"
            className="fixed bottom-0 h-32 w-32 left-0 p-6 shadow bg-main-600 text-white text-l hover:bg-main-700 hover:text-white rounded-full my-3 mx-3"
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
