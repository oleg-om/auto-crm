import React from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'
// import { useReactToPrint } from 'react-to-print'
// import ComponentToPrint from './storages.print'
import taskStatuses from '../../lists/storages-statuses'

export const WheelIcon = () => {
  return (
    <svg
      fill="#000000"
      height="20px"
      width="20px"
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 60 60"
      xmlSpace="preserve"
    >
      <path
        d="M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M50.236,42.907
	c-0.208,0.325-0.424,0.644-0.648,0.959c-0.032,0.045-0.063,0.091-0.096,0.136c-0.214,0.298-0.437,0.589-0.664,0.877
	c-0.045,0.057-0.088,0.115-0.134,0.171c-0.221,0.274-0.45,0.541-0.683,0.805c-0.054,0.062-0.106,0.125-0.161,0.187
	c-0.285,0.317-0.578,0.628-0.88,0.929c-0.303,0.302-0.614,0.596-0.932,0.882c-0.056,0.05-0.114,0.097-0.17,0.147
	c-0.27,0.238-0.544,0.473-0.824,0.699c-0.051,0.041-0.103,0.08-0.154,0.12c-0.293,0.232-0.591,0.459-0.895,0.678
	c-0.04,0.029-0.081,0.057-0.122,0.086c-0.318,0.226-0.641,0.445-0.97,0.655c-0.016,0.01-0.032,0.02-0.048,0.03l-8.026-13.899
	c0.02-0.015,0.037-0.035,0.058-0.05c0.535-0.415,1.015-0.895,1.43-1.43c0.016-0.02,0.035-0.037,0.05-0.058l13.899,8.026
	C50.257,42.873,50.247,42.89,50.236,42.907z M9.769,17.086c0.204-0.318,0.416-0.63,0.634-0.938c0.037-0.052,0.073-0.105,0.111-0.157
	c0.208-0.289,0.424-0.571,0.645-0.851c0.051-0.065,0.101-0.131,0.153-0.196c0.213-0.264,0.434-0.522,0.659-0.777
	c0.062-0.07,0.121-0.143,0.183-0.213c0.284-0.316,0.576-0.625,0.876-0.925c0.302-0.302,0.612-0.594,0.929-0.88
	c0.062-0.056,0.126-0.108,0.188-0.163c0.263-0.232,0.53-0.461,0.803-0.681c0.057-0.046,0.116-0.09,0.174-0.136
	c0.287-0.227,0.579-0.45,0.876-0.664c0.043-0.031,0.087-0.061,0.131-0.092c0.319-0.226,0.642-0.445,0.972-0.656
	c0.014-0.009,0.027-0.017,0.041-0.026l8.025,13.899c-0.02,0.015-0.037,0.035-0.058,0.05c-0.535,0.415-1.015,0.895-1.43,1.43
	c-0.016,0.02-0.035,0.037-0.05,0.058L9.733,17.144C9.745,17.125,9.757,17.106,9.769,17.086z M36.318,25.111
	c-0.415-0.535-0.895-1.015-1.43-1.43c-0.02-0.016-0.037-0.035-0.058-0.05l8.017-13.885c2.977,1.895,5.511,4.429,7.406,7.406
	l-13.885,8.017C36.353,25.149,36.334,25.132,36.318,25.111z M25.169,36.369l-8.018,13.886c-2.977-1.895-5.511-4.429-7.406-7.406
	l13.886-8.018c0.015,0.02,0.035,0.037,0.05,0.058c0.415,0.535,0.895,1.015,1.43,1.43C25.132,36.334,25.149,36.353,25.169,36.369z
	 M35,30c0,2.758-2.242,5-5,5s-5-2.242-5-5s2.242-5,5-5S35,27.242,35,30z M33.102,22.627c-0.66-0.279-1.367-0.465-2.102-0.557V6.025
	c3.578,0.146,7.018,1.076,10.123,2.709L33.102,22.627z M29,22.069c-0.736,0.092-1.443,0.278-2.102,0.557l-8.025-13.9
	C21.977,7.098,25.418,6.171,29,6.025V22.069z M22.627,26.898c-0.279,0.66-0.465,1.367-0.557,2.102H6.024
	c0.146-3.582,1.074-7.023,2.703-10.127L22.627,26.898z M22.069,31c0.092,0.735,0.278,1.442,0.557,2.102L8.733,41.124
	C7.101,38.018,6.171,34.578,6.024,31H22.069z M26.898,37.374c0.66,0.279,1.367,0.465,2.102,0.557v16.045
	c-3.578-0.146-7.018-1.076-10.124-2.709L26.898,37.374z M31,37.931c0.736-0.092,1.443-0.278,2.102-0.557l8.025,13.9
	C38.023,52.902,34.582,53.83,31,53.976V37.931z M37.373,33.102c0.279-0.66,0.465-1.367,0.557-2.102h16.045
	c-0.146,3.582-1.073,7.023-2.702,10.128L37.373,33.102z M37.931,29c-0.092-0.736-0.278-1.442-0.557-2.102l13.893-8.021
	c1.632,3.105,2.562,6.545,2.709,10.123H37.931z"
      />
    </svg>
  )
}

const StoragesRow = (props) => {
  // const componentRef = useRef()
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current
  // })
  const createDate = new Date(props.dateStart)
  const finishDate = new Date(props.dateFinish)
  return (
    <tr className="bg-white lg:hover:bg-gray-100 table-row flex-no-wrap mb-5 lg:mb-0">
      <td className="w-auto p-2 text-gray-800 text-sm text-center border border-b  table-cell static">
        {props.id_storages}
      </td>
      <td className="w-auto p-2 text-gray-800 text-left text-sm lg:text-center border border-b table-cell static">
        {props.name}
      </td>
      <td className="overflow-hidden w-auto max-w-lg p-2 text-gray-800 text-sm text-center border border-b table-cell static">
        {props.preorder
          ? props.preorder
              .filter((it) => it.mode === 'simple')
              .slice(0, 3)
              .map((it, index) => <p key={index}>{it.tyreItem}</p>)
          : null}
        {props.preorder
          ? props.preorder
              .filter((it) => it.mode === 'full' && it.type === '1')
              .slice(0, 3)
              .map((it) => (
                <p key={it.tyreItem}>
                  Шина: {it.brand ? `${it.brand} ` : null}
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
              ))
          : null}
        {props.preorder
          ? props.preorder
              .filter((it) => it.mode === 'full' && it.type === '3')
              .slice(0, 3)
              .map((it) => (
                <p key={it.tyreItem}>
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
              ))
          : null}
        {props.preorder
          ? props.preorder
              .filter((it) => it.mode === 'full' && it.type === '2')
              .slice(0, 3)
              .map((it) => (
                <p key={it.tyreItem}>
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
              ))
          : null}
      </td>
      <td className="whitespace-no-wrap w-auto p-2 text-gray-800 text-sm text-center border border-b table-cell static">
        {props.phone}
      </td>
      <td className="w-auto p-2 text-gray-800 text-sm text-center border border-b table-cell static">
        {props.employeeList ? `${props.employeeList.name} ${props.employeeList.surname}` : ''}
      </td>
      <td className="w-auto p-2 text-gray-800 text-sm text-center border border-b table-cell static">
        {props.placesList ? props.placesList.name : ''}
      </td>
      <td className="w-auto p-2 text-gray-800 text-sm text-center border border-b table-cell static whitespace-no-wrap">
        <div
          className={cx('rounded py-1 px-3 text-xs font-bold justify-center flex', {
            'bg-yellow-400': props.status === taskStatuses[0] || props.status === taskStatuses[1],
            'bg-green-400': props.status === taskStatuses[3],
            'bg-red-400': props.status === taskStatuses[2],
            'bg-purple-400': props.status === taskStatuses[4],
            'bg-gray-400': props.status === taskStatuses[5]
          })}
        >
          {props.status}
          {props.statusDates.find((it) => it.status === 'Печать сметы') ? (
            <div className="ml-2" title="Ранее печаталась смета">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                width="18"
                height="18"
                x="0"
                y="0"
                viewBox="0 0 512 512"
                xmlSpace="preserve"
                className="block m-auto"
              >
                <g>
                  <path
                    xmlns="http://www.w3.org/2000/svg"
                    d="m414 80h-316c-5.523 0-10-4.477-10-10v-26c0-24.301 19.699-44 44-44h248c24.301 0 44 19.699 44 44v26c0 5.523-4.477 10-10 10z"
                    fill="#4a5568"
                    data-original="#000000"
                  />
                  <path
                    xmlns="http://www.w3.org/2000/svg"
                    d="m458 112h-404c-29.776 0-54 24.224-54 54v188c0 29.776 24.224 54 54 54h34v-80c0-39.701 32.299-72 72-72h192c39.701 0 72 32.299 72 72v80h34c29.776 0 54-24.224 54-54v-188c0-29.776-24.224-54-54-54zm-361.98 120c-13.255 0-24.005-10.745-24.005-24s10.74-24 23.995-24h.01c13.255 0 24 10.745 24 24s-10.745 24-24 24z"
                    fill="#4a5568"
                    data-original="#000000"
                  />
                  <path
                    xmlns="http://www.w3.org/2000/svg"
                    d="m352 304h-192c-13.255 0-24 10.745-24 24v80 32c0 13.255 10.745 24 24 24h192c13.255 0 24-10.745 24-24v-32-80c0-13.255-10.745-24-24-24z"
                    fill="#4a5568"
                    data-original="#000000"
                  />
                </g>
              </svg>
            </div>
          ) : null}
          {props.statusDates.find((it) => it.status === 'Произведен шиномонтаж') ? (
            <div className="ml-2" title="Произведен шиномонтаж">
              <WheelIcon />
            </div>
          ) : null}
        </div>
      </td>
      <td className="w-auto p-2 text-gray-800 text-sm text-center border border-b hidden lg:table-cell static">
        {props.dateStart
          ? `${createDate
              .getDate()
              .toString()
              .replace(/^(\d)$/, '0$1')}.${(createDate.getMonth() + 1)
              .toString()
              .replace(/^(\d)$/, '0$1')}.${createDate.getFullYear()}`
          : ''}
      </td>
      <td className="w-auto p-2 text-gray-800 text-sm text-center border border-b hidden lg:table-cell static">
        {props.dateFinish
          ? `${finishDate
              .getDate()
              .toString()
              .replace(/^(\d)$/, '0$1')}.${(finishDate.getMonth() + 1)
              .toString()
              .replace(/^(\d)$/, '0$1')}.${finishDate.getFullYear()}`
          : ''}
      </td>
      <td className="w-auto p-2 text-gray-800 text-center border border-b table-cell static whitespace-no-wrap">
        <div className="flex flex-row justify-center">
          {/* <div
            title="Печать предчека"
            className="p-1 bg-gray-200 text-gray-700 hover:text-gray-600 border border-gray-600 hover:bg-gray-400 rounded h-22 w-22 mr-2"
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                width="18"
                height="18"
                x="0"
                y="0"
                viewBox="0 0 512 512"
                xmlSpace="preserve"
                className="block m-auto"
              >
                <g>
                  <path
                    xmlns="http://www.w3.org/2000/svg"
                    d="m414 80h-316c-5.523 0-10-4.477-10-10v-26c0-24.301 19.699-44 44-44h248c24.301 0 44 19.699 44 44v26c0 5.523-4.477 10-10 10z"
                    fill="#4a5568"
                    data-original="#000000"
                  />
                  <path
                    xmlns="http://www.w3.org/2000/svg"
                    d="m458 112h-404c-29.776 0-54 24.224-54 54v188c0 29.776 24.224 54 54 54h34v-80c0-39.701 32.299-72 72-72h192c39.701 0 72 32.299 72 72v80h34c29.776 0 54-24.224 54-54v-188c0-29.776-24.224-54-54-54zm-361.98 120c-13.255 0-24.005-10.745-24.005-24s10.74-24 23.995-24h.01c13.255 0 24 10.745 24 24s-10.745 24-24 24z"
                    fill="#4a5568"
                    data-original="#000000"
                  />
                  <path
                    xmlns="http://www.w3.org/2000/svg"
                    d="m352 304h-192c-13.255 0-24 10.745-24 24v80 32c0 13.255 10.745 24 24 24h192c13.255 0 24-10.745 24-24v-32-80c0-13.255-10.745-24-24-24z"
                    fill="#4a5568"
                    data-original="#000000"
                  />
                </g>
              </svg>
            </div>
          </div> */}
          <Link
            to={`/storages/edit/${props.id_storages}/${props.num ? props.num : ''}${
              props.searchParamsToUrl
            }`}
            className="px-5 py-1 text-xs border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"
          >
            Подробнее
          </Link>
        </div>
      </td>
      {/* <div className="hidden">
        <ComponentToPrint
          ref={componentRef}
          props={props}
          helpphone={props.settings.map((it) => it.helpphone)}
          placesList={props.placesList}
        />
      </div> */}
    </tr>
  )
}

export default StoragesRow
