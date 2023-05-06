import React from 'react'
import cx from 'classnames'

const Employee = ({
  employeeList,
  auth,
  employees,
  checkboxEmployeeChange,
  checkBoxEmpRoleChange,
  dateEnd,
  currentPlace,
  setBox,
  box,
  type
}) => {
  const getRole = () => {
    if (type === 'sto') {
      return 'Работник СТО'
    }
    if (type === 'window') {
      return 'Замена лобовых стекол'
    }
    if (type === 'cond') {
      return 'Кондиционеры'
    }
    return 'sto'
  }

  return (
    <div className="flex flex-col -mx-3">
      {currentPlace && currentPlace.stoboxes ? (
        <div className="px-3 mb-3   w-full">
          <label
            className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
            htmlFor="grid-first-name"
          >
            Бокс
          </label>
          <div className="flex flex-wrap w-full relative">
            {Array.from(
              Array(currentPlace && currentPlace.stoboxes ? currentPlace.stoboxes : 0).keys()
            )
              .map((a) => a + 1)
              .map((it) => (
                <button
                  type="button"
                  onClick={() => setBox(it)}
                  key={it}
                  className={cx('p-6 mx-3 rounded-md  border-gray-800 border mb-3', {
                    'bg-green-200': box === it,
                    'bg-gray-200': box !== it
                  })}
                >
                  <p className="px-4 text-lg">{it}</p>
                </button>
              ))}
          </div>
        </div>
      ) : null}
      <div className="px-3 mb-6  w-full">
        <label
          className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
          htmlFor="grid-first-name"
        >
          Исполнители
        </label>
        <div className="flex flex-col w-full relative">
          <table>
            {employeeList && !dateEnd
              ? employeeList
                  .filter((it) => it.role.includes(getRole()) && it.address.includes(auth.place))
                  .map((item) => (
                    <tr
                      className={cx('mb-3 flex flex-row rounded bg-gray-200 w-full text-lg', {
                        'bg-green-200 hover:bg-green-300': employees.find((it) =>
                          it.id.includes(item.id)
                        ),
                        'bg-gray-100 hover:bg-gray-300': !employees.find((it) =>
                          it.id.includes(item.id)
                        )
                      })}
                      key={item.id}
                      type="button"
                      name={item.id}
                      placeholder={item.numberId}
                      itemName={item.name}
                      itemSurname={item.surname}
                      onClick={checkboxEmployeeChange}
                    >
                      <td className="flex flex-row w-full h-full">
                        <label
                          htmlFor={item.id}
                          placeholder={item.numberId}
                          itemName={item.name}
                          itemSurname={item.surname}
                          className="w-full h-full p-2 text-left inline-block"
                        >
                          <input
                            className="mr-4"
                            key={item.id}
                            name={item.id}
                            id={item.id}
                            placeholder={item.numberId}
                            itemName={item.name}
                            itemSurname={item.surname}
                            checked={employees.find((it) => it.id.includes(item.id))}
                            type="checkbox"
                          />
                          {item.name} {item.surname} {item.numberId ? `(${item.numberId})` : null}
                        </label>
                      </td>
                      <td>
                        {employees.find((it) => it.id.includes(item.id)) ? (
                          <button
                            type="button"
                            className={cx('py-1 px-4 rounded-lg my-1 mr-3 border', {
                              'border-yellow-400 bg-yellow-400':
                                employees.find((it) => it.id.includes(item.id)).role === 'main',
                              'border-green-400 bg-green-400':
                                employees.find((it) => it.id.includes(item.id)).role === 'second',
                              'border-red-400 bg-red-400':
                                employees.find((it) => it.id.includes(item.id)).role === 'student'
                            })}
                            id={item.id}
                            onClick={checkBoxEmpRoleChange}
                          >
                            {employees.find((it) => it.id.includes(item.id)).role === 'main'
                              ? 'Старший'
                              : ''}
                            {employees.find((it) => it.id.includes(item.id)).role === 'second'
                              ? 'Исполнитель'
                              : ''}
                            {employees.find((it) => it.id.includes(item.id)).role === 'student'
                              ? 'Студент'
                              : ''}
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))
              : null}
            {!employeeList && !dateEnd ? <p>Сотрудники не найдены</p> : null}
            {dateEnd
              ? employees.map((item) => (
                  <tr
                    className="mb-3 flex flex-row rounded bg-green-200 hover:bg-green-300 w-full text-lg"
                    key={item.id}
                    type="button"
                  >
                    <td className="flex flex-row w-full h-full">
                      <label htmlFor={item.id} className="w-full h-full p-2 text-left inline-block">
                        <input className="mr-4" key={item.id} checked type="checkbox" />
                        {item.name} {item.surname} {item.numberId ? `(${item.numberId})` : null}
                      </label>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={cx('py-1 px-4 rounded-lg my-1 mr-3 border', {
                          'border-yellow-400 bg-yellow-400': item.role === 'main',
                          'border-green-400 bg-green-400': item.role === 'second',
                          'border-red-400 bg-red-400': item.role === 'student'
                        })}
                        id={item.id}
                        onClick={checkBoxEmpRoleChange}
                      >
                        {item.role === 'main' ? 'Старший' : ''}
                        {item.role === 'second' ? 'Исполнитель' : ''}
                        {item.role === 'student' ? 'Студент' : ''}
                      </button>
                    </td>
                  </tr>
                ))
              : null}
          </table>
        </div>
      </div>
    </div>
  )
}

export default Employee
