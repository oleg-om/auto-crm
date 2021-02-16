import React from 'react'
// import cx from 'classnames'

const Final = ({
  //     materialprices,
  shinomontazhprices,
  //   checkboxServiceChange,
  state,
  service
}) => {
  console.log(state)
  const kuzovCheck = () => {
    if (state.kuzov === 'sedan') return 'Седан'
    if (state.kuzov === 'crossover') return 'Кроссовер'
    if (state.kuzov === 'runflat') return 'RUN FLAT'
    if (state.kuzov === 'gruz') return 'Грузовой'
    if (state.kuzov === 'selhoz') return 'Сельхоз'
    return ''
  }
  const serviceCheck = () => {
    service.reduce(
      (acc, rec) => [...acc, shinomontazhprices.find((it) => it.id === rec.serviceName).name],
      []
    )
  }
  console.log(serviceCheck())
  return (
    <div>
      <div className="flex flex-row -mx-3">
        <div className="px-3 mb-6 md:mb-0 w-1/3">
          <label
            className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
            htmlFor="grid-first-name"
          >
            Гос номер
          </label>
          <div className="flex flex-col relative">
            <div className="bg-grey-lighter border-2 border-black py-1 px-2 rounded-lg w-auto">
              {state.regnumber}
            </div>
          </div>
        </div>
        <div className="px-3 mb-6 md:mb-0 w-1/3">
          <label
            className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
            htmlFor="grid-first-name"
          >
            Авто
          </label>
          <div className="flex flex-col relative">
            <div className="py-1 px-2 w-auto">
              {state.mark} {state.model}
            </div>
          </div>
        </div>
        <div className="px-3 mb-6 md:mb-0 w-1/3">
          <label
            className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
            htmlFor="grid-first-name"
          >
            Диаметр, категория
          </label>
          <div className="flex flex-col relative">
            <div className="py-1 px-2 w-auto">
              R{state.diametr}, {kuzovCheck()}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row -mx-3">
        <div className="px-3 mb-6 md:mb-0 w-1/3">
          <label
            className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
            htmlFor="grid-first-name"
          >
            Гос номер
          </label>
          <div className="flex flex-col relative">
            <div className="bg-grey-lighter border-2 border-black py-1 px-2 rounded-lg w-auto">
              {state.regnumber}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Final
