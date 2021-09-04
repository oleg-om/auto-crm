import React from 'react'

export default class NakleikaPrint extends React.PureComponent {
  render() {
    return (
      <div className="m-5 p-5 print-container">
        <div className="w-full flex justify-center">
          <div className="flex justify-center w-full flex-col">
            <table className="w-full text-2xl my-2">
              <tbody className="border border-black text-center">
                {this.props.props.preorder.length > 0
                  ? this.props.props.preorder
                      .filter((it) => it.mode === 'simple' && it.type === '1')
                      .reduce((acc, rec) => {
                        for (let i = 0; i < rec.quantity; i++) {
                          acc.push(rec)
                        }
                        return acc
                      }, [])
                      .map((it, index) =>
                        it.quantity.map(() => (
                          <tr key={index} className="py-2">
                            <td className="border border-black text-center p-2 py-3">
                              <p>№</p>
                              <p>
                                <b>{this.props.props.id_storages}</b>
                              </p>
                            </td>
                            <td className="border border-black text-center p-2 py-3">
                              <p>{this.props.props.phone}</p>
                              <p>{this.props.props.name}</p>
                              <p className="whitespace-nowrap">
                                с{' '}
                                <b>{`${new Date(this.props.props.dateStart)
                                  .getDate()
                                  .toString()
                                  .replace(/^(\d)$/, '0$1')}.${(
                                  new Date(this.props.props.dateStart).getMonth() + 1
                                )
                                  .toString()
                                  .replace(/^(\d)$/, '0$1')}.${new Date(
                                  this.props.props.dateStart
                                ).getFullYear()}`}</b>
                              </p>
                            </td>
                            <td className="border border-black text-center p-2 py-3">
                              {it.tyreItem}
                            </td>
                            <td className="border border-black text-center p-2 py-3">
                              <p>
                                <b>{it.quantity} шт.</b>
                              </p>
                              {it.wheels ? (
                                <p>{it.wheels === 'yes' ? 'С дисками' : 'Без дисков'}</p>
                              ) : (
                                ''
                              )}
                              <p className="whitespace-nowrap">
                                до{' '}
                                {`${new Date(this.props.props.dateFinish)
                                  .getDate()
                                  .toString()
                                  .replace(/^(\d)$/, '0$1')}.${(
                                  new Date(this.props.props.dateFinish).getMonth() + 1
                                )
                                  .toString()
                                  .replace(/^(\d)$/, '0$1')}.${new Date(
                                  this.props.props.dateFinish
                                ).getFullYear()}`}
                              </p>
                            </td>
                          </tr>
                        ))
                      )
                  : null}
              </tbody>
            </table>
            <table className="w-full text-2xl my-2">
              <tbody className="border border-black text-center">
                {this.props.props.preorder.length > 0
                  ? this.props.props.preorder
                      .filter((it) => it.mode === 'full' && it.type === '1')
                      .reduce((acc, rec) => {
                        for (let i = 0; i < rec.quantity; i++) {
                          acc.push(rec)
                        }
                        return acc
                      }, [])
                      .map((it, index) => (
                        <tr key={index} className="py-2">
                          <td className="border border-black text-center p-2 py-3">
                            <p>№</p>
                            <p>
                              <b>{this.props.props.id_storages}</b>
                            </p>
                          </td>
                          <td className="border border-black text-center p-2 py-3">
                            <p>
                              <b>
                                {it.sizeone ? `${it.sizeone} ` : null}
                                {it.sizetwo ? `/ ${it.sizetwo} ` : null}
                                {it.sizethree ? `R${it.sizethree} ` : null}
                              </b>
                            </p>
                            <p>
                              {it.brand ? `${it.brand} ` : null}
                              {it.model ? `${it.model} ` : null}
                              {it.indexone ? `${it.indexone} ` : null}
                              {it.indextwo ? `${it.indextwo} ` : null}
                            </p>

                            <p>
                              {it.season === 'summer' ? 'летняя ' : null}
                              {it.season === 'winter' ? 'зимняя ' : null}
                              {it.season === 'all' ? 'всесезонная ' : null}
                            </p>
                          </td>
                          <td className="border border-black text-center p-2 py-3">
                            <p>{this.props.props.phone}</p>
                            <p>{this.props.props.name}</p>
                            <p className="whitespace-nowrap">
                              с{' '}
                              <b>{`${new Date(this.props.props.dateStart)
                                .getDate()
                                .toString()
                                .replace(/^(\d)$/, '0$1')}.${(
                                new Date(this.props.props.dateStart).getMonth() + 1
                              )
                                .toString()
                                .replace(/^(\d)$/, '0$1')}.${new Date(
                                this.props.props.dateStart
                              ).getFullYear()}`}</b>
                            </p>
                          </td>

                          <td className="border border-black text-center p-2 py-3">
                            <p>
                              <b>{it.quantity} шт.</b>
                            </p>
                            {it.wheels ? (
                              <p>{it.wheels === 'yes' ? 'С дисками' : 'Без дисков'}</p>
                            ) : (
                              ''
                            )}

                            <p className="whitespace-nowrap">
                              до{' '}
                              {`${new Date(this.props.props.dateFinish)
                                .getDate()
                                .toString()
                                .replace(/^(\d)$/, '0$1')}.${(
                                new Date(this.props.props.dateFinish).getMonth() + 1
                              )
                                .toString()
                                .replace(/^(\d)$/, '0$1')}.${new Date(
                                this.props.props.dateFinish
                              ).getFullYear()}`}
                            </p>
                          </td>
                        </tr>
                      ))
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}
