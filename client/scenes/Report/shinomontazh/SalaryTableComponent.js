import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { updateEmployee } from '../../../redux/reducers/employees'
import saveIcon from '../../../assets/images/save.png'

const ImageSave = () => (
  <img alt="save" className="img__save" src={saveIcon} width={16} height={16} />
)

const SalaryTableComponent = ({
  it,
  userPercent,
  getSalary,
  checkIsBookkeper,
  onChangePercent,
  calendarType,
  checkIsShinomontazh,
  userOformlen,
  onChangeOformlen,
  onChangeNalog,
  onChangeCardSum,
  userNalog,
  userCardSum
}) => {
  const dispatch = useDispatch()

  const applyDiscount = (number, percentOfUser, userId) => {
    const disc = percentOfUser
    const number_percent = (number / 100) * disc

    const nalog = Number(userNalog[userId]) || 0
    const card = Number(userCardSum[userId]) || 0

    return Number(number) - (Number(number) - Number(number_percent)) - nalog - card
  }

  const [saved, setSaved] = useState(false)
  const [savedOformlen, setSavedOformlen] = useState(false)
  //   const [error, setError] = useState(true)

  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const savePercent = (type, emplId, emplPerc) => {
    if (type === 'percent') {
      const getPercentObj = () => {
        if (checkIsShinomontazh) {
          return {
            shinomontazhPercent: emplPerc
          }
        }
        return {
          stoPercent: emplPerc
        }
      }
      if (emplPerc) {
        dispatch(updateEmployee(emplId, getPercentObj()))
        setSaved(true)
        notify('Процент сотрудника сохранен')
        //   setError(false)
      } else {
        notify('Заполните процент')
      }
    }

    if (type === 'oformlen') {
      dispatch(updateEmployee(emplId, { oformlen: emplPerc }))
      notify('Поле оформление сотрудника сохранено')
      setSavedOformlen(true)
    }
  }

  return (
    <tr className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0">
      <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Имя:</span>
        {it.name} {it.surname}
      </td>
      {checkIsBookkeper ? (
        <>
          <td
            id="procent"
            className="w-auto table-cell lg:w-auto p-2 text-gray-800 text-left border border-b relative lg:static"
          >
            <span className="flex">
              <input
                className="w-full border-solid border-4 border-light-blue-500"
                type="number"
                value={userPercent[it.id]}
                onChange={onChangePercent}
                name={it.id}
              />
              <button
                type="button"
                onClick={() => savePercent('percent', it.id, userPercent[it.id])}
                className="img__save-wrap ml-2 text-sm py-1 px-4 bg-gray-200 text-gray-700 hover:text-gray-600 hover:bg-gray-400 rounded-lg"
              >
                {saved ? '✓' : <ImageSave />}
              </button>
            </span>
          </td>
          <td
            id="oformlen"
            className="w-auto table-cell lg:w-auto p-2 text-gray-800 text-left border border-b relative lg:static"
          >
            {' '}
            <span className="flex">
              <select
                className="w-full border-solid border-4 border-light-blue-500"
                // type="number"
                value={userOformlen[it.id]}
                defaultValue="false"
                onChange={onChangeOformlen}
                name={it.id}
              >
                <option value="true">Да</option>
                <option value="false">Нет</option>
              </select>
              <button
                type="button"
                onClick={() => savePercent('oformlen', it.id, userOformlen[it.id])}
                className="img__save-wrap ml-2 text-sm p-1 px-2 bg-gray-200 text-gray-700 hover:text-gray-600 hover:bg-gray-400 rounded-lg"
              >
                {savedOformlen ? '✓' : <ImageSave />}
              </button>{' '}
            </span>
          </td>
          <td
            id="nalog"
            className="w-auto table-cell lg:w-auto p-2 text-gray-800 text-left border border-b relative lg:static"
          >
            <span className="flex">
              <input
                className="w-full border-solid border-4 border-light-blue-500"
                type="number"
                value={userNalog[it.id]}
                onChange={onChangeNalog}
                name={it.id}
              />
              {/* <button
                type="button"
                onClick={() => savePercent(it.id, userPercent[it.id])}
                className="ml-2 text-sm py-1 px-4 bg-gray-200 text-gray-700 hover:text-gray-600 hover:bg-gray-400 rounded-lg"
              >
                {saved ? '✓' : 'Сохранить'}
              </button> */}
            </span>
          </td>
          <td
            id="cardSum"
            className="w-auto table-cell lg:w-auto p-2 text-gray-800 text-left border border-b relative lg:static"
          >
            <span className="flex">
              <input
                className="w-full border-solid border-4 border-light-blue-500"
                type="number"
                value={userCardSum[it.id]}
                onChange={onChangeCardSum}
                name={it.id}
              />
              {/* <button
                type="button"
                onClick={() => savePercent(it.id, userPercent[it.id])}
                className="ml-2 text-sm py-1 px-4 bg-gray-200 text-gray-700 hover:text-gray-600 hover:bg-gray-400 rounded-lg"
              >
                {saved ? '✓' : 'Сохранить'}
              </button> */}
            </span>
          </td>
        </>
      ) : null}
      {!checkIsBookkeper ? (
        <>
          <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
            <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Терминал:</span>
            {Math.round(
              getSalary(it.id, 'Терминал', 'Комбинированный', 'summa'),
              userPercent[it.id]
            )}{' '}
            руб.
          </td>
          <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
            <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Безнал:</span>
            {Math.round(getSalary(it.id, 'Безнал', '', 'summa'), userPercent[it.id])} руб.
          </td>
          <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
            <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Наличка:</span>
            {Math.round(
              getSalary(it.id, 'Оплачено', 'Комбинированный', 'summa'),
              userPercent[it.id]
            )}{' '}
            руб.
          </td>
          {calendarType === 'day' ? (
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Сумма:</span>
              {Math.round(getSalary(it.id, '', '', 'summa'), userPercent[it.id])} руб.
            </td>
          ) : null}
          {calendarType === 'day' ? (
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Акция:</span>
              {Math.round(getSalary(it.id, '', '', 'discountonly'), userPercent[it.id])} руб.
            </td>
          ) : null}
        </>
      ) : null}
      <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Вал:</span>
        {Math.round(getSalary(it.id), userPercent[it.id])} руб.
      </td>
      {checkIsBookkeper ? (
        <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
          <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Зарплата:</span>
          {userPercent[it.id]
            ? Math.round(applyDiscount(getSalary(it.id), userPercent[it.id], it.id))
            : 0}{' '}
          руб.
        </td>
      ) : null}
    </tr>
  )
}

export default SalaryTableComponent
