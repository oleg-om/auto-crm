import React from 'react'

export default class ComponentToPrint extends React.PureComponent {
  render() {
    return (
      <div className="m-5 p-5 print-container">
        <p className="text-center">
          <strong className="text-center">Договор сезонного хранения автошин и/или дисков</strong>
        </p>
        <p>&nbsp;</p>
        <p>
          <strong>ИП ЛУПИНОС В.А.,</strong> именуемая в дальнейшем &quot;Хранитель&quot;, в лице
          Лупинос Виктории Анатольевны, действующей на основании Свидетельства о государственной
          регистрации серия 36 № 003856121 от 22.09.2014г., ОГРНИП 314910226200202, ИНН
          911100019512, и {this.props.props.name} , {this.props.props.phone} ,{' '}
          {this.props.props.regnumber}
        </p>
        <p>
          именуемый в дальнейшем &quot;Владелец&quot;, с другой стороны, заключили настоящий договор
          о нижеследующем:
        </p>
        <ol>
          <li className="text-center">
            <strong> Предмет договора.</strong>
          </li>
        </ol>
        <p>
          1.1. Предметом договора является неподлежащие лицензированию услуги по сезонному хранению
          автомобильных шин и/или дисков принадлежащие Владельцу согласно Акту приема-передачи.
        </p>
        <ol start="2">
          <li className="text-center">
            <strong> Обязанности сторон.</strong>
          </li>
        </ol>
        <p>
          2.1. Хранитель обязуется хранить автошины и/или диски, переданные ему Владельцем, и
          возвратить эти автошины и диски в сохранности.
        </p>
        <p>
          2.2. Хранитель обязан по требованию Владельца возвратить принятые на хранение автошины
          и/или диски в течении 3-х суток с момента требования.
        </p>
        <p>
          2.3.Хранитель обязан вернуть Владельцу те самые автошины и диски, которые были переданы на
          хранение.
        </p>
        <p>
          2.4. Хранитель обязуется принять меры, обязательность которых предусмотрена законом или
          нормами (противопожарными, санитарными, охранными).
        </p>
        <p>
          2.5. Хранитель обязуется без согласия Владельца не использовать переданные на хранение
          автошины и диски, а равно не предоставлять возможность пользоваться ими третьим лицам.
        </p>
        <p>
          2.6. По истечении срока хранения, обусловленного настоящим Договором, Владелец обязан либо
          продлить Договор, либо в течении 7 дней забрать переданные на хранение автошины и/или
          диски.
        </p>
        <p>
          2.7. Владелец обязан выплатить Хранителю вознаграждение за хранение в размере и на
          условиях, предусмотренных настоящим Договором.
        </p>
        <p className="text-center">
          <strong>3.Сумма Договора и порядок расчётов.</strong>
        </p>
        <p>
          3.1. Вознаграждение за хранение по настоящему договору указано за комплект и составляет:
        </p>
        <div className="w-full flex justify-center">
          <table width="515" className="border border-black p-2 text-center">
            <tbody>
              <tr className="border border-black">
                <td width="141" className="border border-black text-center">
                  <p>
                    <strong>Срок хранения</strong>
                  </p>
                </td>
                <td width="187" className="border border-black text-center">
                  <p>
                    <strong>R13-R16 (комплект)</strong>
                  </p>
                </td>
                <td width="187" className="border border-black text-center">
                  <p>
                    <strong>R17-R21 (комплект)</strong>
                  </p>
                </td>
              </tr>
              <tr>
                <td colSpan="3" width="515" className="border border-black text-center">
                  <p>
                    <strong>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      Шины
                    </strong>
                  </p>
                </td>
              </tr>
              <tr className="border border-black text-center">
                <td width="141" className="border border-black text-center">
                  <p>
                    <strong>1 месяц</strong>
                  </p>
                </td>
                <td width="187" className="border border-black text-center">
                  <p>200</p>
                </td>
                <td width="187" className="border border-black text-center">
                  <p>300</p>
                </td>
              </tr>
              <tr>
                <td width="141" className="border border-black text-center">
                  <p>
                    <strong>6 месяцев</strong>
                  </p>
                </td>
                <td width="187" className="border border-black text-center">
                  <p>600</p>
                </td>
                <td width="187" className="border border-black text-center">
                  <p>800</p>
                </td>
              </tr>
              <tr>
                <td colSpan="3" width="515" className="border border-black text-center">
                  <p>
                    <strong>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      Колеса в сборе с диском
                    </strong>
                  </p>
                </td>
              </tr>
              <tr>
                <td width="141" className="border border-black text-center">
                  <p>
                    <strong>1 месяц</strong>
                  </p>
                </td>
                <td width="187" className="border border-black text-center">
                  <p>250</p>
                </td>
                <td width="187" className="border border-black text-center">
                  <p>400</p>
                </td>
              </tr>
              <tr>
                <td width="141" className="border border-black text-center">
                  <p>
                    <strong>6 месяцев</strong>
                  </p>
                </td>
                <td width="187" className="border border-black text-center">
                  <p>800</p>
                </td>
                <td width="187" className="border border-black text-center">
                  <p>1000</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          3.2. Вознаграждение за хранение выплачивается Хранителю в момент заключения Договора в
          кассу Хранителя.
        </p>
        <p>
          3.3. В цену включена стоимость услуги по вывозу колес Владельца на склад Хранителя.
          Владелец оставляет за собой право забрать свою резину самостоятельно с шиномонтажа по
          адресу ул. Мирошника д.5
        </p>
        <div className="page-break" />
        <ol start="4">
          <li className="text-center mt-6 pt-5">
            <strong> Ответственность сторон и форс-мажор.</strong>
          </li>
        </ol>
        <p>
          4.1. Хранитель отвечает за утрату, недостачу или повреждение автошин и дисков, если не
          докажет, что утрата, недостача или повреждение произошли вследствие непреодолимой силы.
        </p>
        <p>
          4.2. Убытки, причиненные Владельцу утратой, недостачей или повреждением автошин и дисков,
          возмещаются Хранителем в размере остаточной стоимости автошин и дисков, определяемой с
          общего согласия сторон.
        </p>
        <p>
          4.3. Если по истечении срока хранения, находящиеся на хранении автошины и/или диски не
          взяты обратно Владельцем, он обязуется уплатить Хранителю вознаграждение согласно п.3.1.
          из расчета полного календарного месяца не зависимо от текущей даты.
        </p>
        <p>
          4.4. При неисполнении Владельцем своей обязанности взять автошины и/или диски обратно, в
          том числе при его уклонении от получения автошин и/или дисков, Хранитель вправе, через 60
          суток &nbsp;после завершения срока настоящего Договора, утилизировать автошины и диски
          Владельца без уведомления Владельца. Остаточная стоимость автошин и/или дисков Владельцу
          не выплачивается.
        </p>
        <p>
          4.5. Если хранение прекращается до истечения обусловленного срока по желанию Владельца,
          Хранитель имеет право оставить вознаграждение в размере полной суммы.
        </p>
        <p>
          4.6. Если хранение прекращается досрочно по вине Хранителя, он обязан вернуть сумму
          вознаграждения Владельцу.
        </p>
        <p>
          4.7. Сторона, не исполнившая или ненадлежайшим образом исполнившая свои обязательства по
          настоящему Договору при выполнении его условий, несёт ответственность, если не докажет,
          что ненадлежайщее исполнение обязательств оказалось невозможным вследствие непреодолимой
          силы (форс-мажор).
        </p>
        <ol start="5">
          <li className="text-center">
            <strong> Срок действия Договора.</strong>
          </li>
        </ol>
        <p>5.1. Настоящий Договор действует на срок указанный в Акте приема-передачи.</p>
        <ol start="6">
          <li>
            <strong className="text-center"> Иные положения.</strong>
          </li>
        </ol>
        <p>
          6.1. По всем вопросам, не предусмотренным настоящим Договором, стороны будут
          руководствоваться действующим законодательством Российской Федерации.
        </p>
        <p>
          6.2. В случае возникновения споров по настоящему Договору стороны примут все меры к
          разрешению их путём переговоров между собой. Если стороны не смогут прийти к согласию, не
          решат спор путём переговоров, то данный спор подлежат рассмотрению в судебных органах.
        </p>
        <p className="text-center">
          <strong className="text-center">АДРЕСА И РЕКВИЗИТЫ СТОРОН</strong>
        </p>
        <p>&nbsp;</p>
        <div className="flex flex-row">
          <div className="w-1/2">
            <p>
              <strong>Хранитель:</strong>
            </p>
            <p>
              <strong>ИП ЛУПИНОС В.</strong>
            </p>
            <p>Свидетельства о государственной</p>
            <p>Регистрации</p>
            <p>серия 36 № 003856121 от 22.09.2014г.</p>
            <p>ОГРНИП 314910226200202</p>
            <p>ИНН 911100019512</p>
          </div>
          <div className="w-1/2 mr-6 pr-6">
            <strong>Владелец:</strong>
            <div className="w-full border-b-2 border-black my-3 py-2" />
            <div className="w-full border-b-2 border-black my-3 py-2" />
            <div className="w-full border-b-2 border-black my-3 py-2" />
            <div className="w-full border-b-2 border-black my-3 py-2" />
          </div>
        </div>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <div className="page-break" />
        <p className="text-center mt-6 pt-4">
          <strong>
            С Договором сезонного хранения автошин и/или дисков ознакомлен/ознакомлена:
          </strong>
        </p>
        <p>
          <strong>
            {this.props.props.name} , {this.props.props.phone} , {this.props.props.regnumber}
          </strong>
        </p>
        <p>
          <strong>&nbsp;</strong>
        </p>
        <div className="w-full">
          <div className="w-full border-b-2 border-black my-3 py-2" />
          <div className="w-full border-b-2 border-black my-3 py-2" />
          <div className="w-full border-b-2 border-black my-3 py-2" />
          <div className="w-full border-b-2 border-black my-3 py-2" />
          <div className="w-full border-b-2 border-black my-3 py-2" />
          <div className="w-full border-b-2 border-black my-3 py-2" />
          <div className="w-full border-b-2 border-black my-3 py-2" />
          <div className="w-full border-b-2 border-black my-3 py-2" />
          <div className="w-full border-b-2 border-black my-3 py-2" />
          <div className="w-full border-b-2 border-black my-3 py-2" />
          <div className="w-full border-b-2 border-black my-3 py-2" />
          <div className="w-full border-b-2 border-black my-3 py-2" />
          <div className="w-full border-b-2 border-black my-3 py-2" />
          <div className="w-full border-b-2 border-black my-3 py-2" />
          <div className="w-full border-b-2 border-black my-3 py-2" />
          <div className="w-full border-b-2 border-black my-3 py-2" />
          <div className="w-full border-b-2 border-black my-3 py-2" />
          <div className="w-full border-b-2 border-black my-3 py-2" />
          <div className="w-full border-b-2 border-black my-3 py-2" />
          <div className="w-full border-b-2 border-black my-3 py-2" />
          <div className="w-full border-b-2 border-black my-3 py-2" />
          <div className="w-full border-b-2 border-black my-3 py-2" />
          <div className="w-full border-b-2 border-black my-3 py-2" />
          <div className="w-full border-b-2 border-black my-3 py-2" />
          <div className="w-full border-b-2 border-black my-3 py-2" />
          <div className="w-full border-b-2 border-black my-3 py-2" />
          <div className="w-full border-b-2 border-black my-3 py-2" />
          <div className="w-full border-b-2 border-black my-3 py-2" />
        </div>
      </div>
    )
  }
}
