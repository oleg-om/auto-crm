import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { useReactToPrint } from 'react-to-print'
import {
  FaUser,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaShoppingCart,
  FaPercent,
  FaWallet,
  FaCheckCircle,
  FaFileInvoiceDollar,
  FaCreditCard,
  FaHandHoldingUsd,
  FaReceipt,
  FaExclamationTriangle,
  FaBalanceScale,
  FaUniversity,
  FaMoneyBill,
  FaCalculator,
  FaTags
} from 'react-icons/fa'
import SalaryTableComponent from './SalaryTableComponent'
import { filterByEmployee, filterReportByEmployee } from '../../../utils/admin/reportUtils'
import { updateCurrentEmployeeReport } from '../../../redux/reducers/employees'
import razvalIcon from '../../../assets/images/priority-product-large.png'
import { checkIsRazvalService } from './wrapper'

const SalaryByDay = ({
  dateArray,
  totalWithDiscount,
  totalFreeService,
  report,
  employee,
  getLinkToWork,
  onEmployeeClick,
  getWorkId,
  clearEmployee
}) => {
  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  })
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
        {dateArray.map((date) => (
          <div key={date}>
            <h3 key={date} className="font-semibold">
              {new Date(date).getDate()}.{new Date(date).getMonth() + 1}.
              {new Date(date).getFullYear()}
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
                {report
                  .filter((it) => new Date(it.dateFinish).getDate() === new Date(date).getDate())
                  .filter((it) => filterReportByEmployee(it, employee))
                  .map((it) => (
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
                        {it.services.reduce(
                          (acc, rec) => acc + Number(rec.price) * rec.quantity,
                          0
                        )}{' '}
                        руб.
                      </td>
                      <td className="w-auto p-2 text-gray-800 text-center border border-b table-cell static">
                        {it.material.reduce(
                          (acc, rec) => acc + Number(rec.price) * rec.quantity,
                          0
                        )}{' '}
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
  report,
  isMaterial,
  setIsMaterial,
  calendarType,
  active,
  employeeList,
  employeeArray,
  showRazval,
  onChangeShowRazval,
  showPaid,
  onChangeShowPaid,
  activeMonth,
  showReport
}) => {
  const dispatch = useDispatch()
  const employee = useSelector((s) => s.employees.employee)
  const employeeListFiltered = useSelector((s) => s.employees?.report)

  const employeeArrayFiltered = employeeArray.filter((data) => filterByEmployee(data, employee))

  const dateArray = (emp) => {
    return report
      .filter((data) => filterReportByEmployee(data, emp))
      .reduce((thing, current) => {
        const x = thing.find(
          (item) => new Date(item.dateFinish).getDate() === new Date(current.dateFinish).getDate()
        )
        if (!x) {
          return thing.concat([current])
        }
        return thing
      }, [])
      .reduce((acc, rec) => [...acc, rec.dateFinish], [])
      .sort(function sortVendors(a, b) {
        if (new Date(a) < new Date(b)) {
          return 1
        }
        if (new Date(a) > new Date(b)) {
          return -1
        }
        return 0
      })
  }

  const onChangeMat = (e) => {
    const { value } = e.target
    setIsMaterial(value)
  }

  const commonDiscount = (number, item) => {
    const disc = item.discount ? item.discount : 0
    const number_percent = (number / 100) * disc

    return Number(number) - Number(number_percent)
  }

  const getSalary = (id, filterBy, CombFilterBy, discountType) => {
    return report
      .reduce((acc, rec) => {
        if (rec.employee.filter((it) => (id ? it.id === id : it)).length > 0) {
          return [...acc, rec]
        }
        return acc
      }, [])
      .reduce((acc, rec) => {
        if (rec.employee.filter((it) => (id ? it.id === id : it)).length > 0) {
          return [
            ...acc,
            {
              ...rec,
              employee: rec.employee.filter(
                (it) =>
                  !it.name.toLowerCase().includes('студент') &&
                  !it.surname.toLowerCase().includes('студент')
              )
            }
          ]
        }
        return acc
      }, [])

      .filter((it) => it.employee.length > 0)

      .filter((it) => (filterBy ? it.status === filterBy || it.status === CombFilterBy : it))
      .reduce((acc, rec) => {
        if (calendarType === 'day' && discountType === 'summa') {
          return [
            ...acc,
            {
              ...rec,
              services: rec.services.reduce((bat, cur) => {
                if (cur.free === 'yes') {
                  return [...bat, { ...cur, price: 0 }]
                }
                if (cur.free !== 'yes') {
                  return [...bat, cur]
                }
                return bat
              }, [])
            }
          ]
        }
        if (calendarType === 'day' && discountType === 'discountonly') {
          return [
            ...acc,
            {
              ...rec,
              material: [],
              services: rec.services.reduce((bat, cur) => {
                if (cur.free === 'yes') {
                  return [...bat, { ...cur }]
                }
                if (cur.free !== 'yes') {
                  return [...bat]
                }
                return bat
              }, [])
            }
          ]
        }

        return [...acc, rec]
      }, [])

      .reduce((acc, rec) => {
        const countEmployeePart = (num) => {
          const x = rec.employee.find((e) => e.id === id)?.salaryPercent

          if (x) {
            return (num * x) / 100
          }

          return num / rec.employee.length
        }

        if (isMaterial !== 'yes' && rec.status !== CombFilterBy) {
          return [
            ...acc,

            rec.services.reduce(
              (bat, cur) =>
                bat + countEmployeePart(commonDiscount(Number(cur.price) * cur.quantity, rec)),
              0
            )
          ]
        }
        if (isMaterial !== 'yes' && rec.status === CombFilterBy && filterBy === 'Оплачено') {
          return [
            ...acc,
            countEmployeePart(Number(rec.combCash)) -
              rec.material.reduce(
                (bat, cur) => bat + countEmployeePart(Number(cur.price) * cur.quantity),
                0
              ) /
                2
          ]
        }
        if (isMaterial !== 'yes' && rec.status === CombFilterBy && filterBy === 'Терминал') {
          return [
            ...acc,
            countEmployeePart(Number(rec.combTerm)) -
              rec.material.reduce(
                (bat, cur) => bat + countEmployeePart(Number(cur.price) * cur.quantity),
                0
              ) /
                2
          ]
        }
        if (isMaterial === 'yes' && rec.status !== CombFilterBy) {
          return [
            ...acc,
            rec.services.reduce(
              (bat, cur) =>
                bat + countEmployeePart(commonDiscount(Number(cur.price) * cur.quantity, rec)),
              0
            ) +
              rec.material.reduce(
                (bat, cur) => bat + countEmployeePart(Number(cur.price) * cur.quantity),
                0
              )
          ]
        }
        if (isMaterial === 'yes' && rec.status === CombFilterBy && filterBy === 'Оплачено') {
          return [...acc, countEmployeePart(Number(rec.combCash))]
        }
        if (isMaterial === 'yes' && rec.status === CombFilterBy && filterBy === 'Терминал') {
          return [...acc, countEmployeePart(Number(rec.combTerm))]
        }
        return acc
      }, [])
      .reduce((acc, rec) => acc + rec, 0)
  }

  const getSalaryfull = (id, filterBy, CombFilterBy, discountType) => {
    return report
      .reduce((acc, rec) => {
        if (rec.employee.filter((it) => (id ? it.id === id : it)).length > 0) {
          return [...acc, rec]
        }
        return acc
      }, [])
      .reduce((acc, rec) => {
        if (rec.employee.filter((it) => (id ? it.id === id : it)).length > 0) {
          return [
            ...acc,
            {
              ...rec,
              employee: rec.employee.filter(
                (it) =>
                  !it.name.toLowerCase().includes('студент') &&
                  !it.surname.toLowerCase().includes('студент')
              )
            }
          ]
        }
        return acc
      }, [])
      .filter((it) => it.employee.length > 0)
      .filter((it) => (filterBy ? it.status === filterBy || it.status === CombFilterBy : it))

      .reduce((acc, rec) => {
        if (calendarType === 'day' && discountType === 'summa') {
          return [
            ...acc,
            {
              ...rec,
              services: rec.services.reduce((bat, cur) => {
                if (cur.free === 'yes') {
                  return [...bat, { ...cur, price: 0 }]
                }
                if (cur.free !== 'yes') {
                  return [...bat, cur]
                }
                return bat
              }, [])
            }
          ]
        }
        if (calendarType === 'day' && discountType === 'discountonly') {
          return [
            ...acc,
            {
              ...rec,
              material: [],
              services: rec.services.reduce((bat, cur) => {
                if (cur.free === 'yes') {
                  return [...bat, { ...cur }]
                }
                if (cur.free !== 'yes') {
                  return [...bat]
                }
                return bat
              }, [])
            }
          ]
        }

        return [...acc, rec]
      }, [])
      .reduce((acc, rec) => {
        if (isMaterial !== 'yes' && rec.status !== CombFilterBy) {
          return [
            ...acc,
            rec.services.reduce(
              (bat, cur) => bat + commonDiscount(Number(cur.price) * cur.quantity, rec),
              0
            )
          ]
        }
        if (isMaterial !== 'yes' && rec.status === CombFilterBy && filterBy === 'Оплачено') {
          return [
            ...acc,
            Number(rec.combCash) -
              rec.material.reduce((bat, cur) => bat + Number(cur.price) * cur.quantity, 0) / 2
          ]
        }
        if (isMaterial !== 'yes' && rec.status === CombFilterBy && filterBy === 'Терминал') {
          return [
            ...acc,
            Number(rec.combTerm) -
              rec.material.reduce((bat, cur) => bat + Number(cur.price) * cur.quantity, 0) / 2
          ]
        }

        if (isMaterial === 'yes' && rec.status !== CombFilterBy) {
          return [
            ...acc,
            rec.services.reduce(
              (bat, cur) => bat + commonDiscount(Number(cur.price) * cur.quantity, rec),
              0
            ) + rec.material.reduce((bat, cur) => bat + Number(cur.price) * cur.quantity, 0)
          ]
        }
        if (isMaterial === 'yes' && rec.status === CombFilterBy && filterBy === 'Оплачено') {
          return [...acc, Number(rec.combCash)]
        }
        if (isMaterial === 'yes' && rec.status === CombFilterBy && filterBy === 'Терминал') {
          return [...acc, Number(rec.combTerm)]
        }
        return acc
      }, [])

      .reduce((acc, rec) => acc + rec, 0)
  }

  const [userPercent, setUserPercent] = useState({})
  const [userOformlen, setUserOformlen] = useState({})
  const [userNalog, setUserNalog] = useState({})
  const [userCardSum, setUserCardSum] = useState({})

  const onChangePercent = (e) => {
    const { name, value } = e.target
    setUserPercent((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }
  const onChangeOformlen = (e) => {
    const { name, value } = e.target
    setUserOformlen((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const onChangeNalog = (e) => {
    const { name, value } = e.target
    setUserNalog((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const onChangeCardSum = (e) => {
    const { name, value } = e.target
    setUserCardSum((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const totalFreeService = (item) =>
    item.services
      .filter((it) => it.free === 'yes')
      .reduce((acc, rec) => acc + rec.price * rec.quantity, 0)
  const totalService = (item) =>
    item.services
      .filter((it) => it.free !== 'yes')
      .reduce((acc, rec) => acc + rec.price * rec.quantity, 0)

  const applyDiscountWithFreeService = (number) => {
    return Number(number) - Number(number)
  }
  function roundTo5(num) {
    // return Math.round(num / 5) * 5
    return num
  }
  const totalMaterial = (item) =>
    item.material.reduce((acc, rec) => acc + rec.price * rec.quantity, 0)
  const totalWithDiscount = (item) =>
    applyDiscountWithFreeService(totalFreeService(item)) +
    roundTo5(commonDiscount(totalService(item), item)) +
    totalMaterial(item)

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

  useEffect(() => {
    // процент
    const emplPercnentList =
      employeeList && employeeList.length
        ? employeeList
            .filter((emp) => (checkIsShinomontazh ? emp?.shinomontazhPercent : emp?.stoPercent))
            ?.reduce((acc, rec) => {
              return {
                ...acc,
                [rec.id]: checkIsShinomontazh
                  ? rec?.shinomontazhPercent.toString()
                  : rec?.stoPercent.toString()
              }
            }, {})
        : {}

    setUserPercent((prevState) => ({
      ...prevState,
      ...emplPercnentList
    }))

    // оформление

    const emplOformlenList =
      employeeList && employeeList.length
        ? employeeList
            .filter((emp) => emp?.oformlen)
            ?.reduce((acc, rec) => {
              return {
                ...acc,
                [rec.id]: rec?.oformlen
              }

              // { [rec.id]: checkIsShinomontazh ? rec?.shinomontazhPercent : rec?.stoPercent }
            }, {})
        : {}

    setUserOformlen((prevState) => ({
      ...prevState,
      ...emplOformlenList
    }))

    // сумма на карту

    const emplCardSumList =
      employeeList && employeeList.length
        ? employeeList
            .filter((emp) => emp?.cardSum)
            ?.reduce((acc, rec) => {
              return {
                ...acc,
                [rec.id]: rec?.cardSum
              }
            }, {})
        : {}

    setUserCardSum((prevState) => ({
      ...prevState,
      ...emplCardSumList
    }))

    // налог

    const emplNalogList =
      employeeList && employeeList.length
        ? employeeList
            .filter((emp) => emp?.oformlenNalog)
            ?.reduce((acc, rec) => {
              return {
                ...acc,
                [rec.id]: rec?.oformlenNalog
              }
            }, {})
        : {}

    setUserNalog((prevState) => ({
      ...prevState,
      ...emplNalogList
    }))
  }, [employeeList])

  const onEmployeeClick = (e) => {
    const { value } = e.target
    dispatch(updateCurrentEmployeeReport(value))
  }

  const clearEmployee = () => {
    dispatch(updateCurrentEmployeeReport(''))
  }

  const onChangeEmployee = (e) => {
    const { value } = e.target
    dispatch(updateCurrentEmployeeReport(value))
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
              { 'border-red-600 focus:border-red-600 border-2': isMaterial === 'no' }
            )}
            value={isMaterial}
            onChange={onChangeMat}
          >
            <option value="yes" className="text-gray-800">
              Да
            </option>

            <option value="no">Нет</option>
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
              <option value="yes" className="text-gray-800">
                Да
              </option>
              <option value="no">Нет</option>
            </select>
          </div>
        ) : null}
        <div>
          <p>Только оплаченные:</p>
          <select
            className={cx(
              'appearance-none block bg-grey-lighter text-sm text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4',
              { 'border-red-600 focus:border-red-600 border-2': showPaid === 'no' }
            )}
            value={showPaid}
            onChange={onChangeShowPaid}
          >
            <option value="yes" className="text-gray-800">
              Да
            </option>
            <option value="no">Нет</option>
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
              <div className="flex flex-col items-center">
                <FaUser className="mb-1" />
                <span>Имя</span>
              </div>
            </th>

            {checkIsBookkeper ? (
              <>
                {calendarType === 'month' ? (
                  <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    <div className="flex flex-col items-center">
                      <FaCalendarAlt className="mb-1" />
                      <span>Раб.дни</span>
                    </div>
                  </th>
                ) : null}
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  <div className="flex flex-col items-center">
                    <FaMoneyBillWave className="mb-1" />
                    <span>Вал</span>
                  </div>
                </th>
                {calendarType === 'month' ? (
                  <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    <div className="flex flex-col items-center">
                      <FaShoppingCart className="mb-1" />
                      <span>Расходы</span>
                    </div>
                  </th>
                ) : null}
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  <div className="flex flex-col items-center">
                    <FaPercent className="mb-1" />
                    <span>Процент</span>
                  </div>
                </th>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  <div className="flex flex-col items-center">
                    <FaWallet className="mb-1" />
                    <span>Зарплата</span>
                  </div>
                </th>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  <div className="flex flex-col items-center">
                    <FaCheckCircle className="mb-1" />
                    <span>Оформлен</span>
                  </div>
                </th>
                {calendarType === 'month' ? (
                  <>
                    <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                      <div className="flex flex-col items-center">
                        <FaFileInvoiceDollar className="mb-1" />
                        <span>Налог, руб</span>
                      </div>
                    </th>
                    <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                      <div className="flex flex-col items-center">
                        <FaCreditCard className="mb-1" />
                        <span>Сумма на карту</span>
                      </div>
                    </th>
                    <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                      <div className="flex flex-col items-center">
                        <FaHandHoldingUsd className="mb-1" />
                        <span>Аванс</span>
                      </div>
                    </th>
                    <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                      <div className="flex flex-col items-center">
                        <FaReceipt className="mb-1" />
                        <span>Личные расходы</span>
                      </div>
                    </th>
                    <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                      <div className="flex flex-col items-center">
                        <FaExclamationTriangle className="mb-1" />
                        <span>Штрафы</span>
                      </div>
                    </th>
                  </>
                ) : null}
              </>
            ) : null}
            {!checkIsBookkeper ? (
              <>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  <div className="flex flex-col items-center">
                    <FaCreditCard className="mb-1" />
                    <span>Терминал</span>
                  </div>
                </th>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  <div className="flex flex-col items-center">
                    <FaUniversity className="mb-1" />
                    <span>Безнал</span>
                  </div>
                </th>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  <div className="flex flex-col items-center">
                    <FaMoneyBill className="mb-1" />
                    <span>Наличка</span>
                  </div>
                </th>

                {calendarType === 'day' ? (
                  <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    <div className="flex flex-col items-center">
                      <FaCalculator className="mb-1" />
                      <span>Сумма</span>
                    </div>
                  </th>
                ) : null}
                {calendarType === 'day' ? (
                  <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    <div className="flex flex-col items-center">
                      <FaTags className="mb-1" />
                      <span>Акция</span>
                    </div>
                  </th>
                ) : null}
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  <div className="flex flex-col items-center">
                    <FaMoneyBillWave className="mb-1" />
                    <span>Вал</span>
                  </div>
                </th>
              </>
            ) : null}

            {checkIsBookkeper ? (
              <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                <div className="flex flex-col items-center">
                  <FaBalanceScale className="mb-1" />
                  <span>Остаток</span>
                </div>
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {employeeArrayFiltered.map((it) => (
            <SalaryTableComponent
              key={it.id}
              it={it}
              userPercent={userPercent}
              getSalary={getSalary}
              checkIsBookkeper={checkIsBookkeper}
              onChangePercent={onChangePercent}
              calendarType={calendarType}
              checkIsShinomontazh={checkIsShinomontazh}
              userOformlen={userOformlen}
              onChangeOformlen={onChangeOformlen}
              onChangeNalog={onChangeNalog}
              onChangeCardSum={onChangeCardSum}
              userNalog={userNalog}
              userCardSum={userCardSum}
              onEmployeeClick={onEmployeeClick}
              activeMonth={activeMonth}
              dateArray={dateArray}
            />
          ))}
          {!employee ? (
            <tr className="bg-purple-100 font-bold lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0">
              <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
                <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                  Всего:
                </span>
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
                    {Math.round(getSalaryfull(''), '')} руб.
                  </td>
                  {calendarType === 'month' ? (
                    <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static" />
                  ) : null}
                  <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static" />
                  <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static" />
                  <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static" />
                  {calendarType === 'month' ? (
                    <>
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
                      <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
                        <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                          Аванс:
                        </span>
                      </td>
                      <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
                        <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                          Личные расходы:
                        </span>
                      </td>
                      <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
                        <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                          Штрафы:
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
                    {Math.round(getSalaryfull('', 'Терминал', 'Комбинированный', 'summa'), '')} руб.
                  </td>
                  <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
                    <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                      Безнал:
                    </span>
                    {Math.round(getSalaryfull('', 'Безнал', '', 'summa'), '')} руб.
                  </td>
                  <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
                    <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                      Наличка:
                    </span>
                    {Math.round(getSalaryfull('', 'Оплачено', 'Комбинированный', 'summa'), '')} руб.
                  </td>
                  {calendarType === 'day' ? (
                    <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
                      <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                        Сумма:
                      </span>
                      {Math.round(getSalaryfull('', '', '', 'summa'), '')} руб.
                    </td>
                  ) : null}
                  {calendarType === 'day' ? (
                    <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
                      <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                        Акция:
                      </span>
                      {Math.round(getSalaryfull('', '', '', 'discountonly'), '')} руб.
                    </td>
                  ) : null}
                  <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
                    <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                      Вал:
                    </span>
                    {Math.round(getSalaryfull(''), '')} руб.
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
          ) : null}
        </tbody>
      </table>
      {calendarType === 'day' || employee ? (
        <SalaryByDay
          dateArray={dateArray(employee)}
          totalWithDiscount={totalWithDiscount}
          totalFreeService={totalFreeService}
          report={report}
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
