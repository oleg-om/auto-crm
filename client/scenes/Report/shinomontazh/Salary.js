import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SalaryTableComponent from './SalaryTableComponent'

const Salary = ({ report, isMaterial, setIsMaterial, calendarType, active, employeeList }) => {
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

  const commonDiscount = (number, item) => {
    const disc = item.discount ? item.discount : 0
    const number_percent = (number / 100) * disc

    return Number(number) - Number(number_percent)
  }

  const getSalary = (id, filterBy, CombFilterBy, discountType) => {
    return (
      report
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
        // .map((it, ind, arr) => {
        //   if (calendarType === 'day' && discountType === 'summa') {
        //     return arr.reduce((acc, rec) => {
        //       return [
        //         ...acc,
        //         {
        //           ...rec,
        //           services: rec.services.reduce((bat, cur) => {
        //             if (cur.free === 'yes') {
        //               return [...bat, { ...cur, price: 0 }]
        //             }
        //             if (cur.free !== 'yes') {
        //               return [...bat, cur]
        //             }
        //             return bat
        //           }, [])
        //         }
        //       ]
        //     }, [])
        //   }
        //   if (calendarType === 'day' && discountType === 'discountonly') {
        //     return arr.reduce((acc, rec) => {
        //       return [
        //         ...acc,
        //         {
        //           ...rec,
        //           material: [],
        //           services: rec.services.reduce((bat, cur) => {
        //             if (cur.free === 'yes') {
        //               return [...bat, { ...cur }]
        //             }
        //             if (cur.free !== 'yes') {
        //               return [...bat]
        //             }
        //             return bat
        //           }, [])
        //         }
        //       ]
        //     }, [])
        //   }
        //   return arr
        // })
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
        // .reduce((previousValue, currentValue) => {
        //   if (calendarType === 'day' && discountType === 'summa') {
        //     return [...previousValue, currentValue].reduce((acc, rec) => {
        //       return [
        //         ...acc,
        //         {
        //           ...rec,
        //           services: rec.services.reduce((bat, cur) => {
        //             if (cur.free === 'yes') {
        //               return [...bat, { ...cur, price: 0 }]
        //             }
        //             if (cur.free !== 'yes') {
        //               return [...bat, cur]
        //             }
        //             return bat
        //           }, [])
        //         }
        //       ]
        //     }, [])
        //   }
        //   if (calendarType === 'day' && discountType === 'discountonly') {
        //     return [...previousValue, currentValue].reduce((acc, rec) => {
        //       return [
        //         ...acc,
        //         {
        //           ...rec,
        //           material: [],
        //           services: rec.services.reduce((bat, cur) => {
        //             if (cur.free === 'yes') {
        //               return [...bat, { ...cur }]
        //             }
        //             if (cur.free !== 'yes') {
        //               return [...bat]
        //             }
        //             return bat
        //           }, [])
        //         }
        //       ]
        //     }, [])
        //   }
        //   return [...previousValue, currentValue]
        // }, [])
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
    )
  }

  const getSalaryfull = (id, filterBy, CombFilterBy, discountType) => {
    return (
      report
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

        // .reduce((previousValue, currentValue) => {
        //   if (calendarType === 'day' && discountType === 'summa') {
        //     return [...previousValue, currentValue].reduce((acc, rec) => {
        //       return [
        //         ...acc,
        //         {
        //           ...rec,
        //           services: rec.services.reduce((bat, cur) => {
        //             if (cur.free === 'yes') {
        //               return [...bat, { ...cur, price: 0 }]
        //             }
        //             if (cur.free !== 'yes') {
        //               return [...bat, cur]
        //             }
        //             return bat
        //           }, [])
        //         }
        //       ]
        //     }, [])
        //   }
        //   if (calendarType === 'day' && discountType === 'discountonly') {
        //     return [...previousValue, currentValue].reduce((acc, rec) => {
        //       return [
        //         ...acc,
        //         {
        //           ...rec,
        //           material: [],
        //           services: rec.services.reduce((bat, cur) => {
        //             if (cur.free === 'yes') {
        //               return [...bat, { ...cur }]
        //             }
        //             if (cur.free !== 'yes') {
        //               return [...bat]
        //             }
        //             return bat
        //           }, [])
        //         }
        //       ]
        //     }, [])
        //   }
        //   return [...previousValue, currentValue]
        // }, [])
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
    )
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
    return Math.round(num / 5) * 5
  }
  const totalMaterial = (item) =>
    item.material.reduce((acc, rec) => acc + rec.price * rec.quantity, 0)
  const totalWithDiscount = (item) =>
    applyDiscountWithFreeService(totalFreeService(item)) +
    roundTo5(commonDiscount(totalService(item), item)) +
    totalMaterial(item)

  const checkIsBookkeper = active.includes('-buh')
  const checkIsShinomontazh = active.includes('sh-')

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

              // { [rec.id]: checkIsShinomontazh ? rec?.shinomontazhPercent : rec?.stoPercent }
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

            {checkIsBookkeper ? (
              <>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Вал
                </th>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Процент
                </th>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Оформлен
                </th>
                {calendarType === 'month' ? (
                  <>
                    <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                      Налог, руб
                    </th>
                    <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                      Сумма на карту
                    </th>
                  </>
                ) : null}
              </>
            ) : null}
            {!checkIsBookkeper ? (
              <>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Терминал
                </th>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Безнал
                </th>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Наличка
                </th>

                {calendarType === 'day' ? (
                  <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Сумма
                  </th>
                ) : null}
                {calendarType === 'day' ? (
                  <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Акция
                  </th>
                ) : null}
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Вал
                </th>
              </>
            ) : null}

            {checkIsBookkeper ? (
              <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                Зарплата
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {employeeArray.map((it) => (
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
            />
          ))}
          <tr className="bg-purple-100 font-bold lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0">
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">Всего:</span>
              Всего
            </td>
            {checkIsBookkeper ? (
              <>
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                  <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                    Вал:
                  </span>
                  {Math.round(getSalaryfull(''), '')} руб.
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
                  <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                    Процент:
                  </span>
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
                  <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                    Оформлен:
                  </span>
                </td>
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
                  </>
                ) : null}
              </>
            ) : null}
            {!checkIsBookkeper ? (
              <>
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                  <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                    Терминал:
                  </span>
                  {Math.round(getSalaryfull('', 'Терминал', 'Комбинированный', 'summa'), '')} руб.
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                  <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                    Безнал:
                  </span>
                  {Math.round(getSalaryfull('', 'Безнал', '', 'summa'), '')} руб.
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                  <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                    Наличка:
                  </span>
                  {Math.round(getSalaryfull('', 'Оплачено', 'Комбинированный', 'summa'), '')} руб.
                </td>
                {calendarType === 'day' ? (
                  <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                    <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                      Сумма:
                    </span>
                    {Math.round(getSalaryfull('', '', '', 'summa'), '')} руб.
                  </td>
                ) : null}
                {calendarType === 'day' ? (
                  <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                    <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                      Акция:
                    </span>
                    {Math.round(getSalaryfull('', '', '', 'discountonly'), '')} руб.
                  </td>
                ) : null}
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                  <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                    Вал:
                  </span>
                  {Math.round(getSalaryfull(''), '')} руб.
                </td>
              </>
            ) : null}

            {checkIsBookkeper ? (
              <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                <span className="lg:hidden px-2 py-1 bg-purple-100 font-bold uppercase">
                  Зарплата:
                </span>
              </td>
            ) : null}
          </tr>
        </tbody>
      </table>
      {calendarType === 'day' ? (
        <>
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

                          <Link
                            to={
                              checkIsShinomontazh
                                ? `/shinomontazh/edit/${it.id_shinomontazhs}`
                                : `/sto/edit/${it.id_stos}`
                            }
                            className="hover:underline"
                          >
                            {checkIsShinomontazh ? it.id_shinomontazhs : it.id_stos}
                          </Link>
                        </td>
                        <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
                          <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">
                            Имя:
                          </span>
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
                          {it.services.reduce(
                            (acc, rec) => acc + Number(rec.price) * rec.quantity,
                            0
                          )}{' '}
                          руб.
                        </td>
                        <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                          <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">
                            Материалы:
                          </span>
                          {it.material.reduce(
                            (acc, rec) => acc + Number(rec.price) * rec.quantity,
                            0
                          )}{' '}
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
        </>
      ) : null}
    </div>
  )
}

export default Salary
