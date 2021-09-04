import React from 'react'

export default class ComponentToPrint extends React.PureComponent {
  render() {
    return (
      <div className="w-full p-5">
        <h3 className="text-center text-lg font-bold">
          Номер заказа {this.props.props.id_autoparts}
        </h3>
        {this.props.props.order.find((it) => it.autopartItem !== '') ? (
          <div className="w-full mb-3">
            <p className="mb-2">Заказ:</p>
            <table className="border-collapse w-full">
              <thead>
                <tr>
                  <th className="p-1 w-full text-sm border border-gray-600 table-cell">Запчасти</th>
                  <th className="p-1 text-sm border border-gray-600 table-cell">Кол-во</th>
                  <th className="p-1 text-sm border border-gray-600 table-cell">Цена</th>
                  <th className="p-1 text-sm border border-gray-600 table-cell">Сумма</th>
                  <th className="p-1 text-sm border border-gray-600 table-cell">Дата прибытия</th>
                </tr>
              </thead>
              <tbody>
                {this.props.props.order
                  .filter((item) => item.stat !== 'Интересовался')
                  .map((it, index) => (
                    <tr
                      key={index}
                      className="bg-white lg:hover:bg-gray-100 table-row flex-row lg:flex-row flex-wrap mb-10 lg:mb-0"
                    >
                      <td className="w-full px-2 py-1 text-sm text-left border border-gray-600 table-cell relative">
                        {it.autopartItem}
                      </td>
                      <td className="px-2 py-1 text-sm text-center border border-gray-600 table-cell relative">
                        {it.quantity}
                      </td>
                      <td className="px-2 py-1 text-sm text-center border border-gray-600 table-cell relative">
                        {it.price}
                      </td>
                      <td className="w-auto px-2 py-1 text-sm text-center border border-gray-600 table-cell relative">
                        <p>{it.price && it.quantity ? it.price * it.quantity : null}</p>
                      </td>
                      <td className="w-auto px-2  py-1 text-sm text-center border border-gray-600 table-cell relative">
                        {it.come
                          ? `${new Date(it.come)
                              .getDate()
                              .toString()
                              .replace(/^(\d)$/, '0$1')}.${(new Date(it.come).getMonth() + 1)
                              .toString()
                              .replace(/^(\d)$/, '0$1')}.${new Date(it.come).getFullYear()}
              `
                          : null}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <p className="mt-1">Общая сумма: {this.props.total}</p>
          </div>
        ) : (
          <p className="mb-2 font-bold">Добавьте заказ от поставщика</p>
        )}
        <div className="w-full flex justify-end flex-col justify-items-end ml-auto">
          <div className="flex justify-between text-sm w-1/3 ml-auto">
            <p>Предоплата:</p>
            {this.props.props.prepay ? <p>{this.props.props.prepay}</p> : <p>Нет</p>}
          </div>
          <div className="flex justify-between text-sm w-1/3 ml-auto">
            <p>Дата оформления заказа:</p>

            <p>
              {`${new Date(this.props.props.date)
                .getDate()
                .toString()
                .replace(/^(\d)$/, '0$1')}.${(new Date(this.props.props.date).getMonth() + 1)
                .toString()
                .replace(/^(\d)$/, '0$1')}.${new Date(this.props.props.date).getFullYear()}
              `}
            </p>
          </div>
          {this.props.placesList ? (
            <div className="flex justify-between text-sm w-1/3 ml-auto">
              <p>Имя:</p>

              <p>{this.props.props.name}</p>
            </div>
          ) : null}
          {this.props.placesList ? (
            <div className="flex justify-between text-sm w-1/3 ml-auto">
              <p>Телефон:</p>

              <p>{this.props.props.phone}</p>
            </div>
          ) : null}
        </div>
      </div>
    )
  }
}
