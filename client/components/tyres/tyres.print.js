import React from 'react'

export default class ComponentToPrint extends React.PureComponent {
  render() {
    return (
      <div className="w-full p-5">
        <h3 className="text-center text-lg font-bold">
          Номер заказа {this.props.props.id_autoparts}
        </h3>
        <div className="flex justify-between mb-3 text-sm border-b-2 border-black pb-3">
          <p>Заказ:</p>
          <div className="flex flex-col text-right">
            {this.props.props.preorder.map((it) => (
              <p key={it.autopartItem}>
                {it.autopartItem} {it.quantity ? `- ${it.quantity} шт` : null}
              </p>
            ))}
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <p>Предоплата:</p>
          {this.props.props.prepay ? <p>{this.props.props.prepay}</p> : <p>Нет</p>}
        </div>
        <div className="flex justify-between text-sm">
          <p>Дата оформления заказа:</p>

          <p>
            {`${new Date(this.props.props.date)
              .getDate()
              .toString()
              .replace(/^(\d)$/, '0$1')}
              .${(new Date(this.props.props.date).getMonth() + 1)
                .toString()
                .replace(/^(\d)$/, '0$1')}
              .${new Date(this.props.props.date).getFullYear()}
              `}
          </p>
        </div>
        {this.props.placesList ? (
          <div className="flex justify-between mb-3 text-sm border-b-2 border-black pb-3">
            <p>Адрес:</p>

            <p>{this.props.placesList.name}</p>
          </div>
        ) : null}
        {this.props.placesList ? (
          <div className="flex justify-between text-sm">
            <p>Вопросы по заказу:</p>

            <p className="font-bold">{this.props.placesList.autopartsphone}</p>
          </div>
        ) : null}
        <div className="mt-3 mb-1 w-full text-sm">
          <p>Если вы недовольны качеством обслуживания обратитесь:</p>
        </div>
        <div className="flex justify-between text-sm">
          <p>Контроль качества:</p>

          <p>{this.props.helpphone}</p>
        </div>
        <h2 className="text-center text-lg mt-2 font-bold">Спасибо за заказ!</h2>
      </div>
    )
  }
}
