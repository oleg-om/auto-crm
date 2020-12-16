import React from 'react'
import cx from 'classnames'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import timeList from '../../lists/time-list'
import statusList from '../../lists/razval.statuses'

const RazvalRow = (props) => {
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  const openModal = (item, type) => {
    props.editItem(item, type, props.adress)
  }
  const openCreateModal = (time, address, type, activeAdress) => {
    props.createItem(time, address, type, activeAdress)
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

  return (
    <div className="mx-2 mb-6">
      <div
        className={cx('rounded-t bg-white p-1 text-center', {
          'bg-white': props.activePlace === 'false',
          'bg-orange-500 text-white': props.activePlace === 'true'
        })}
      >
        <h4 className="font-semibold text-center">{props.adress.name}</h4>
      </div>
      <table className="border-collapse w-full">
        <thead>
          <tr>
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
          {timeList.map((it, id) => (
            <tr
              key={id}
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
                                item.status === statusList[2] || item.status === statusList[3],
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
                                item.status === statusList[0] && item.place === props.activeAdress,
                              'bg-green-400 hover:bg-green-500':
                                item.status === statusList[1] && item.place === props.activeAdress,
                              'bg-red-400 hover:bg-red-500':
                                item.place === props.activeAdress &&
                                (item.status === statusList[2] || item.status === statusList[3]),
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
                        item.status !== statusList[3]
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
                          openCreateModal(it, props.adress, 'Развал-схождение', props.activeAdress)
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
                                item.status === statusList[2] || item.status === statusList[3],
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
                                item.status === statusList[0] && item.place === props.activeAdress,
                              'bg-green-400 hover:bg-green-500':
                                item.status === statusList[1] && item.place === props.activeAdress,
                              'bg-red-400 hover:bg-red-500':
                                item.place === props.activeAdress &&
                                (item.status === statusList[2] || item.status === statusList[3]),
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
                        item.status !== statusList[3]
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

export default RazvalRow
