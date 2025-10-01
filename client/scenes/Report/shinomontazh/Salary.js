import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useReactToPrint } from 'react-to-print'
import SalaryTableComponent from './SalaryTableComponent'
import razvalIcon from '../../../assets/images/priority-product-large.png'
import { checkIsRazvalService } from './wrapper'

const SalaryByDay = ({
  employee,
  getLinkToWork,
  onEmployeeClick,
  getWorkId,
  clearEmployee,
  orders
}) => {
  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  })

  const totalFreeService = () => {}
  const totalWithDiscount = () => {}
  return (
    <div className="m-5">
      <div className="flex">
        <button
          type="submit"
          onClick={handlePrint}
          className="py-2 px-3 my-3 bg-main-600 text-white text-sm hover:bg-main-700 hover:text-white rounded-full h-22 w-22"
        >
          <div className="flex flex-row">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              width="20"
              height="20"
              x="0"
              y="0"
              viewBox="0 0 512 512"
              xmlSpace="preserve"
              className="mr-2"
            >
              <g>
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  d="m414 80h-316c-5.523 0-10-4.477-10-10v-26c0-24.301 19.699-44 44-44h248c24.301 0 44 19.699 44 44v26c0 5.523-4.477 10-10 10z"
                  fill="#ffffff"
                  data-original="#000000"
                />
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  d="m458 112h-404c-29.776 0-54 24.224-54 54v188c0 29.776 24.224 54 54 54h34v-80c0-39.701 32.299-72 72-72h192c39.701 0 72 32.299 72 72v80h34c29.776 0 54-24.224 54-54v-188c0-29.776-24.224-54-54-54zm-361.98 120c-13.255 0-24.005-10.745-24.005-24s10.74-24 23.995-24h.01c13.255 0 24 10.745 24 24s-10.745 24-24 24z"
                  fill="#ffffff"
                  data-original="#000000"
                />
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  d="m352 304h-192c-13.255 0-24 10.745-24 24v80 32c0 13.255 10.745 24 24 24h192c13.255 0 24-10.745 24-24v-32-80c0-13.255-10.745-24-24-24z"
                  fill="#ffffff"
                  data-original="#000000"
                />
              </g>
            </svg>

            <p> Печать талонов</p>
          </div>
        </button>
        {employee ? (
          <button
            type="submit"
            onClick={clearEmployee}
            className="py-2 px-3 my-3 ml-3 bg-green-600 text-white text-sm hover:bg-green-700 hover:text-white rounded-full h-22 w-22"
          >
            Показать всех
          </button>
        ) : null}
      </div>
      <div ref={componentRef}>
        <h2 className="text-xl font-semibold mb-2">Разбивка по дням:</h2>
        {Object.keys(orders).map((date) => (
          <div key={date}>
            <h3 key={date} className="font-semibold">
              {date} ({orders[date]?.length || 0} талонов)
            </h3>
            <table className="border-collapse w-full mb-2" key={date}>
              <thead>
                <tr>
                  <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                    Талон №
                  </th>
                  <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                    Имя
                  </th>
                  <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                    Время
                  </th>
                  <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                    Услуги
                  </th>
                  <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                    Материалы
                  </th>
                  <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                    Акция
                  </th>
                  <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                    Скидка
                  </th>
                  <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                    Cумма
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders[date].map((it) => (
                  <tr key={it.id} className="bg-white hover:bg-gray-100 table-row mb-0">
                    <td className="w-auto p-2 text-gray-800 text-left border border-b table-cell static">
                      <div className="flex items-center">
                        <Link
                          to={() => getLinkToWork(it)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {getWorkId(it)}
                        </Link>
                        {it.services?.filter((s) => checkIsRazvalService(s?.name))?.length ? (
                          <img className="w-6 ml-1" src={razvalIcon} alt="" />
                        ) : null}
                      </div>
                    </td>
                    <td className="w-auto p-2 text-gray-800 text-left border border-b table-cell static">
                      {it.employee
                        .reduce((acc, rec) => acc.concat(rec), [])
                        .reduce((acc, rec) => {
                          const x = acc.find((item) => item.id === rec.id)
                          if (!x) {
                            return acc.concat([rec])
                          }
                          return acc
                        }, [])
                        .map((man) => (
                          <button
                            type="button"
                            key={man.id}
                            onClick={onEmployeeClick}
                            value={man.id}
                            className="text-left hover:underline pr-3"
                          >
                            {man.name} {man.surname}
                          </button>
                        ))}
                    </td>
                    <td className="w-auto p-2 text-gray-800 text-center border border-b table-cell static">
                      <p>
                        {new Date(it.dateFinish).getHours()}:
                        {new Date(it.dateFinish)
                          .getMinutes()
                          .toString()
                          .replace(/^(\d)$/, '0$1')}
                      </p>
                    </td>
                    <td className="w-auto p-2 text-gray-800 text-center border border-b table-cell static">
                      {it.services.reduce((acc, rec) => acc + Number(rec.price) * rec.quantity, 0)}{' '}
                      руб.
                    </td>
                    <td className="w-auto p-2 text-gray-800 text-center border border-b table-cell static">
                      {it.material.reduce((acc, rec) => acc + Number(rec.price) * rec.quantity, 0)}{' '}
                      руб.
                    </td>
                    <td className="w-auto p-2 text-gray-800 text-center border border-b table-cell static">
                      {totalFreeService(it) ? <>{totalFreeService(it)} руб.</> : null}
                    </td>
                    <td className="w-auto p-2 text-gray-800 text-center border border-b table-cell static">
                      {it.discount ? `${it.discount}%` : ''}
                    </td>
                    <td className="w-auto p-2 text-gray-800 text-center border border-b table-cell static">
                      {totalWithDiscount(it)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>{' '}
    </div>
  )
}

const Salary = ({
  data,
  isMaterial,
  setIsMaterial,
  calendarType,
  active,
  showRazval,
  onChangeShowRazval,
  showPaid,
  onChangeShowPaid,
  activeMonth,
  showReport,
  setEmployeeId,
  employeeId
}) => {
  const employee = useSelector((s) => s.employees.employee)
  const employeeListFiltered = useSelector((s) => s.employees?.report)

  const onChangeMat = (e) => {
    const { value } = e.target
    setIsMaterial(value)
  }

  const checkIsBookkeper = active.includes('-buh')
  const checkIsShinomontazh = active.includes('sh-')
  const checkIsSto = active.includes('sto-')
  const checkIsWash = active.includes('wash-')
  const checkIsCond = active.includes('cond-')
  const checkIsWindow = active.includes('window-')

  const getLinkToWork = (it) => {
    if (checkIsShinomontazh) {
      return `/shinomontazh/edit/${it.id_shinomontazhs}`
    }
    if (checkIsSto) {
      return `/sto/edit/${it.id_stos}`
    }
    if (checkIsWash) {
      return `/wash/edit/${it.id_washs}`
    }
    if (checkIsCond) {
      return `/cond/edit/${it.id_conds}`
    }
    if (checkIsWindow) {
      return `/window/edit/${it.id_windows}`
    }
    return null
  }

  const getWorkId = (it) => {
    if (checkIsShinomontazh) {
      return it.id_shinomontazhs
    }
    if (checkIsSto) {
      return it.id_stos
    }
    if (checkIsWash) {
      return it.id_washs
    }
    if (checkIsCond) {
      return it.id_conds
    }
    if (checkIsWindow) {
      return it.id_windows
    }
    return null
  }

  const onEmployeeClick = (e) => {
    const { value } = e.target
    console.log('value 1', value)
    setEmployeeId(value)
  }

  const clearEmployee = () => {
    setEmployeeId(null)
  }

  const onChangeEmployee = (e) => {
    const { value } = e.target
    console.log('value2', value)
    setEmployeeId(value)
  }

  return (
    <div className="mb-3">
      <h2 className="text-xl font-semibold mb-2">
        {showPaid === 'no' ? 'Сводка по не оплаченным талонам' : 'Зарплаты'}
      </h2>
      <div className="flex mb-3 gap-4">
        <div className="mr-5">
          <p>Учитывать материалы:</p>
          <select
            className={cx(
              'appearance-none block bg-grey-lighter text-sm text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4',
              { 'border-red-600 focus:border-red-600 border-2': isMaterial === 'false' }
            )}
            value={isMaterial}
            onChange={onChangeMat}
          >
            <option value="true" className="text-gray-800">
              Да
            </option>

            <option value="false">Нет</option>
          </select>
        </div>
        {checkIsSto ? (
          <div>
            <p>Только развал:</p>
            <select
              className="appearance-none block bg-grey-lighter text-sm text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
              value={showRazval}
              onChange={onChangeShowRazval}
            >
              <option value="true" className="text-gray-800">
                Да
              </option>
              <option value="false">Нет</option>
            </select>
          </div>
        ) : null}
        <div>
          <p>Только оплаченные:</p>
          <select
            className={cx(
              'appearance-none block bg-grey-lighter text-sm text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4',
              { 'border-red-600 focus:border-red-600 border-2': showPaid === 'false' }
            )}
            value={showPaid}
            onChange={onChangeShowPaid}
          >
            <option value="true" className="text-gray-800">
              Да
            </option>
            <option value="false">Нет</option>
          </select>
        </div>

        {!showReport ? (
          <div>
            <p>Выберите сотрудника:</p>
            <select
              className={cx(
                'appearance-none block bg-grey-lighter text-sm text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4',
                {}
              )}
              value={employee}
              name="employee"
              onChange={onChangeEmployee}
            >
              <option value="">Все</option>
              {employeeListFiltered
                ?.sort((a, b) => a?.name - b?.name)
                .map((it) => (
                  <option key={it} value={it.id}>
                    {it.name} {it.surname}
                  </option>
                ))}
            </select>
          </div>
        ) : null}
      </div>
      <table className="border-collapse w-full">
        <thead className="sticky top-0 z-10">
          <tr>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Имя
            </th>

            {checkIsBookkeper ? (
              <>
                {calendarType === 'month' ? (
                  <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Раб.дни
                  </th>
                ) : null}
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Вал
                </th>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Процент
                </th>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Оформлен
                </th>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Зарплата
                </th>
                {calendarType === 'month' ? (
                  <>
                    <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                      Налог, руб
                    </th>
                    <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                      Сумма на карту
                    </th>
                    <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                      Аванс
                    </th>
                    <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                      Расходы
                    </th>
                    <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                      Штрафы
                    </th>
                  </>
                ) : null}
              </>
            ) : null}
            {!checkIsBookkeper ? (
              <>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Терминал
                </th>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Безнал
                </th>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Наличка
                </th>

                {calendarType === 'day' ? (
                  <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Сумма
                  </th>
                ) : null}
                {calendarType === 'day' ? (
                  <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Акция
                  </th>
                ) : null}
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Вал
                </th>
              </>
            ) : null}

            {checkIsBookkeper ? (
              <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                Остаток
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {data?.data?.map((person) => (
            <SalaryTableComponent
              key={person.employeeId}
              person={person}
              checkIsBookkeper={checkIsBookkeper}
              calendarType={calendarType}
              checkIsShinomontazh={checkIsShinomontazh}
              onEmployeeClick={onEmployeeClick}
              activeMonth={activeMonth}
            />
          ))}

          <tr className="bg-purple-100 font-bold lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0">
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">Всего:</span>
              Всего
            </td>
            {checkIsBookkeper ? (
              <>
                {calendarType === 'month' ? (
                  <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static" />
                ) : null}
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                  <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                    Вал:
                  </span>
                  {data.total.all} р.
                </td>

                <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static" />
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static" />
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static" />
                {calendarType === 'month' ? (
                  <>
                    <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static" />
                    <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static" />
                    <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static" />
                    <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
                      <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                        Налог:
                      </span>
                    </td>
                    <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
                      <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                        Сумма на карту:
                      </span>
                    </td>
                  </>
                ) : null}
              </>
            ) : null}
            {!checkIsBookkeper ? (
              <>
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
                  <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                    Терминал:
                  </span>
                  {data.total.terminal} р.
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
                  <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                    Безнал:
                  </span>
                  {data.total.cashless} р.
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
                  <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                    Наличка:
                  </span>
                  {data.total.cash} р.
                </td>
                {calendarType === 'day' ? (
                  <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
                    <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                      Сумма:
                    </span>
                    {data.total.all} р.
                  </td>
                ) : null}
                {calendarType === 'day' ? (
                  <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
                    <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                      Акция:
                    </span>
                    {data.total.discount} р.
                  </td>
                ) : null}
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
                  <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                    Вал:
                  </span>
                  {data.total.all} р.
                </td>
              </>
            ) : null}

            {checkIsBookkeper ? (
              <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
                <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                  Остаток:
                </span>
              </td>
            ) : null}
          </tr>
        </tbody>
      </table>
      {calendarType === 'day' || employeeId ? (
        <SalaryByDay
          orders={data?.orders || []}
          employee={employee}
          getLinkToWork={getLinkToWork}
          onEmployeeClick={onEmployeeClick}
          getWorkId={getWorkId}
          clearEmployee={clearEmployee}
        />
      ) : null}
    </div>
  )
}

export default Salary
