import React from 'react'

export default class PeredachaToPrint extends React.PureComponent {
  render() {
    return (
      <div className="m-5 p-5 print-container">
        <div className="w-full text-center">
          <p>
            <strong>АКТ ПРИЕМА-ПЕРЕДАЧИ № {this.props.props.id_storages}</strong>
          </p>
          <p>
            <strong>
              от{' '}
              {`${new Date(this.props.props.dateStart)
                .getDate()
                .toString()
                .replace(/^(\d)$/, '0$1')}.${(new Date(this.props.props.dateStart).getMonth() + 1)
                .toString()
                .replace(/^(\d)$/, '0$1')}.${new Date(this.props.props.dateStart).getFullYear()}`}
            </strong>
          </p>
          <p>
            <strong>&nbsp;</strong>
          </p>
        </div>
        <p>
          <strong>ИП Лупинос В.А.,</strong> именуемая в дальнейшем &quot;Хранитель&quot;, в лице
          Лупинос Виктории Анатольевны, действующей на основании Свидетельства о государственной
          регистрации серия 36 № 003856121 от 22.09.2014г., ОГРНИП 314910226200202, ИНН
          911100019512,&nbsp; и
        </p>
        <p>
          {this.props.props.name} , {this.props.props.phone} , {this.props.props.regnumber}
        </p>
        <p>
          именуемый в дальнейшем &quot;Владелец&quot;, с другой стороны, подписали настоящий Акт
          приема-передачи к Договору сезонного хранения автомобильных шин о нижеследующем:
        </p>
        <p>&nbsp;</p>
        <ol>
          <li>
            Поклажедатель сдал, а Хранитель принял на ответственное хранение Имущество в следующем
            составе:
          </li>
        </ol>
        <div className="w-full flex justify-center">
          <div className="flex justify-center">
            <table>
              <tbody className="border border-black text-center">
                <tr className="border border-black text-center">
                  <td width="77" className="border border-black text-center px-3">
                    <p>
                      <strong>Имущество</strong>
                    </p>
                  </td>
                  <td width="67" className="border border-black text-center px-3">
                    <p>
                      <strong>Принял</strong>
                    </p>
                    <p>
                      <strong>(Да/Нет)</strong>
                    </p>
                  </td>
                  <td width="224" className="border border-black text-center px-3">
                    <p>
                      <strong>Наименование, характеристики, дополнительная информация</strong>
                    </p>
                  </td>
                  <td width="113" className="border border-black text-center px-3">
                    <p>
                      <strong>Количество</strong>
                    </p>
                  </td>
                </tr>
                {this.props.props.preorder.length > 0
                  ? this.props.props.preorder
                      .filter((it) => it.mode === 'simple' && it.type === '1')
                      .slice(0, 3)
                      .map((it, index) => (
                        <tr key={index} className="py-2">
                          <td width="77" className="border border-black text-center">
                            <p>Шины</p>
                          </td>
                          <td width="67" className="border border-black text-center">
                            <p>Да</p>
                          </td>
                          <td width="224" className="border border-black text-center">
                            {it.tyreItem}
                          </td>
                          <td width="113" className="border border-black text-center">
                            <p>{it.quantity} шт.</p>
                          </td>
                        </tr>
                      ))
                  : null}

                {this.props.props.preorder.length > 0
                  ? this.props.props.preorder
                      .filter((it) => it.mode === 'full' && it.type === '1')
                      .slice(0, 3)
                      .map((it, index) => (
                        <tr key={index} className="py-2">
                          <td width="77" className="border border-black text-center">
                            <p>Шины</p>
                          </td>
                          <td width="67" className="border border-black text-center">
                            <p>Да</p>
                          </td>
                          <td width="224" className="border border-black text-center">
                            <p>
                              {it.brand ? `${it.brand} ` : null}
                              {it.model ? `${it.model} ` : null}
                              {it.sizeone ? `${it.sizeone} ` : null}
                              {it.sizetwo ? `/ ${it.sizetwo} ` : null}
                              {it.sizethree ? `R${it.sizethree} ` : null}
                              {it.indexone ? `${it.indexone} ` : null}
                              {it.indextwo ? `${it.indextwo} ` : null}
                              {it.season === 'summer' ? 'летняя ' : null}
                              {it.season === 'winter' ? 'зимняя ' : null}
                              {it.season === 'all' ? 'всесезонная ' : null}
                            </p>
                            {it.wheels === 'yes' ? (
                              <p>С дисками {it.wheelsquan ? `, ${it.wheelsquan} шт.` : ''}</p>
                            ) : null}
                          </td>
                          <td width="113" className="border border-black text-center">
                            <p>{it.quantity} шт.</p>
                          </td>
                        </tr>
                      ))
                  : null}

                {this.props.props.preorder.length > 0
                  ? this.props.props.preorder
                      .filter((it) => it.mode === 'simple' && it.type === '2')
                      .slice(0, 3)
                      .map((it, index) => (
                        <tr key={index} className="py-2">
                          <td width="77" className="border border-black text-center">
                            <p>Диски</p>
                          </td>
                          <td width="67" className="border border-black text-center">
                            <p>Да</p>
                          </td>
                          <td width="224" className="border border-black text-center">
                            {it.tyreItem}
                          </td>
                          <td width="113" className="border border-black text-center">
                            <p>{it.quantity} шт.</p>
                          </td>
                        </tr>
                      ))
                  : null}

                {this.props.props.preorder.length > 0
                  ? this.props.props.preorder
                      .filter((it) => it.mode === 'full' && it.type === '2')
                      .slice(0, 3)
                      .map((it, index) => (
                        <tr key={index} className="py-2">
                          <td width="77" className="border border-black text-center">
                            <p>Диски</p>
                          </td>
                          <td width="67" className="border border-black text-center">
                            <p>Да</p>
                          </td>
                          <td width="224" className="border border-black text-center">
                            <p>
                              {it.brand ? `${it.brand} ` : null}
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
                          <td width="113" className="border border-black text-center">
                            <p>{it.quantity} шт.</p>
                          </td>
                        </tr>
                      ))
                  : null}
              </tbody>
            </table>
          </div>
        </div>
        <p>&nbsp;</p>
        <ol start="2">
          <li>
            Общий размер вознаграждения Хранителя за хранение и оказываемые услуги составляет
            <strong> {this.props.props.comment} рублей,</strong> оплата указанного в настоящем
            пункте вознаграждения уплачивается в момент подписания Договора.
          </li>
        </ol>
        <p className="text-right">
          <strong>
            Хранитель: _________
            /Лупинос.В.А./&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Владелец:_________/ {this.props.props.name}
          </strong>
          <br />
        </p>
        <p>
          <strong> Тел. 7-978-714-12-19 ул.Мирошника 5 (СТО Автодом)</strong>
        </p>
        <p>
          <strong>Тел. 7-978-225-85-95 ул.Вокзальное шоссе 44 (шц Вианор)</strong>
        </p>
      </div>
    )
  }
}
