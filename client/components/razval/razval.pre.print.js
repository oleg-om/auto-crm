import React from 'react'

export default class ComponentToPrint extends React.PureComponent {
  render() {
    return (
      <div className="w-full p-5">
        <h3 className="text-center text-lg font-bold mb-2">Талон на запись</h3>
        <div className="flex justify-between text-sm mb-2">
          <p>Дата:</p>
          <p>
            {this.props.OrderDate} {this.props.OrderTime}
          </p>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <p>Услуга:</p>
          <p>{this.props.itemType}</p>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <p>Адрес:</p>
          <p>{this.props.placesList.name}</p>
        </div>
        <div className="flex justify-between mb-3 text-sm border-b-2 border-black pb-3">
          <p>Телефон:</p>
          <p>{this.props.placesList.razvalphone}</p>
        </div>
        <div className="f-full mb-3 text-sm">
          <p>Приедьте за 20 минут до начала проведения работ</p>
        </div>
      </div>
    )
  }
}
