import React from 'react'
import cx from 'classnames'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import timeList from '../../lists/time-list'
import statusList from '../../lists/razval.statuses'

export const arrayFromNumber = (num, type) =>
  [...new Array(Number(num))].fill(1).map((it, index) => {
    return { num: index + 1, name: `${type}${num}` }
  })

const RazvalRow = (props) => {
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
  const dateActive = `${props.activeDay.getFullYear()}-${(props.activeDay.getMonth() + 1)
    .toString()
    .replace(/^(\d)$/, '0$1')}-${props.activeDay
    .getDate()
    .toString()
    .replace(/^(\d)$/, '0$1')}`

  if (props.razvalAndOilType === 'classic' || !props.razvalAndOilType) {
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
              {props.adress.razval === 'true' ? (
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Развал
                </th>
              ) : null}
              {props.adress.oil === 'true' ? (
                <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Замена масла
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
                {props.adress.razval === 'true' ? (
                  <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                    {props.razvalList
                      .filter(
                        (item) =>
                          item.date === dateActive &&
                          item.time === it &&
                          item.place === props.adress.id
                      )
                      .map((item) => (
                        <div key={item.id}>
                          {props.activeRole.includes('boss') ? (
                            <button
                              title={item.status}
                              className={cx('rounded p-1 mb-2 text-sm', {
                                'bg-yellow-400 hover:bg-yellow-500': item.status === statusList[0],
                                'bg-purple-400 hover:bg-purple-500': item.access === 'false',
                                'bg-green-400 hover:bg-green-500': item.status === statusList[1],
                                'bg-red-400 hover:bg-red-500':
                                  item.status === statusList[2] ||
                                  item.status === statusList[3] ||
                                  item.status === statusList[4],
                                'bg-blue-400 hover:bg-blue-500':
                                  item.status === statusList[0] &&
                                  item.employeeplace !== props.activeAdress &&
                                  item.place === props.activeAdress
                              })}
                              type="button"
                              id={item.id}
                              onClick={
                                item.access === 'true'
                                  ? () => openModal(item, 'Развал-схождение')
                                  : () => openDeleteModal(item, 'Развал-схождение')
                              }
                            >
                              {item.access === 'true' ? (
                                <div>
                                  <p>{`${item.mark} ${item.model}`}</p>
                                  <p>{item.phone}</p>
                                </div>
                              ) : (
                                <p>Запись недоступна</p>
                              )}
                            </button>
                          ) : (
                            <button
                              title={item.status}
                              className={cx('rounded p-1 mb-2 text-sm', {
                                'bg-gray-400 hover:bg-gray-500': item.place !== props.activeAdress,
                                'bg-purple-400 hover:bg-purple-500': item.access === 'false',
                                'bg-yellow-400 hover:bg-yellow-500':
                                  item.status === statusList[0] &&
                                  item.place === props.activeAdress,
                                'bg-green-400 hover:bg-green-500':
                                  item.status === statusList[1] &&
                                  item.place === props.activeAdress,
                                'bg-red-400 hover:bg-red-500':
                                  item.place === props.activeAdress &&
                                  (item.status === statusList[2] ||
                                    item.status === statusList[3] ||
                                    item.status === statusList[4]),
                                'bg-blue-400 hover:bg-blue-500':
                                  item.status === statusList[0] &&
                                  item.employeeplace !== props.activeAdress &&
                                  item.place === props.activeAdress &&
                                  item.access === 'true'
                              })}
                              type="button"
                              id={item.id}
                              onClick={
                                item.access === 'true'
                                  ? () => openModal(item, 'Развал-схождение')
                                  : () => openDeleteModal(item, 'Развал-схождение')
                              }
                            >
                              {item.access === 'true' ? (
                                <div>
                                  <p>{`${item.mark} ${item.model}`}</p>
                                  <p>{item.phone}</p>
                                </div>
                              ) : (
                                <p>Запись недоступна</p>
                              )}
                            </button>
                          )}
                        </div>
                      ))}
                    <div>
                      {props.razvalList.filter(
                        (item) =>
                          item.date === dateActive &&
                          item.time === it &&
                          item.place === props.adress.id &&
                          item.status !== statusList[2] &&
                          item.status !== statusList[3] &&
                          item.status !== statusList[4]
                      ).length !== Number(props.adress.razvalquantity) &&
                      props.razvalList.filter(
                        (item) =>
                          item.date === dateActive &&
                          item.time === it &&
                          item.place === props.adress.id &&
                          item.access === 'false'
                      ).length !== 1 ? (
                        <button
                          type="button"
                          onClick={() =>
                            openCreateModal(
                              it,
                              props.adress,
                              'Развал-схождение',
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
                {props.adress.oil === 'true' ? (
                  <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                    {props.oilList
                      .filter(
                        (item) =>
                          item.date === dateActive &&
                          item.time === it &&
                          item.place === props.adress.id
                      )
                      .map((item) => (
                        <div key={item.id}>
                          {props.activeRole.includes('boss') ? (
                            <button
                              title={item.status}
                              className={cx('rounded p-1 mb-2 text-sm', {
                                'bg-yellow-400 hover:bg-yellow-500': item.status === statusList[0],
                                'bg-purple-400 hover:bg-purple-500': item.access === 'false',
                                'bg-green-400 hover:bg-green-500': item.status === statusList[1],
                                'bg-red-400 hover:bg-red-500':
                                  item.status === statusList[2] ||
                                  item.status === statusList[3] ||
                                  item.status === statusList[4],
                                'bg-blue-400 hover:bg-blue-500':
                                  item.status === statusList[0] &&
                                  item.employeeplace !== props.activeAdress &&
                                  item.place === props.activeAdress
                              })}
                              type="button"
                              id={item.id}
                              onClick={
                                item.access === 'true'
                                  ? () => openModal(item, 'Замена масла')
                                  : () => openDeleteModal(item, 'Замена масла')
                              }
                            >
                              {item.access === 'true' ? (
                                <div>
                                  <p>{`${item.mark} ${item.model}`}</p>
                                  <p>{item.phone}</p>
                                </div>
                              ) : (
                                <p>Запись недоступна</p>
                              )}
                            </button>
                          ) : (
                            <button
                              title={item.status}
                              className={cx('rounded p-1 mb-2 text-sm', {
                                'bg-gray-400 hover:bg-gray-500': item.place !== props.activeAdress,
                                'bg-purple-400 hover:bg-purple-500': item.access === 'false',
                                'bg-yellow-400 hover:bg-yellow-500':
                                  item.status === statusList[0] &&
                                  item.place === props.activeAdress,
                                'bg-green-400 hover:bg-green-500':
                                  item.status === statusList[1] &&
                                  item.place === props.activeAdress,
                                'bg-red-400 hover:bg-red-500':
                                  item.place === props.activeAdress &&
                                  (item.status === statusList[2] ||
                                    item.status === statusList[3] ||
                                    item.status === statusList[4]),
                                'bg-blue-400 hover:bg-blue-500':
                                  item.status === statusList[0] &&
                                  item.employeeplace !== props.activeAdress &&
                                  item.place === props.activeAdress &&
                                  item.access === 'true'
                              })}
                              type="button"
                              id={item.id}
                              onClick={
                                item.access === 'true'
                                  ? () => openModal(item, 'Замена масла')
                                  : () => openDeleteModal(item, 'Замена масла')
                              }
                            >
                              {item.access === 'true' ? (
                                <div>
                                  <p>{`${item.mark} ${item.model}`}</p>
                                  <p>{item.phone}</p>
                                </div>
                              ) : (
                                <p>Запись недоступна</p>
                              )}
                            </button>
                          )}
                        </div>
                      ))}
                    <div>
                      {props.oilList.filter(
                        (item) =>
                          item.date === dateActive &&
                          item.time === it &&
                          item.place === props.adress.id &&
                          item.status !== statusList[2] &&
                          item.status !== statusList[3] &&
                          item.status !== statusList[4]
                      ).length !== Number(props.adress.oilquantity) &&
                      props.oilList.filter(
                        (item) =>
                          item.date === dateActive &&
                          item.time === it &&
                          item.place === props.adress.id &&
                          item.access === 'false'
                      ).length !== 1 ? (
                        <button
                          type="button"
                          onClick={() =>
                            openCreateModal(it, props.adress, 'Замена масла', props.activeAdress)
                          }
                          className="shadow px-2 bg-blue-400 text-white text-l hover:bg-blue-600 hover:text-white rounded-lg"
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

  console.log(' props.adress: ', props.adress)

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
            {props.adress.razval === 'true' ? (
              <>
                {arrayFromNumber(props.razvalquantity).map((it) => (
                  <th
                    key={it.name}
                    className={cx(
                      'p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell',
                      {
                        'border-l-4': it.num === 1
                      }
                    )}
                  >
                    Развал №{it.num}
                  </th>
                ))}
              </>
            ) : null}
            {props.adress.oil === 'true' ? (
              <>
                {arrayFromNumber(props.oilquantity).map((it) => (
                  <th
                    key={it.name}
                    className={cx(
                      'p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell',
                      {
                        'border-l-4': it.num === 1
                      }
                    )}
                  >
                    Замена масла №{it.num}
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
              {props.adress.razval === 'true' ? (
                <>
                  {arrayFromNumber(props.razvalquantity).map((raz) => (
                    <td
                      key={`${it}-${raz.num}`}
                      className={cx(
                        'w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static',
                        {
                          'border-l-4': raz.num === 1
                        }
                      )}
                    >
                      {props.razvalList
                        .filter(
                          (item) =>
                            item.date === dateActive &&
                            item.time === it &&
                            item.place === props.adress.id &&
                            (Number(item.post) === Number(raz.num) || (!item.post && raz.num === 1))
                        )
                        .map((item) => (
                          <div key={item.id}>
                            {props.activeRole.includes('boss') ? (
                              <button
                                title={item.status}
                                className={cx('rounded p-1 mb-2 text-sm', {
                                  'bg-yellow-400 hover:bg-yellow-500':
                                    item.status === statusList[0],
                                  'bg-purple-400 hover:bg-purple-500': item.access === 'false',
                                  'bg-green-400 hover:bg-green-500': item.status === statusList[1],
                                  'bg-red-400 hover:bg-red-500':
                                    item.status === statusList[2] ||
                                    item.status === statusList[3] ||
                                    item.status === statusList[4],
                                  'bg-blue-400 hover:bg-blue-500':
                                    item.status === statusList[0] &&
                                    item.employeeplace !== props.activeAdress &&
                                    item.place === props.activeAdress
                                })}
                                type="button"
                                id={item.id}
                                onClick={
                                  item.access === 'true'
                                    ? () => openModal(item, 'Развал-схождение')
                                    : () => openDeleteModal(item, 'Развал-схождение')
                                }
                              >
                                {item.access === 'true' ? (
                                  <div>
                                    <p>{`${item.mark} ${item.model}`}</p>
                                    <p>{item.phone}</p>
                                  </div>
                                ) : (
                                  <p>Запись недоступна</p>
                                )}
                              </button>
                            ) : (
                              <button
                                title={item.status}
                                className={cx('rounded p-1 mb-2 text-sm', {
                                  'bg-gray-400 hover:bg-gray-500':
                                    item.place !== props.activeAdress,
                                  'bg-purple-400 hover:bg-purple-500': item.access === 'false',
                                  'bg-yellow-400 hover:bg-yellow-500':
                                    item.status === statusList[0] &&
                                    item.place === props.activeAdress,
                                  'bg-green-400 hover:bg-green-500':
                                    item.status === statusList[1] &&
                                    item.place === props.activeAdress,
                                  'bg-red-400 hover:bg-red-500':
                                    item.place === props.activeAdress &&
                                    (item.status === statusList[2] ||
                                      item.status === statusList[3] ||
                                      item.status === statusList[4]),
                                  'bg-blue-400 hover:bg-blue-500':
                                    item.status === statusList[0] &&
                                    item.employeeplace !== props.activeAdress &&
                                    item.place === props.activeAdress &&
                                    item.access === 'true'
                                })}
                                type="button"
                                id={item.id}
                                onClick={
                                  item.access === 'true'
                                    ? () => openModal(item, 'Развал-схождение')
                                    : () => openDeleteModal(item, 'Развал-схождение')
                                }
                              >
                                {item.access === 'true' ? (
                                  <div>
                                    <p>{`${item.mark} ${item.model}`}</p>
                                    <p>{item.phone}</p>
                                  </div>
                                ) : (
                                  <p>Запись недоступна</p>
                                )}
                              </button>
                            )}
                          </div>
                        ))}
                      <div>
                        {props.razvalList.filter(
                          (item) =>
                            item.date === dateActive &&
                            item.time === it &&
                            item.place === props.adress.id &&
                            item.status !== statusList[2] &&
                            item.status !== statusList[3] &&
                            item.status !== statusList[4] &&
                            (Number(item.post) === Number(raz.num) || (!item.post && raz.num === 1))
                        ).length < 1 &&
                        props.razvalList.filter(
                          (item) =>
                            item.date === dateActive &&
                            item.time === it &&
                            item.place === props.adress.id &&
                            item.access === 'false' &&
                            (Number(item.post) === Number(raz.num) || (!item.post && raz.num === 1))
                        ).length !== 1 ? (
                          <button
                            type="button"
                            onClick={() =>
                              openCreateModal(
                                it,
                                props.adress,
                                'Развал-схождение',
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
              {props.adress.oil === 'true' ? (
                <>
                  {arrayFromNumber(props.oilquantity).map((oill) => (
                    <td
                      key={`${it}-${oill.num}`}
                      className={cx(
                        'w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static',
                        {
                          'border-l-4': oill.num === 1
                        }
                      )}
                    >
                      {props.oilList

                        .filter(
                          (item) =>
                            item.date === dateActive &&
                            item.time === it &&
                            item.place === props.adress.id &&
                            (Number(item.post) === Number(oill.num) ||
                              (!item.post && oill.num === 1))
                        )
                        .map((item) => (
                          <div key={item.id}>
                            {props.activeRole.includes('boss') ? (
                              <button
                                title={item.status}
                                className={cx('rounded p-1 mb-2 text-sm', {
                                  'bg-yellow-400 hover:bg-yellow-500':
                                    item.status === statusList[0],
                                  'bg-purple-400 hover:bg-purple-500': item.access === 'false',
                                  'bg-green-400 hover:bg-green-500': item.status === statusList[1],
                                  'bg-red-400 hover:bg-red-500':
                                    item.status === statusList[2] ||
                                    item.status === statusList[3] ||
                                    item.status === statusList[4],
                                  'bg-blue-400 hover:bg-blue-500':
                                    item.status === statusList[0] &&
                                    item.employeeplace !== props.activeAdress &&
                                    item.place === props.activeAdress
                                })}
                                type="button"
                                id={item.id}
                                onClick={
                                  item.access === 'true'
                                    ? () => openModal(item, 'Замена масла')
                                    : () => openDeleteModal(item, 'Замена масла')
                                }
                              >
                                {item.access === 'true' ? (
                                  <div>
                                    <p>{`${item.mark} ${item.model}`}</p>
                                    <p>{item.phone}</p>
                                  </div>
                                ) : (
                                  <p>Запись недоступна</p>
                                )}
                              </button>
                            ) : (
                              <button
                                title={item.status}
                                className={cx('rounded p-1 mb-2 text-sm', {
                                  'bg-gray-400 hover:bg-gray-500':
                                    item.place !== props.activeAdress,
                                  'bg-purple-400 hover:bg-purple-500': item.access === 'false',
                                  'bg-yellow-400 hover:bg-yellow-500':
                                    item.status === statusList[0] &&
                                    item.place === props.activeAdress,
                                  'bg-green-400 hover:bg-green-500':
                                    item.status === statusList[1] &&
                                    item.place === props.activeAdress,
                                  'bg-red-400 hover:bg-red-500':
                                    item.place === props.activeAdress &&
                                    (item.status === statusList[2] ||
                                      item.status === statusList[3] ||
                                      item.status === statusList[4]),
                                  'bg-blue-400 hover:bg-blue-500':
                                    item.status === statusList[0] &&
                                    item.employeeplace !== props.activeAdress &&
                                    item.place === props.activeAdress &&
                                    item.access === 'true'
                                })}
                                type="button"
                                id={item.id}
                                onClick={
                                  item.access === 'true'
                                    ? () => openModal(item, 'Замена масла')
                                    : () => openDeleteModal(item, 'Замена масла')
                                }
                              >
                                {item.access === 'true' ? (
                                  <div>
                                    <p>{`${item.mark} ${item.model}`}</p>
                                    <p>{item.phone}</p>
                                  </div>
                                ) : (
                                  <p>Запись недоступна</p>
                                )}
                              </button>
                            )}
                          </div>
                        ))}
                      {/* {props.oilList
                        .filter(
                          (item) =>
                            item.date === dateActive &&
                            item.time === it &&
                            item.place === props.adress.id &&
                            (Number(item.post) === Number(oill.num) ||
                              (!item.post && oill.num === 1))
                        )
                        .map((item) => (
                          <div key={item.id}>
                            {props.activeRole.includes('boss') ? (
                              <button
                                title={item.status}
                                className={cx('rounded p-1 mb-2 text-sm', {
                                  'bg-yellow-400 hover:bg-yellow-500':
                                    item.status === statusList[0],
                                  'bg-purple-400 hover:bg-purple-500': item.access === 'false',
                                  'bg-green-400 hover:bg-green-500': item.status === statusList[1],
                                  'bg-red-400 hover:bg-red-500':
                                    item.status === statusList[2] ||
                                    item.status === statusList[3] ||
                                    item.status === statusList[4],
                                  'bg-blue-400 hover:bg-blue-500':
                                    item.status === statusList[0] &&
                                    item.employeeplace !== props.activeAdress &&
                                    item.place === props.activeAdress
                                })}
                                type="button"
                                id={item.id}
                                onClick={
                                  item.access === 'true'
                                    ? () => openModal(item, 'Замена масла')
                                    : () => openDeleteModal(item, 'Замена масла')
                                }
                              >
                                {item.access === 'true' ? (
                                  <div>
                                    <p>{`${item.mark} ${item.model}`}</p>
                                    <p>{item.phone}</p>
                                  </div>
                                ) : (
                                  <p>Запись недоступна</p>
                                )}
                              </button>
                            ) : (
                              <button
                                title={item.status}
                                className={cx('rounded p-1 mb-2 text-sm', {
                                  'bg-gray-400 hover:bg-gray-500':
                                    item.place !== props.activeAdress,
                                  'bg-purple-400 hover:bg-purple-500': item.access === 'false',
                                  'bg-yellow-400 hover:bg-yellow-500':
                                    item.status === statusList[0] &&
                                    item.place === props.activeAdress,
                                  'bg-green-400 hover:bg-green-500':
                                    item.status === statusList[1] &&
                                    item.place === props.activeAdress,
                                  'bg-red-400 hover:bg-red-500':
                                    item.place === props.activeAdress &&
                                    (item.status === statusList[2] ||
                                      item.status === statusList[3] ||
                                      item.status === statusList[4]),
                                  'bg-blue-400 hover:bg-blue-500':
                                    item.status === statusList[0] &&
                                    item.employeeplace !== props.activeAdress &&
                                    item.place === props.activeAdress &&
                                    item.access === 'true'
                                })}
                                type="button"
                                id={item.id}
                                onClick={
                                  item.access === 'true'
                                    ? () => openModal(item, 'Замена масла')
                                    : () => openDeleteModal(item, 'Замена масла')
                                }
                              >
                                {item.access === 'true' ? (
                                  <div>
                                    <p>{`${item.mark} ${item.model}`}</p>
                                    <p>{item.phone}</p>
                                  </div>
                                ) : (
                                  <p>Запись недоступна</p>
                                )}
                              </button>
                            )}
                          </div>
                        ))} */}
                      <div>
                        {props.oilList.filter(
                          (item) =>
                            item.date === dateActive &&
                            item.time === it &&
                            item.place === props.adress.id &&
                            item.status !== statusList[2] &&
                            item.status !== statusList[3] &&
                            item.status !== statusList[4] &&
                            (Number(item.post) === Number(oill.num) ||
                              (!item.post && oill.num === 1))
                        ).length < 1 &&
                        props.oilList.filter(
                          (item) =>
                            item.date === dateActive &&
                            item.time === it &&
                            item.place === props.adress.id &&
                            item.access === 'false' &&
                            (Number(item.post) === Number(oill.num) ||
                              (!item.post && oill.num === 1))
                        ).length !== 1 ? (
                          <button
                            type="button"
                            onClick={() =>
                              openCreateModal(
                                it,
                                props.adress,
                                'Замена масла',
                                props.activeAdress,
                                oill.num
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
                        {/* {props.oilList.filter(
                          (item) =>
                            item.date === dateActive &&
                            item.time === it &&
                            item.place === props.adress.id &&
                            item.status !== statusList[2] &&
                            item.status !== statusList[3] &&
                            item.status !== statusList[4] &&
                            (Number(item.post) === Number(oill.num) ||
                              (!item.post && oill.num === 1))
                        ).length < Number(props.adress.oilquantity) &&
                        props.oilList.filter(
                          (item) =>
                            item.date === dateActive &&
                            item.time === it &&
                            item.place === props.adress.id &&
                            item.access === 'false' &&
                            (Number(item.post) === Number(oill.num) ||
                              (!item.post && oill.num === 1))
                        ).length !== 1 ? (
                          <button
                            type="button"
                            onClick={() =>
                              openCreateModal(
                                it,
                                props.adress,
                                'Замена масла',
                                props.activeAdress,
                                oill.num
                              )
                            }
                            className="shadow px-2 bg-blue-400 text-white text-l hover:bg-blue-600 hover:text-white rounded-lg"
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
                        )} */}
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

export default RazvalRow
