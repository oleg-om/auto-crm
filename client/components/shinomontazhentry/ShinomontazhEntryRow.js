import React from 'react'
import cx from 'classnames'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import timeList from '../../lists/time-list'
import statusList from '../../lists/razval.statuses'
// import { isoDateWithoutTimeZone } from './ShinomontazhEntryCreate'

export const arrayFromNumber = (num, type) =>
  [...new Array(Number(num || 1))].fill(1).map((it, index) => {
    return { num: index + 1, name: `${type}${num}` }
  })

export const getTime = (dt) => {
  if (dt) {
    const hours = dt.slice(11, 13) || null

    return `${hours}:00`
  }
  // if (hours) {
  //   if (hours < 10) {
  //     return `0${hours}:00`
  //   }
  //   return `${hours}:00`
  // }
  return dt
}

const getEntryStyle = (item, activeAdress) => {
  return {
    'bg-yellow-400 hover:bg-yellow-500': item.status === statusList[0],
    'bg-purple-400 hover:bg-purple-500': item.access === 'false',
    'bg-green-500 hover:bg-green-600': item.status === 'Работа выполнена',
    'bg-green-400 hover:bg-green-500':
      item.status === 'Оплачено' || item.status === 'Терминал' || item.status === 'Безнал',
    // 'bg-red-400 hover:bg-red-500': item.status === 'Отмена',
    'bg-red-400 hover:bg-red-500':
      item.place === activeAdress &&
      (item.status === statusList[2] ||
        item.status === statusList[3] ||
        item.status === statusList[4]),
    'bg-blue-400 hover:bg-blue-500':
      item.status === statusList[0] &&
      item.employeeplace !== activeAdress &&
      item.place === activeAdress
  }
}

const ShinomontazhEntryRow = (props) => {
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  const openModal = (item, type) => {
    props.editItem(item, type, props.adress)
  }
  const openCreateModal = (time, address, type, activeAdress, postNumber) => {
    props.createItem(time, address, type, activeAdress, postNumber)
  }
  const openDeleteModal = (item, type) => {
    props.openAccess(item, type)
  }

  // const formatDate = (d) => {
  //   if (d) {
  //     const dt = new Date(d)
  //     // return `${dt.getFullYear()}-${(dt.getMonth() + 1).toString().replace(/^(\d)$/, '0$1')}-${dt
  //     //   .getDate()
  //     //   .toString()
  //     //   .replace(/^(\d)$/, '0$1')}`
  //     return isoDateWithoutTimeZone(dt)
  //   }
  //   return d
  // }

  // const dateActive = formatDate(props.activeDay)

  if (props.viewType === 'classic' || !props.viewType) {
    return (
      <div className="mx-2 mb-6 relative">
        <div
          className={cx('rounded-t bg-white p-1 text-center top-0 sticky border border-gray-300', {
            'bg-white': props.activePlace === 'false',
            'bg-orange-500 text-white': props.activePlace === 'true'
          })}
        >
          <h4 className="font-semibold text-center">{props.adress.name}</h4>
        </div>
        <table className="border-collapse w-full">
          <thead>
            <tr className="sticky top-34 border border-b border-gray-300">
              <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                Время
              </th>
              {props.adress.shinomontazh === 'true' ? (
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  {props.preentryTypeRus}
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {timeList.map((it) => (
              <tr
                key={it}
                className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0"
              >
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                  {it}
                </td>
                {props.adress[props.preentryType] === 'true' ? (
                  <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                    {props.dataList
                      .filter(
                        (item) =>
                          //    formatDate(item?.dateStart || item?.datePreentry) === dateActive &&
                          getTime(item?.dateStart || item?.datePreentry) === it &&
                          item.place === props.adress.id
                      )
                      .map((item) => (
                        <div key={item.id}>
                          {/* item date: {formatDate(item?.dateStart || item?.datePreentry)} <br />
                          dateActive: {dateActive} <br />
                          time : {getTime(item?.dateStart || item?.datePreentry)} */}
                          <br />
                          {props.activeRole.includes('boss') ? (
                            <button
                              title={item.status}
                              className={cx(
                                'rounded p-1 mb-2 text-sm',
                                getEntryStyle(item, props?.activeAdress)
                              )}
                              type="button"
                              id={item.id}
                              onClick={
                                item?.access === 'false'
                                  ? () => openDeleteModal(item, props.preentryTypeRus)
                                  : () => openModal(item, props.preentryTypeRus)
                              }
                            >
                              {item?.access === 'false' ? (
                                <p>Запись недоступна</p>
                              ) : (
                                <div>
                                  <p>{`${item.mark} ${item.model}`}</p>
                                  <p>{item.phone || item.regnumber}</p>
                                </div>
                              )}
                            </button>
                          ) : (
                            <button
                              title={item.status}
                              className={cx(
                                'rounded p-1 mb-2 text-sm',
                                getEntryStyle(item, props?.activeAdress)
                              )}
                              type="button"
                              id={item.id}
                              onClick={
                                item?.access === 'false'
                                  ? () => openDeleteModal(item, props.preentryTypeRus)
                                  : () => openModal(item, props.preentryTypeRus)
                              }
                            >
                              {item?.access === 'false' ? (
                                <p>Запись недоступна</p>
                              ) : (
                                <div>
                                  <p>{`${item.mark} ${item.model}`}</p>
                                  <p>{item.phone}</p>
                                </div>
                              )}
                            </button>
                          )}
                        </div>
                      ))}
                    <div>
                      {props.dataList.filter(
                        (item) =>
                          getTime(item?.dateStart || item?.datePreentry) === it &&
                          item.place === props.adress.id &&
                          item.status !== statusList[2] &&
                          item.status !== statusList[3] &&
                          item.status !== statusList[4]
                      ).length < Number(props.adress[`${props.preentryType}quantity`]) &&
                      props.dataList.filter(
                        (item) =>
                          getTime(item?.dateStart || item?.datePreentry) === it &&
                          item.place === props.adress.id &&
                          item.access === 'false'
                      ).length !== 1 ? (
                        <button
                          type="button"
                          onClick={() =>
                            openCreateModal(
                              it,
                              props.adress,
                              props.preentryTypeRus,
                              props.activeAdress
                            )
                          }
                          className="shadow px-2 bg-green-400 text-white text-l hover:bg-green-600 hover:text-white rounded-lg"
                        >
                          +
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => notify('Вы больше не можете добавить запись на это время')}
                          className="shadow px-2 bg-gray-400 text-white text-l hover:bg-gray-600 hover:text-white rounded-lg"
                        >
                          +
                        </button>
                      )}
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  // if new column type

  return (
    <div className="mx-2 mb-6 relative">
      <div
        className={cx(
          'rounded-t bg-white p-1 text-center top-0 sticky border border-gray-300 z-10',
          {
            'bg-white': props.activePlace === 'false',
            'bg-orange-500 text-white': props.activePlace === 'true'
          }
        )}
      >
        <h4 className="font-semibold text-center">{props.adress.name}</h4>
      </div>
      <table className="border-collapse w-full">
        <thead>
          <tr className="sticky top-34 border border-b border-gray-300">
            <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Время
            </th>
            {props.adress[props.preentryType] === 'true' ? (
              <>
                {arrayFromNumber(props[`${props.preentryType}quantity`]).map((it) => (
                  <th
                    key={it.name}
                    className={cx(
                      'p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell',
                      {
                        'border-l-4': it.num === 1
                      }
                    )}
                  >
                    {props.preentryTypeRus} №{it.num}
                  </th>
                ))}
              </>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {timeList.map((it) => (
            <tr
              key={it}
              className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0"
            >
              <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                {it}
              </td>
              {props.adress[props.preentryType] === 'true' ? (
                <>
                  {arrayFromNumber(props[`${props.preentryType}quantity`]).map((raz) => (
                    <td
                      key={`${it}-${raz.num}`}
                      className={cx(
                        'w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static',
                        {
                          'border-l-4': raz.num === 1
                        }
                      )}
                    >
                      {props.dataList
                        .filter(
                          (item) =>
                            //  item.date === dateActive &&
                            //  item.time === it &&
                            getTime(item?.dateStart || item?.datePreentry) === it &&
                            item.place === props.adress.id &&
                            (Number(item.box) === Number(raz.num) || (!item.box && raz.num === 1))
                        )
                        .map((item) => (
                          <div key={item.id}>
                            {props.activeRole.includes('boss') ? (
                              <button
                                title={item.status}
                                className={cx(
                                  'rounded p-1 mb-2 text-sm',
                                  getEntryStyle(item, props?.activeAdress)
                                )}
                                type="button"
                                id={item.id}
                                onClick={
                                  item.access === 'false'
                                    ? () => openDeleteModal(item, props.preentryTypeRus)
                                    : () => openModal(item, props.preentryTypeRus)
                                }
                              >
                                {item.access === 'false' ? (
                                  <p>Запись недоступна</p>
                                ) : (
                                  <div>
                                    <p>{`${item.mark} ${item.model}`}</p>
                                    <p>{item.phone}</p>
                                  </div>
                                )}
                              </button>
                            ) : (
                              <button
                                title={item.status}
                                className={cx(
                                  'rounded p-1 mb-2 text-sm',
                                  getEntryStyle(item, props?.activeAdress)
                                )}
                                type="button"
                                id={item.id}
                                onClick={
                                  item.access === 'false'
                                    ? () => openDeleteModal(item, props.preentryTypeRus)
                                    : () => openModal(item, props.preentryTypeRus)
                                }
                              >
                                {item.access === 'false' ? (
                                  <p>Запись недоступна</p>
                                ) : (
                                  <div>
                                    <p>{`${item.mark} ${item.model}`}</p>
                                    <p>{item.phone}</p>
                                  </div>
                                )}
                              </button>
                            )}
                          </div>
                        ))}
                      <div>
                        {props.dataList.filter(
                          (item) =>
                            getTime(item?.dateStart || item?.datePreentry) === it &&
                            item.place === props.adress.id &&
                            item.status !== statusList[2] &&
                            item.status !== statusList[3] &&
                            item.status !== statusList[4] &&
                            (Number(item.box) === Number(raz.num) || (!item.box && raz.num === 1))
                        ).length < 1 &&
                        props.dataList.filter(
                          (item) =>
                            getTime(item?.dateStart || item?.datePreentry) === it &&
                            item.place === props.adress.id &&
                            item.access === 'false' &&
                            (Number(item.box) === Number(raz.num) || (!item.box && raz.num === 1))
                        ).length !== 1 ? (
                          <button
                            type="button"
                            onClick={() =>
                              openCreateModal(
                                it,
                                props.adress,
                                props.preentryTypeRus,
                                props.activeAdress,
                                raz.num
                              )
                            }
                            className="shadow px-2 bg-green-400 text-white text-l hover:bg-green-600 hover:text-white rounded-lg"
                          >
                            +
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              notify('Вы больше не можете добавить запись на это время')
                            }
                            className="shadow px-2 bg-gray-400 text-white text-l hover:bg-gray-600 hover:text-white rounded-lg"
                          >
                            +
                          </button>
                        )}
                      </div>
                    </td>
                  ))}
                </>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ShinomontazhEntryRow
