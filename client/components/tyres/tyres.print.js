import React from 'react'

export default class ComponentToPrint extends React.PureComponent {
  render() {
    return (
      <div className="w-full p-5">
        <h3 className="text-center text-lg font-bold">Номер заказа {this.props.props.id_tyres}</h3>
        {this.props.props.order.find((it) => it.autopartItem !== '') ? (
          <div className="w-full mb-3">
            <p className="mb-2">Заказ:</p>
            <table className="border-collapse w-full">
              <thead>
                <tr>
                  <th className="p-1 w-full text-sm border border-gray-600 table-cell">
                    Наименование
                  </th>
                  <th className="p-1 text-sm border border-gray-600 table-cell">Поставщик</th>
                  <th className="p-1 text-sm border border-gray-600 table-cell">Кол-во</th>
                  <th className="p-1 text-sm border border-gray-600 table-cell">Цена</th>
                  <th className="p-1 text-sm border border-gray-600 table-cell">Сумма</th>
                  <th className="p-1 text-sm border border-gray-600 table-cell">Дата прибытия</th>
                </tr>
              </thead>
              <tbody>
                {this.props.props.order
                  .filter(
                    (item) =>
                      item.stat !== 'Интересовался' && item.mode === 'full' && item.type === '1'
                  )
                  .map((it, index) => (
                    <tr
                      key={index}
                      className="bg-white lg:hover:bg-gray-100 table-row flex-row lg:flex-row flex-wrap mb-10 lg:mb-0"
                    >
                      <td className="w-full px-2 py-1 text-sm text-left border border-gray-600 table-cell relative">
                        <p key={it.tyreItem} className="w-full">
                          Шина: {it.brand ? `${it.brand} ` : null}
                          {it.model ? `${it.model} ` : null}&nbsp;&nbsp;
                          <b>
                            {it.sizeone ? `${it.sizeone}      ` : null}
                            {it.sizetwo ? `/  ${it.sizetwo}   ` : null}
                            {it.sizethree ? `R${it.sizethree} ` : null}
                          </b>
                          &nbsp;&nbsp;
                          {it.indexone ? `  ${it.indexone} ` : null}
                          {it.indextwo ? `${it.indextwo} ` : null}
                          {it.season === 'summer' ? 'летняя ' : null}
                          {it.season === 'winter' ? 'зимняя ' : null}
                          {it.season === 'all' ? 'всесезонная ' : null}
                        </p>
                      </td>
                      <td className="px-2 py-1 text-sm text-center border border-gray-600 table-cell relative">
                        {it.vendor}
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

                {this.props.props.order
                  .filter(
                    (item) =>
                      item.stat !== 'Интересовался' && item.mode === 'full' && item.type === '3'
                  )
                  .map((it, index) => (
                    <tr
                      key={index}
                      className="bg-white lg:hover:bg-gray-100 table-row flex-row lg:flex-row flex-wrap mb-10 lg:mb-0"
                    >
                      <td className="w-full px-2 py-1 text-sm text-left border border-gray-600 table-cell relative">
                        <p key={it.tyreItem} className="w-full">
                          АКБ: {it.brand ? `${it.brand} ` : null}
                          {it.model ? `${it.model} ` : null}
                          {it.tok ? `Пусковой ток: ${it.tok}, ` : null}
                          {it.emkost ? `${it.emkost} Ah, ` : null}
                          {it.size ? `Размер: ${it.size}, ` : null}
                          {it.typeakb === 'euro' ? 'Евро, ' : null}
                          {it.typeakb === 'asia' ? 'Азия, ' : null}
                          {it.polar === 'L+' ? 'прямая полярность, ' : null}
                          {it.polar === 'R+' ? 'обратная полярность, ' : null}
                          {it.polar === 'uni' ? 'универсальная полярность, ' : null}
                        </p>
                      </td>
                      <td className="px-2 py-1 text-sm text-center border border-gray-600 table-cell relative">
                        {it.vendor}
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

                {this.props.props.order
                  .filter(
                    (item) =>
                      item.stat !== 'Интересовался' && item.mode === 'full' && item.type === '2'
                  )
                  .map((it, index) => (
                    <tr
                      key={index}
                      className="bg-white lg:hover:bg-gray-100 table-row flex-row lg:flex-row flex-wrap mb-10 lg:mb-0"
                    >
                      <td className="w-full px-2 py-1 text-sm text-left border border-gray-600 table-cell relative">
                        <p key={it.tyreItem} className="w-full">
                          Диски: {it.brand ? `${it.brand} ` : null}
                          {it.model ? `${it.model} ` : null}
                          {it.diametr ? `R${it.diametr} ` : null}
                          {it.pcd ? `PCD: ${it.pcd}, ` : null}
                          {it.et ? `ET: ${it.et}, ` : null}
                          {it.dia ? `ступица: ${it.dia}, ` : null}
                          {it.wheelwidth ? `${it.wheelwidth}J, ` : null}
                          {it.typewheel === 'lit' ? 'Литые, ' : null}
                          {it.typewheel === 'sht' ? 'Штампованные, ' : null}
                          {it.typewheel === 'kov' ? 'Кованные, ' : null}
                          {it.color ? `цвет: ${it.color}` : null}
                        </p>
                      </td>
                      <td className="px-2 py-1 text-sm text-center border border-gray-600 table-cell relative">
                        {it.vendor}
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
        <div className="w-full flex flex-row">
          <div className="w-1/2 flex justify-start flex-col justify-items-start mr-auto">
            {this.props.props.employee ? (
              <div className="flex justify-between text-sm w-4/5 sm:w-auto mr-auto">
                <p className="mr-5">Принял заказ:</p>

                <p>
                  {this.props.employeeListLocal.find((it) => it.id === this.props.props.employee)
                    ? this.props.employeeListLocal.find((it) => it.id === this.props.props.employee)
                        .surname
                    : ''}
                  {this.props.props.siteNumber
                    ? `Заказ с сайта №${this.props.props.siteNumber}`
                    : null}
                </p>
              </div>
            ) : (
              ''
            )}
            {this.props.props.process ? (
              <div className="flex justify-between text-sm w-4/5 mr-auto mb-2">
                <p className="mr-5">Обработал заказ:</p>
                <p>
                  {this.props.employeeListLocal.find((it) => it.id === this.props.props.process)
                    ? this.props.employeeListLocal.find((it) => it.id === this.props.props.process)
                        .surname
                    : ''}
                </p>
              </div>
            ) : (
              ''
            )}
          </div>
          <div className="w-1/2 flex justify-end flex-col justify-items-end ml-auto">
            <div className="flex justify-between text-sm w-4/5 ml-auto">
              <p className="mr-5">Предоплата:</p>
              {this.props.props.prepay ? <p>{this.props.props.prepay}</p> : <p>Нет</p>}
            </div>
            <div className="flex justify-between text-sm w-4/5 ml-auto">
              <p className="mr-5">Дата оформления заказа:</p>

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
            {this.props.props.name ? (
              <div className="flex justify-between text-sm w-4/5 ml-auto">
                <p className="mr-5">Имя:</p>

                <p>{this.props.props.name}</p>
              </div>
            ) : null}
            {this.props.props.phone ? (
              <div className="flex justify-between text-sm w-4/5 ml-auto">
                <p className="mr-5">Телефон:</p>

                <p>{this.props.props.phone}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    )
  }
}
