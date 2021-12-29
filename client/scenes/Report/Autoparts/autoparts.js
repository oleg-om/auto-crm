import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Salary = ({ report, employeeListFull }) => {
  const employeeArray = report
    ? report
        .reduce((acc, rec) => [...acc, ...rec.process], [])
        .reduce((acc, rec) => acc.concat(rec), [])
        .reduce((acc, rec) => {
          const x = acc.find((item) => item === rec)
          if (!x) {
            return acc.concat([rec])
          }
          return acc
        }, [])
        .reduce((acc, rec) => {
          return [
            ...acc,
            {
              id: rec,
              name: employeeListFull.find((person) => person.id === rec).name,
              surname: employeeListFull.find((person) => person.id === rec).surname
            }
          ]
        }, [])
    : []

  // const dateArray = report
  //   .reduce((acc, rec) => {
  //     return [...acc, ...rec.fail]
  //   }, [])
  //   .reduce((thing, current) => {
  //     const x = thing.find(
  //       (item) => new Date(item.come).getDate() === new Date(current.come).getDate()
  //     )
  //     if (!x) {
  //       return thing.concat([current])
  //     }
  //     return thing
  //   }, [])
  //   .reduce((acc, rec) => [...acc, rec.come], [])
  //   .sort(function sortVendors(a, b) {
  //     if (new Date(a) < new Date(b)) {
  //       return 1
  //     }
  //     if (new Date(a) > new Date(b)) {
  //       return -1
  //     }
  //     return 0
  //   })
  //   const modifiedOrder = report.reduce((acc, rec) => {
  //     return [...acc, { ...re}]
  //   }, [])
  // .reduce((acc,rec)=> {
  //   return
  // },[])

  const reportInStock = report.reduce((acc, rec) => {
    return [...acc, { ...rec, order: rec.order.filter((it) => it.vendor === 'instock') }]
  }, [])

  const reportOrder = report.reduce((acc, rec) => {
    return [...acc, { ...rec, order: rec.order.filter((it) => it.vendor !== 'instock') }]
  }, [])

  const getVal = (id, data) => {
    return data
      .reduce((acc, rec) => {
        if (rec.process === id) {
          return [...acc, rec]
        }
        return acc
      }, [])
      .reduce((acc, rec) => {
        return [
          ...acc,
          rec.order.reduce((bat, cur) => bat + Number(cur.price) * Number(cur.quantity), 0)
        ]
      }, [])
      .reduce((acc, rec) => acc + rec, 0)
  }

  const getPribyl = (id) => {
    return report
      .reduce((acc, rec) => {
        if (rec.process === id) {
          return [...acc, rec]
        }
        return acc
      }, [])
      .reduce((acc, rec) => {
        return [
          ...acc,
          rec.order.reduce(
            (bat, cur) =>
              bat +
              Number(cur.price) * Number(cur.quantity) -
              Number(cur.zakup) * Number(cur.quantity),
            0
          )
        ]
      }, [])
      .reduce((acc, rec) => acc + rec, 0)
  }

  const commonDiscount = (number, percent) => {
    const disc = percent
    const number_percent = (number / 100) * disc

    return Number(number) - (Number(number) - Number(number_percent))
  }

  const getZp = (id) => {
    return report
      .reduce((acc, rec) => {
        if (rec.process === id) {
          return [...acc, rec]
        }
        return acc
      }, [])
      .reduce((acc, rec) => {
        return [
          ...acc,
          rec.order.reduce(
            (bat, cur) =>
              bat +
              Number(cur.price) * Number(cur.quantity) -
              Number(cur.zakup) * Number(cur.quantity),
            0
          )
        ]
      }, [])
      .reduce((acc, rec) => acc + rec, 0)
  }

  const getValfull = (data) => {
    return data
      .reduce((acc, rec) => {
        return [
          ...acc,
          rec.order.reduce((bat, cur) => bat + Number(cur.price) * Number(cur.quantity), 0)
        ]
      }, [])
      .reduce((acc, rec) => acc + rec, 0)
  }
  const getPribylFull = () => {
    return report
      .reduce((acc, rec) => {
        return [
          ...acc,
          rec.order.reduce(
            (bat, cur) =>
              bat +
              Number(cur.price) * Number(cur.quantity) -
              Number(cur.zakup) * Number(cur.quantity),
            0
          )
        ]
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

  console.log(report)
  return (
    <div className="mb-3">
      <h2 className="text-xl font-semibold mb-2">Зарплаты</h2>

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
              Вал
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Вал (под заказ)
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Вал (в наличии)
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Прибыль
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
                <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Вал:</span>
                {Math.round(getVal(it.id, report))} руб.
              </td>
              <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">
                  Вал (под заказ):
                </span>
                {Math.round(getVal(it.id, reportOrder))} руб.
              </td>
              <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">
                  Вал (в наличии):
                </span>
                {Math.round(getVal(it.id, reportInStock))} руб.
              </td>
              <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Прибыль:</span>
                {Math.round(getPribyl(it.id))} руб.
              </td>
              <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Зарплата:</span>
                {userPercent[it.id]
                  ? Math.round(commonDiscount(getZp(it.id), userPercent[it.id]))
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
              <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">Вал:</span>
              {Math.round(getValfull(report), '')} руб.
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                Вал (под заказ):
              </span>
              {Math.round(getValfull(reportOrder), '')} руб.
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                Вал (в наличии):
              </span>
              {Math.round(getValfull(reportInStock), '')} руб.
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                Прибыль:
              </span>
              {Math.round(getPribylFull(''), '')} руб.
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                Зарплата:
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="md:m-3 lg:flex flex-col rounded-lg px-6 py-2 w-auto shadow bg-gray-100 my-2">
        <div className="text-center md:text-left m-3">
          <b>При каких условиях считается зарплата?</b>
          <p>В заказе должны быть указаны поля: </p>
          <p>Количество, закупка, розница, дата прибытия</p>
        </div>
      </div>
      <h2 className="text-xl font-semibold my-2">Пошло бы в зарплату но не указана закупка:</h2>

      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Заказ №
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Имя
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Запчасти
            </th>
          </tr>
        </thead>
        <tbody>
          {report
            .filter((it) => it.fail.length > 0)
            .sort(function sortVendors(a, b) {
              if (Number(a.id_autoparts) < Number(b.id_autoparts)) {
                return 1
              }
              if (Number(a.id_autoparts) > Number(b.id_autoparts)) {
                return -1
              }
              return 0
            })
            .map((it) => (
              <tr
                key={it.id}
                className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0"
              >
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
                  <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Номер:</span>

                  <Link to={`/autoparts/edit/${it.id_autoparts}`} className="hover:underline">
                    {it.id_autoparts}
                  </Link>
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
                  <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Имя:</span>
                  {employeeListFull.find((person) => person.id === it.process).name}{' '}
                  {employeeListFull.find((person) => person.id === it.process).surname}
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                  <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Запчасти:</span>
                  {it.fail.map((at) => (
                    <p key={Math.random()}>
                      {at.autopartItem}{' '}
                      {at.vendor && at.vendor !== 'instock' ? `(${at.vendor})` : ''}{' '}
                      {at.vendor && at.vendor === 'instock' ? `(в наличии)` : ''}
                    </p>
                  ))}
                </td>
              </tr>
            ))}
          {report.filter((it) => it.fail.length > 0).length <= 0 ? (
            <p>У всех заказов проставлена закупка</p>
          ) : null}
        </tbody>
      </table>
      {/* <h2 className="text-xl font-semibold mb-2">Разбивка по дням (Выданные запчасти):</h2> */}
      {/* {dateArray.map((date) => (
        <div key={date}>
          <h3 key={date}>
            {new Date(date).getDate()}.{new Date(date).getMonth() + 1}.
            {new Date(date).getFullYear()}
          </h3>
          <table className="border-collapse w-full" key={date}>
            <thead>
              <tr>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Заказ №
                </th>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Имя
                </th>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Время
                </th>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Запчасти
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
                      {it.id_autoparts}
                    </td>
                    <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
                      <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Имя:</span>
                      {employeeListFull.find((person) => person.id === it.process).name} {employeeListFull.find((person) => person.id === it.process).surname}
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
                        Запчасти:
                      </span>
                      {it.order.map((at)=> <p key={Math.random()}>{at.autopartItem}</p>)}
                      руб.
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
      ))} */}
    </div>
  )
}

export default Salary
