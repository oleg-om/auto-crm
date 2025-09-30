import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { updateEmployee } from '../../../redux/reducers/employees'
import saveIcon from '../../../assets/images/save.png'
import SalaryCell, { REPORT_SALARY_TYPES } from './SalaryCell'
import WorkingDaysCell from './WorkingDaysCell'
import BalanceCell from './BalanceCell'

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
  userCardSum,
  onEmployeeClick,
  activeMonth,
  dateArray,
  empSalaries
}) => {
  const dispatch = useDispatch()

  const applyDiscount = (number, percentOfUser, userId) => {
    const disc = percentOfUser
    const number_percent = (number / 100) * disc

    const nalog = Number(userNalog[userId]) || 0
    const card = Number(userCardSum[userId]) || 0

    const getMinus = (num) => (calendarType === 'month' ? num - nalog - card : num)

    return getMinus(Number(number) - (Number(number) - Number(number_percent)))
  }

  const [saved, setSaved] = useState(false)
  const [savedOformlen, setSavedOformlen] = useState(false)
  const [savedNalog, setSavedNalog] = useState(false)
  const [savedCardSum, setSavedCardSum] = useState(false)
  const [totalAdvance, setTotalAdvance] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [totalFines, setTotalFines] = useState(0)
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

    if (type === 'oformlenNalog') {
      dispatch(updateEmployee(emplId, { oformlenNalog: emplPerc }))
      notify('Поле налог сотрудника сохранено')
      setSavedNalog(true)
    }

    if (type === 'oformlen') {
      dispatch(updateEmployee(emplId, { oformlen: emplPerc }))
      notify('Поле оформление сотрудника сохранено')
      setSavedOformlen(true)
    }

    if (type === 'cardSum') {
      dispatch(updateEmployee(emplId, { cardSum: emplPerc }))
      notify('Поле сумма на карту сохранено')
      setSavedCardSum(true)
    }
  }

  function getUniqueWorkingDays() {
    const dates = dateArray(it.id) || []
    if (!Array.isArray(dates) || !(activeMonth instanceof Date)) {
      return 0
    }

    // Получаем год и месяц из activeMonth (месяцы 0-11)
    const targetYear = activeMonth.getFullYear()
    const targetMonth = activeMonth.getMonth()

    const uniqueDays = new Set()

    dates.forEach((dateStr) => {
      const date = new Date(dateStr)

      // Проверяем совпадение года и месяца
      if (date.getFullYear() === targetYear && date.getMonth() === targetMonth) {
        // Формируем ключ дня без времени
        const dayKey = date.toISOString().split('T')[0] // "YYYY-MM-DD"
        uniqueDays.add(dayKey)
      }
    })

    return uniqueDays.size
  }

  const [showPercentOverlay, setShowPercentOverlay] = useState(false)
  const [overlayIsShown, setOverlayIsShown] = useState(false)

  useEffect(() => {
    if (!overlayIsShown && (userPercent[it.id] || userPercent[it.id]?.length)) {
      setShowPercentOverlay(true)
      setOverlayIsShown(true)
    }
  }, [userPercent[it.id]])

  return (
    <tr className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0">
      <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Имя:</span>
        <button
          type="button"
          key={it.id}
          onClick={onEmployeeClick}
          value={it.id}
          className="text-left hover:underline"
        >
          {it.name} {it.surname}
        </button>
      </td>

      {checkIsBookkeper ? (
        <>
          {calendarType === 'month' ? (
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
              <button
                type="button"
                onClick={onEmployeeClick}
                className="lg:hidden px-2 py-1 text-xs font-bold uppercase"
              >
                Рабочие дни:
              </button>
              <WorkingDaysCell value={getUniqueWorkingDays()} />
            </td>
          ) : null}
          <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
            <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Вал:</span>
            {Math.round(getSalary(it.id), userPercent[it.id])} р.
          </td>
          <td
            id="procent"
            className="w-auto table-cell lg:w-auto p-2 text-gray-800 text-left border border-b relative lg:static"
          >
            <span className="flex relative">
              {showPercentOverlay && (
                <button
                  type="button"
                  className="absolute top-0 right-0 bottom-0 left-0 bg-gray-200 cursor-pointer hover:bg-gray-300"
                  onClick={() => setShowPercentOverlay(!showPercentOverlay)}
                />
              )}
              <input
                className="w-full border-solid border-4 border-light-main-500"
                type="number"
                value={userPercent[it.id]}
                onChange={(e) => {
                  onChangePercent(e)
                  setOverlayIsShown(true)
                }}
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
                className="w-full border-solid border-4 border-light-main-500"
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
          <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
            <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Зарплата:</span>
            {userPercent[it.id]
              ? Math.round(
                  applyDiscount(getSalary(it.id), userPercent[it.id], it.id) +
                    (Number(userCardSum[it.id]) || 0)
                )
              : 0}{' '}
            р.
          </td>
          {calendarType === 'month' ? (
            <>
              <td
                id="nalog"
                className="w-auto table-cell lg:w-auto p-2 text-gray-800 text-left border border-b relative lg:static"
              >
                <span className="flex">
                  <input
                    className="w-full border-solid border-4 border-light-main-500"
                    type="number"
                    value={userNalog[it.id]}
                    onChange={onChangeNalog}
                    name={it.id}
                  />
                  <button
                    type="button"
                    onClick={() => savePercent('oformlenNalog', it.id, userNalog[it.id])}
                    className="img__save-wrap ml-2 text-sm py-1 px-4 bg-gray-200 text-gray-700 hover:text-gray-600 hover:bg-gray-400 rounded-lg"
                  >
                    {savedNalog ? '✓' : <ImageSave />}
                  </button>
                </span>
              </td>
              <td
                id="cardSum"
                className="w-auto table-cell lg:w-auto p-2 text-gray-800 text-left border border-b relative lg:static"
              >
                <span className="flex">
                  <input
                    className="w-full border-solid border-4 border-light-main-500"
                    type="number"
                    value={userCardSum[it.id]}
                    onChange={onChangeCardSum}
                    name={it.id}
                  />
                  <button
                    type="button"
                    onClick={() => savePercent('cardSum', it.id, userCardSum[it.id])}
                    className="img__save-wrap ml-2 text-sm py-1 px-4 bg-gray-200 text-gray-700 hover:text-gray-600 hover:bg-gray-400 rounded-lg"
                  >
                    {savedCardSum ? '✓' : <ImageSave />}
                  </button>
                </span>
              </td>
              <td
                id="nalog"
                className="w-auto table-cell lg:w-auto p-2 text-gray-800 text-left border border-b relative lg:static"
              >
                <SalaryCell
                  currentDate={activeMonth}
                  employeeId={it.id}
                  totalAdvance={totalAdvance}
                  setTotalAdvance={setTotalAdvance}
                  payments={empSalaries ? empSalaries[it.id] : []}
                />
              </td>
              <td
                id="nalog"
                className="w-auto table-cell lg:w-auto p-2 text-gray-800 text-left border border-b relative lg:static"
              >
                <SalaryCell
                  currentDate={activeMonth}
                  employeeId={it.id}
                  totalAdvance={totalExpenses}
                  setTotalAdvance={setTotalExpenses}
                  payments={empSalaries ? empSalaries[it.id] : []}
                  data={{
                    name: 'Расходы',
                    singleName: 'расход',
                    type: REPORT_SALARY_TYPES.expenses
                  }}
                />
              </td>
              <td
                id="nalog"
                className="w-auto table-cell lg:w-auto p-2 text-gray-800 text-left border border-b relative lg:static"
              >
                <SalaryCell
                  currentDate={activeMonth}
                  employeeId={it.id}
                  totalAdvance={totalFines}
                  setTotalAdvance={setTotalFines}
                  payments={empSalaries ? empSalaries[it.id] : []}
                  data={{
                    name: 'Штрафы',
                    singleName: 'штраф',
                    type: REPORT_SALARY_TYPES.fine
                  }}
                />
              </td>
            </>
          ) : null}
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
          <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
            <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Вал:</span>
            {Math.round(getSalary(it.id), userPercent[it.id])} руб.
          </td>
        </>
      ) : null}

      {checkIsBookkeper ? (
        <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
          <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Остаток:</span>
          <BalanceCell
            data={it?.data || []}
            prevMonthData={[]}
            value={
              userPercent[it.id]
                ? Math.round(applyDiscount(getSalary(it.id), userPercent[it.id], it.id))
                : 0
            }
          />
        </td>
      ) : null}
    </tr>
  )
}

export default SalaryTableComponent
