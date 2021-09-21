import React, { useState } from 'react'

const Salary = ({ report, isMaterial, setIsMaterial }) => {
  const employeeArray = report
    ? report
        .reduce((acc, rec) => [...acc, ...rec.employee], [])
        .filter(
          (it) =>
            !it.name.toLowerCase().includes('студент') &&
            !it.surname.toLowerCase().includes('студент')
        )
        .reduce((acc, rec) => acc.concat(rec), [])
        .reduce((acc, rec) => {
          const x = acc.find((item) => item.id === rec.id)
          if (!x) {
            return acc.concat([rec])
          }
          return acc
        }, [])
    : []

  const dateArray = report
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

  // const onChange = (e) => {
  //   const { value } = e.target
  //   setBossPercent(value)
  // }
  const onChangeMat = (e) => {
    const { value } = e.target
    setIsMaterial(value)
  }

  const applyDiscount = (number, percentOfUser) => {
    const disc = percentOfUser
    const number_percent = (number / 100) * disc
    return Number(number) - (Number(number) - Number(number_percent))
  }

  const commonDiscount = (number, item) => {
    const disc = item.discount ? item.discount : 0
    const number_percent = (number / 100) * disc

    return Number(number) - Number(number_percent)
  }

  const getSalary = (id, filterBy, CombFilterBy) => {
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
        if (isMaterial !== 'yes' && rec.status !== CombFilterBy) {
          return [
            ...acc,
            rec.services.reduce(
              (bat, cur) =>
                bat + commonDiscount(Number(cur.price) * cur.quantity, rec) / rec.employee.length,
              0
            )
          ]
        }
        if (isMaterial !== 'yes' && rec.status === CombFilterBy && filterBy === 'Оплачено') {
          return [
            ...acc,
            Number(rec.combCash) / rec.employee.length -
              rec.material.reduce(
                (bat, cur) => bat + (Number(cur.price) * cur.quantity) / rec.employee.length,
                0
              ) /
                2
          ]
        }
        if (isMaterial !== 'yes' && rec.status === CombFilterBy && filterBy === 'Терминал') {
          return [
            ...acc,
            Number(rec.combTerm) / rec.employee.length -
              rec.material.reduce(
                (bat, cur) => bat + (Number(cur.price) * cur.quantity) / rec.employee.length,
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
                bat + commonDiscount(Number(cur.price) * cur.quantity, rec) / rec.employee.length,
              0
            ) +
              rec.material.reduce(
                (bat, cur) => bat + (Number(cur.price) * cur.quantity) / rec.employee.length,
                0
              )
          ]
        }
        if (isMaterial === 'yes' && rec.status === CombFilterBy && filterBy === 'Оплачено') {
          return [...acc, Number(rec.combCash) / rec.employee.length]
        }
        if (isMaterial === 'yes' && rec.status === CombFilterBy && filterBy === 'Терминал') {
          return [...acc, Number(rec.combTerm) / rec.employee.length]
        }
        return acc
      }, [])
      .reduce((acc, rec) => acc + rec, 0)
  }

  const getSalaryfull = (id, filterBy, CombFilterBy) => {
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
        // if (isMaterial !== 'yes') {
        //   return [
        //     ...acc,
        //     rec.services.reduce(
        //       (bat, cur) => bat + commonDiscount(Number(cur.price) * cur.quantity, rec),
        //       0
        //     )
        //   ]
        // }
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
        // if (isMaterial === 'yes') {
        //   return [
        //     ...acc,
        //     rec.services.reduce(
        //       (bat, cur) => bat + commonDiscount(Number(cur.price) * cur.quantity, rec),
        //       0
        //     ) + rec.material.reduce((bat, cur) => bat + Number(cur.price) * cur.quantity, 0)
        //   ]
        // }
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

  const onChangePercent = (e) => {
    const { name, value } = e.target
    setUserPercent((prevState) => ({
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
    return Math.round(num / 5) * 5
  }
  const totalMaterial = (item) =>
    item.material.reduce((acc, rec) => acc + rec.price * rec.quantity, 0)
  const totalWithDiscount = (item) =>
    applyDiscountWithFreeService(totalFreeService(item)) +
    roundTo5(commonDiscount(totalService(item), item)) +
    totalMaterial(item)
  return (
    <div className="mb-3">
      <h2 className="text-xl font-semibold mb-2">Зарплаты</h2>

      {/* <p>Процент фирмы (остальная сумма разбивается на кол-во человек):</p>
      <input
        className="appearance-none block bg-grey-lighter text-sm text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
        type="number"
        value={bossPercent}
        onChange={onChange}
      /> */}
      <p>Учитывать материалы:</p>
      <select
        className="appearance-none block bg-grey-lighter text-sm text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
        value={isMaterial}
        onChange={onChangeMat}
      >
        <option value="yes" className="text-gray-800">
          Да
        </option>

        <option value="no">Нет</option>
      </select>
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Имя
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Процент
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Терминал
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Безнал
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Наличка
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Вал
            </th>

            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Зарплата
            </th>
          </tr>
        </thead>
        <tbody>
          {employeeArray.map((it) => (
            <tr
              key={it.id}
              className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0"
            >
              <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
                <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Имя:</span>
                {it.name} {it.surname}
              </td>
              <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
                <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Процент:</span>
                <input
                  className="border-solid border-4 border-light-blue-500"
                  type="number"
                  value={userPercent[it.id]}
                  onChange={onChangePercent}
                  name={it.id}
                />
              </td>
              <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Терминал:</span>
                {Math.round(
                  getSalary(it.id, 'Терминал', 'Комбинированный'),
                  userPercent[it.id]
                )}{' '}
                руб.
              </td>
              <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Безнал:</span>
                {Math.round(getSalary(it.id, 'Безнал'), userPercent[it.id])} руб.
              </td>
              <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Наличка:</span>
                {Math.round(
                  getSalary(it.id, 'Оплачено', 'Комбинированный'),
                  userPercent[it.id]
                )}{' '}
                руб.
              </td>
              <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Вал:</span>
                {Math.round(getSalary(it.id), userPercent[it.id])} руб.
              </td>
              <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Зарплата:</span>
                {userPercent[it.id]
                  ? Math.round(applyDiscount(getSalary(it.id), userPercent[it.id]))
                  : 0}{' '}
                руб.
              </td>
            </tr>
          ))}
          <tr className="bg-purple-100 font-bold lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0">
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">Всего:</span>
              Всего
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                Процент:
              </span>
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                Терминал:
              </span>
              {Math.round(getSalaryfull('', 'Терминал', 'Комбинированный'), '')} руб.
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">Безнал:</span>
              {Math.round(getSalaryfull('', 'Безнал'), '')} руб.
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                Наличка:
              </span>
              {Math.round(getSalaryfull('', 'Оплачено', 'Комбинированный'), '')} руб.
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">Вал:</span>
              {Math.round(getSalaryfull(''), '')} руб.
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                Зарплата:
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <h2 className="text-xl font-semibold mb-2">Разбивка по дням:</h2>
      {dateArray.map((date) => (
        <div key={date}>
          <h3 key={date}>
            {new Date(date).getDate()}.{new Date(date).getMonth() + 1}.
            {new Date(date).getFullYear()}
          </h3>
          <table className="border-collapse w-full" key={date}>
            <thead>
              <tr>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Талон №
                </th>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Имя
                </th>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Время
                </th>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Услуги
                </th>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Материалы
                </th>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Скидка
                </th>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Cумма
                </th>
              </tr>
            </thead>
            <tbody>
              {report
                .filter((it) => new Date(it.dateStart).getDate() === new Date(date).getDate())
                .map((it) => (
                  <tr
                    key={it.id}
                    className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0"
                  >
                    <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
                      <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">
                        Номер:
                      </span>
                      {it.id_shinomontazhs}
                    </td>
                    <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
                      <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Имя:</span>
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
                          <p key={man.id}>
                            {man.name} {man.surname}
                          </p>
                        ))}
                    </td>
                    <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                      <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">
                        Время:
                      </span>
                      <p>
                        {new Date(it.dateFinish).getHours()}:
                        {new Date(it.dateFinish)
                          .getMinutes()
                          .toString()
                          .replace(/^(\d)$/, '0$1')}
                      </p>
                    </td>
                    <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                      <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">
                        Услуги:
                      </span>
                      {it.services.reduce((acc, rec) => acc + Number(rec.price) * rec.quantity, 0)}{' '}
                      руб.
                    </td>
                    <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                      <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">
                        Материалы:
                      </span>
                      {it.material.reduce((acc, rec) => acc + Number(rec.price) * rec.quantity, 0)}{' '}
                      руб.
                    </td>
                    <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                      <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">
                        Скидка:
                      </span>
                      {it.discount ? `${it.discount}%` : ''}
                    </td>
                    <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                      <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">
                        Сумма:
                      </span>
                      {totalWithDiscount(it)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}

export default Salary
