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
  checkIsBookkeper,
  onChangePercent,
  calendarType,
  checkIsShinomontazh,
  onChangeOformlen,
  onChangeNalog,
  onChangeCardSum,
  onEmployeeClick,
  activeMonth,
  person
}) => {
  const dispatch = useDispatch()
  const [saved, setSaved] = useState(false)
  const [savedOformlen, setSavedOformlen] = useState(false)
  const [savedNalog, setSavedNalog] = useState(false)
  const [savedCardSum, setSavedCardSum] = useState(false)
  const [totalAdvance, setTotalAdvance] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [totalFines, setTotalFines] = useState(0)

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

  const [showPercentOverlay, setShowPercentOverlay] = useState(false)
  const [overlayIsShown, setOverlayIsShown] = useState(false)

  useEffect(() => {
    if (!overlayIsShown && person.percent) {
      setShowPercentOverlay(true)
      setOverlayIsShown(true)
    }
  }, [person.percent])

  if (!person) {
    return null
  }

  return (
    <tr className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0">
      <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Имя:</span>
        <button
          type="button"
          value={person.employeeId}
          onClick={onEmployeeClick}
          className="text-left hover:underline"
        >
          {person.employeeName}
        </button>
      </td>

      {checkIsBookkeper ? (
        <>
          {calendarType === 'month' ? (
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
              <button
                type="button"
                onClick={onEmployeeClick}
                value={person.employeeId}
                className="lg:hidden px-2 py-1 text-xs font-bold uppercase"
              >
                Рабочие дни:
              </button>
              <WorkingDaysCell value={person.uniqueWorkDaysCount} />
            </td>
          ) : null}
          <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
            <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Вал:</span>
            {person.total.all.totalCost} р.
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
                value={person.percent}
                onChange={(e) => {
                  onChangePercent(e)
                  setOverlayIsShown(true)
                }}
                name={person.employeeId}
              />
              <button
                type="button"
                onClick={() => savePercent('percent', person.employeeId, person.percent)}
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
            <span className="flex">
              <select
                className="w-full border-solid border-4 border-light-main-500"
                value={person.oformlen}
                defaultValue="false"
                onChange={onChangeOformlen}
                name={person.employeeId}
              >
                <option value="true">Да</option>
                <option value="false">Нет</option>
              </select>
              <button
                type="button"
                onClick={() => savePercent('oformlen', person.employeeId, person.oformlen)}
                className="img__save-wrap ml-2 text-sm p-1 px-2 bg-gray-200 text-gray-700 hover:text-gray-600 hover:bg-gray-400 rounded-lg"
              >
                {savedOformlen ? '✓' : <ImageSave />}
              </button>
            </span>
          </td>
          <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
            <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Зарплата:</span>
            {person.salary} р.
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
                    value={person.oformlenNalog}
                    onChange={onChangeNalog}
                    name={person.employeeId}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      savePercent('oformlenNalog', person.employeeId, person.oformlenNalog)
                    }
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
                    value={person.cardSum}
                    onChange={onChangeCardSum}
                    name={person.employeeId}
                  />
                  <button
                    type="button"
                    onClick={() => savePercent('cardSum', person.employeeId, person.cardSum)}
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
                  employeeId={person.employeeId}
                  totalAdvance={totalAdvance}
                  setTotalAdvance={setTotalAdvance}
                  payments={[]}
                />
              </td>
              <td
                id="nalog"
                className="w-auto table-cell lg:w-auto p-2 text-gray-800 text-left border border-b relative lg:static"
              >
                <SalaryCell
                  currentDate={activeMonth}
                  employeeId={person.employeeId}
                  totalAdvance={totalExpenses}
                  setTotalAdvance={setTotalExpenses}
                  payments={[]}
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
                  employeeId={person.employeeId}
                  totalAdvance={totalFines}
                  setTotalAdvance={setTotalFines}
                  payments={[]}
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
            {person.total.terminal.totalCost} р.
          </td>
          <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
            <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Безнал:</span>
            {person.total.cashless.totalCost} р.
          </td>
          <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
            <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Наличка:</span>
            {person.total.cash.totalCost} р.
          </td>
          {calendarType === 'day' ? (
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Сумма:</span>
              {person.total.all.totalCost} р.
            </td>
          ) : null}
          {calendarType === 'day' ? (
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Акция:</span>
              {person.total.discount.totalCost} р.
            </td>
          ) : null}
          <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
            <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Вал:</span>
            {person.total.all.totalCost} р.
          </td>
        </>
      ) : null}

      {checkIsBookkeper ? (
        <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
          <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Остаток:</span>
          <BalanceCell value={person.rest} />
        </td>
      ) : null}
    </tr>
  )
}

export default SalaryTableComponent
