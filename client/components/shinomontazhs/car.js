import React from 'react'
import cx from 'classnames'

const Car = ({
  regOpen,
  onChangeRegNumber,
  onDeleteRegNumber,
  onChangeRegnumberUppercaseRussian,
  switchKeyboard,
  acceptRegnumber,
  openRegModal,
  state,
  keyboard,
  options
}) => {
  return (
    <div className="md:flex md:flex-col -mx-3">
      <div className="px-3 mb-6 md:mb-0 w-full">
        <div className="relative inline-block text-left w-1/2">
          <div>
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="phone"
            >
              Гос. номер
            </label>
            <div className="flex-shrink w-full inline-block relative">
              <input
                className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-2 px-4 pr-8 rounded"
                type="text"
                placeholder="Русскими буквами, необязательное поле"
                value={state.regnumber}
                name="regnumber"
                id="regnumber"
                autoComplete="off"
                onClick={openRegModal}
                onChange={keyboard === true ? onChangeRegnumberUppercaseRussian : null}
              />
            </div>
          </div>

          <div
            className={cx(
              'absolute mt-2 p-3 w-full rounded-md shadow bg-gray-200 border-2 border-gray-600 z-50',
              {
                hidden: regOpen === false,
                block: regOpen === true
              }
            )}
          >
            <div className="flex flex-row">
              <div className="w-full flex flex-row mb-2">
                <div className="p-1 w-1/5">
                  <button
                    type="button"
                    className="p-1 m-1 text-xl rounded font-bold bg-blue-200 hover:bg-blue-300 border-blue-600 border-2 text-gray-900 w-full h-full"
                    onClick={onDeleteRegNumber}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      width="40"
                      height="40"
                      x="0"
                      y="0"
                      viewBox="0 0 512 512"
                      xmlSpace="preserve"
                      className="inline-block"
                    >
                      <g>
                        <g xmlns="http://www.w3.org/2000/svg">
                          <g>
                            <path
                              d="M492,236H68.442l70.164-69.824c7.829-7.792,7.859-20.455,0.067-28.284c-7.792-7.83-20.456-7.859-28.285-0.068    l-104.504,104c-0.007,0.006-0.012,0.013-0.018,0.019c-7.809,7.792-7.834,20.496-0.002,28.314c0.007,0.006,0.012,0.013,0.018,0.019    l104.504,104c7.828,7.79,20.492,7.763,28.285-0.068c7.792-7.829,7.762-20.492-0.067-28.284L68.442,276H492    c11.046,0,20-8.954,20-20C512,244.954,503.046,236,492,236z"
                              fill="#3182ce"
                              data-original="#000000"
                            />
                          </g>
                        </g>
                      </g>
                    </svg>
                  </button>
                </div>
                <div className="p-1 w-3/5">
                  <button
                    type="button"
                    className="p-1 m-1 text-xl rounded font-bold  bg-green-200 hover:bg-green-300 border-green-600 border-2 text-gray-900 w-full h-full"
                    onClick={acceptRegnumber}
                  >
                    Ок
                  </button>
                </div>
                <div className="p-1 w-1/5">
                  <button
                    type="button"
                    className="p-1 m-1 text-xl rounded font-bold bg-red-200 hover:bg-red-300 border-red-600 border-2 text-gray-900 w-full h-full"
                    onClick={acceptRegnumber}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      width="23"
                      height="23"
                      x="0"
                      y="0"
                      viewBox="0 0 365.696 365.696"
                      xmlSpace="preserve"
                      className="inline-block"
                    >
                      <g>
                        <path
                          xmlns="http://www.w3.org/2000/svg"
                          d="m243.1875 182.859375 113.132812-113.132813c12.5-12.5 12.5-32.765624 0-45.246093l-15.082031-15.082031c-12.503906-12.503907-32.769531-12.503907-45.25 0l-113.128906 113.128906-113.132813-113.152344c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503907-12.5 32.769531 0 45.25l113.152344 113.152344-113.128906 113.128906c-12.503907 12.503907-12.503907 32.769531 0 45.25l15.082031 15.082031c12.5 12.5 32.765625 12.5 45.246093 0l113.132813-113.132812 113.128906 113.132812c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082031c12.5-12.503906 12.5-32.769531 0-45.25zm0 0"
                          fill="#e53e3e"
                          data-original="#000000"
                        />
                      </g>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-row">
              <div className="w-1/2 flex flex-wrap mr-2">
                <div className="w-1/3 p-1">
                  <button
                    type="button"
                    className="p-3 m-1 text-lg rounded bg-yellow-200 hover:bg-yellow-300 border-blue-400 border-2 text-gray-900 w-full"
                    onClick={onChangeRegNumber}
                    value="А"
                  >
                    А
                  </button>
                </div>
                <div className="w-1/3 p-1">
                  <button
                    type="button"
                    className="p-3 m-1 text-lg rounded bg-yellow-200 hover:bg-yellow-300 border-blue-400 border-2 text-gray-900 w-full"
                    onClick={onChangeRegNumber}
                    value="В"
                  >
                    В
                  </button>
                </div>
                <div className="w-1/3 p-1">
                  <button
                    type="button"
                    className="p-3 m-1 text-lg rounded bg-yellow-200 hover:bg-yellow-300 border-blue-400 border-2 text-gray-900 w-full"
                    onClick={onChangeRegNumber}
                    value="Е"
                  >
                    Е
                  </button>
                </div>
                <div className="w-1/3 p-1">
                  <button
                    type="button"
                    className="p-3 m-1 text-lg rounded bg-yellow-200 hover:bg-yellow-300 border-blue-400 border-2 text-gray-900 w-full"
                    onClick={onChangeRegNumber}
                    value="К"
                  >
                    К
                  </button>
                </div>
                <div className="w-1/3 p-1">
                  <button
                    type="button"
                    className="p-3 m-1 text-lg rounded bg-yellow-200 hover:bg-yellow-300 border-blue-400 border-2 text-gray-900 w-full"
                    onClick={onChangeRegNumber}
                    value="М"
                  >
                    М
                  </button>
                </div>
                <div className="w-1/3 p-1">
                  <button
                    type="button"
                    className="p-3 m-1 text-lg rounded bg-yellow-200 hover:bg-yellow-300 border-blue-400 border-2 text-gray-900 w-full"
                    onClick={onChangeRegNumber}
                    value="Н"
                  >
                    Н
                  </button>
                </div>
                <div className="w-1/3 p-1">
                  <button
                    type="button"
                    className="p-3 m-1 text-lg rounded bg-yellow-200 hover:bg-yellow-300 border-blue-400 border-2 text-gray-900 w-full"
                    onClick={onChangeRegNumber}
                    value="О"
                  >
                    О
                  </button>
                </div>
                <div className="w-1/3 p-1">
                  <button
                    type="button"
                    className="p-3 m-1 text-lg rounded bg-yellow-200 hover:bg-yellow-300 border-blue-400 border-2 text-gray-900 w-full"
                    onClick={onChangeRegNumber}
                    value="Р"
                  >
                    Р
                  </button>
                </div>
                <div className="w-1/3 p-1">
                  <button
                    type="button"
                    className="p-3 m-1 text-lg rounded bg-yellow-200 hover:bg-yellow-300 border-blue-400 border-2 text-gray-900 w-full"
                    onClick={onChangeRegNumber}
                    value="С"
                  >
                    С
                  </button>
                </div>
                <div className="w-1/3 p-1">
                  <button
                    type="button"
                    className="p-3 m-1 text-lg rounded bg-yellow-200 hover:bg-yellow-300 border-blue-400 border-2 text-gray-900 w-full"
                    onClick={onChangeRegNumber}
                    value="Т"
                  >
                    Т
                  </button>
                </div>
                <div className="w-1/3 p-1">
                  <button
                    type="button"
                    className="p-3 m-1 text-lg rounded bg-yellow-200 hover:bg-yellow-300 border-blue-400 border-2 text-gray-900 w-full"
                    onClick={onChangeRegNumber}
                    value="У"
                  >
                    У
                  </button>
                </div>
                <div className="w-1/3 p-1">
                  <button
                    type="button"
                    className="p-3 m-1 text-lg rounded bg-yellow-200 border-blue-400 border-2 text-gray-900 w-full"
                    onClick={onChangeRegNumber}
                    value="Х"
                  >
                    Х
                  </button>
                </div>
              </div>

              <div className="w-1/2 flex flex-wrap ml-2">
                <div className="w-1/3 p-1">
                  <button
                    type="button"
                    className="p-3 m-1 text-lg rounded bg-white hover:bg-yellow-300 border-blue-400 border-2 text-gray-900 w-full"
                    onClick={onChangeRegNumber}
                    value="1"
                  >
                    1
                  </button>
                </div>
                <div className="w-1/3 p-1">
                  <button
                    type="button"
                    className="p-3 m-1 text-lg rounded bg-white hover:bg-yellow-300 border-blue-400 border-2 text-gray-900 w-full"
                    onClick={onChangeRegNumber}
                    value="2"
                  >
                    2
                  </button>
                </div>
                <div className="w-1/3 p-1">
                  <button
                    type="button"
                    className="p-3 m-1 text-lg rounded bg-white hover:bg-yellow-300 border-blue-400 border-2 text-gray-900 w-full"
                    onClick={onChangeRegNumber}
                    value="3"
                  >
                    3
                  </button>
                </div>
                <div className="w-1/3 p-1">
                  <button
                    type="button"
                    className="p-3 m-1 text-lg rounded bg-white hover:bg-yellow-300 border-blue-400 border-2 text-gray-900 w-full"
                    onClick={onChangeRegNumber}
                    value="4"
                  >
                    4
                  </button>
                </div>
                <div className="w-1/3 p-1">
                  <button
                    type="button"
                    className="p-3 m-1 text-lg rounded bg-white hover:bg-yellow-300 border-blue-400 border-2 text-gray-900 w-full"
                    onClick={onChangeRegNumber}
                    value="5"
                  >
                    5
                  </button>
                </div>
                <div className="w-1/3 p-1">
                  <button
                    type="button"
                    className="p-3 m-1 text-lg rounded bg-white hover:bg-yellow-300 border-blue-400 border-2 text-gray-900 w-full"
                    onClick={onChangeRegNumber}
                    value="6"
                  >
                    6
                  </button>
                </div>
                <div className="w-1/3 p-1">
                  <button
                    type="button"
                    className="p-3 m-1 text-lg rounded bg-white hover:bg-yellow-300 border-blue-400 border-2 text-gray-900 w-full"
                    onClick={onChangeRegNumber}
                    value="7"
                  >
                    7
                  </button>
                </div>
                <div className="w-1/3 p-1">
                  <button
                    type="button"
                    className="p-3 m-1 text-lg rounded bg-white hover:bg-yellow-300 border-blue-400 border-2 text-gray-900 w-full"
                    onClick={onChangeRegNumber}
                    value="8"
                  >
                    8
                  </button>
                </div>
                <div className="w-1/3 p-1">
                  <button
                    type="button"
                    className="p-3 m-1 text-lg rounded bg-white hover:bg-yellow-300 border-blue-400 border-2 text-gray-900 w-full"
                    onClick={onChangeRegNumber}
                    value="9"
                  >
                    9
                  </button>
                </div>
                <div className="w-1/3 p-1">
                  <button
                    type="button"
                    className="p-3 m-1 text-lg rounded bg-white hover:bg-yellow-300 border-blue-400 border-2 text-gray-900 w-full"
                    onClick={onChangeRegNumber}
                    value="0"
                  >
                    0
                  </button>
                </div>
                <div className="w-2/3 p-1 pl-6">
                  <button
                    type="button"
                    className="flex flex-row p-3 m-1 text-base rounded bg-orange-200 hover:bg-yellow-300 border-orange-600 border-2 text-gray-900 w-full"
                    onClick={switchKeyboard}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      width="30"
                      height="30"
                      x="0"
                      y="0"
                      viewBox="0 0 548.176 548.176"
                      xmlSpace="preserve"
                      className="mr-2"
                    >
                      <g>
                        <g xmlns="http://www.w3.org/2000/svg">
                          <g>
                            <path
                              d="M537.468,120.342c-7.139-7.139-15.753-10.709-25.841-10.709H36.545c-10.088,0-18.699,3.571-25.837,10.709    C3.571,127.48,0,136.094,0,146.179v255.815c0,10.089,3.571,18.698,10.708,25.837c7.139,7.139,15.749,10.712,25.837,10.712h475.082    c10.088,0,18.702-3.573,25.841-10.712c7.135-7.139,10.708-15.748,10.708-25.837V146.179    C548.176,136.094,544.603,127.48,537.468,120.342z M511.627,401.994H36.545V146.179h475.082V401.994z"
                              fill="#dd6b20"
                              data-original="#000000"
                            />
                            <path
                              d="M77.657,365.445h27.408c3.046,0,4.569-1.526,4.569-4.568v-27.408c0-3.039-1.52-4.568-4.569-4.568H77.657    c-3.044,0-4.568,1.529-4.568,4.568v27.408C73.089,363.919,74.613,365.445,77.657,365.445z"
                              fill="#dd6b20"
                              data-original="#000000"
                            />
                            <path
                              d="M77.657,292.362h63.954c3.045,0,4.57-1.53,4.57-4.572v-27.41c0-3.045-1.525-4.565-4.57-4.568H77.657    c-3.044,0-4.568,1.523-4.568,4.568v27.41C73.089,290.832,74.613,292.362,77.657,292.362z"
                              fill="#dd6b20"
                              data-original="#000000"
                            />
                            <path
                              d="M77.657,219.268h27.408c3.046,0,4.569-1.525,4.569-4.57v-27.406c0-3.046-1.52-4.565-4.569-4.57H77.657    c-3.044,0-4.568,1.524-4.568,4.57v27.406C73.089,217.743,74.613,219.268,77.657,219.268z"
                              fill="#dd6b20"
                              data-original="#000000"
                            />
                            <path
                              d="M397.43,328.903H150.751c-3.046,0-4.57,1.526-4.57,4.572v27.404c0,3.039,1.524,4.572,4.57,4.572h246.67    c3.046,0,4.572-1.526,4.572-4.572v-27.404C401.994,330.43,400.468,328.903,397.43,328.903z"
                              fill="#dd6b20"
                              data-original="#000000"
                            />
                            <path
                              d="M182.725,287.79c0,3.042,1.523,4.572,4.565,4.572h27.412c3.044,0,4.565-1.53,4.565-4.572v-27.41    c0-3.045-1.518-4.565-4.565-4.568H187.29c-3.042,0-4.565,1.523-4.565,4.568V287.79z"
                              fill="#dd6b20"
                              data-original="#000000"
                            />
                            <path
                              d="M150.751,219.268h27.406c3.046,0,4.57-1.525,4.57-4.57v-27.406c0-3.046-1.524-4.565-4.57-4.57h-27.406    c-3.046,0-4.57,1.524-4.57,4.57v27.406C146.181,217.743,147.706,219.268,150.751,219.268z"
                              fill="#dd6b20"
                              data-original="#000000"
                            />
                            <path
                              d="M255.813,287.79c0,3.042,1.524,4.572,4.568,4.572h27.408c3.046,0,4.572-1.53,4.572-4.572v-27.41    c0-3.045-1.526-4.565-4.572-4.568h-27.408c-3.044,0-4.568,1.523-4.568,4.568V287.79z"
                              fill="#dd6b20"
                              data-original="#000000"
                            />
                            <path
                              d="M223.837,219.268h27.406c3.046,0,4.57-1.525,4.57-4.57v-27.406c0-3.046-1.521-4.565-4.57-4.57h-27.406    c-3.046,0-4.57,1.524-4.57,4.57v27.406C219.267,217.743,220.791,219.268,223.837,219.268z"
                              fill="#dd6b20"
                              data-original="#000000"
                            />
                            <path
                              d="M328.904,287.79c0,3.042,1.525,4.572,4.564,4.572h27.412c3.045,0,4.564-1.53,4.564-4.572v-27.41    c0-3.045-1.52-4.565-4.564-4.568h-27.412c-3.039,0-4.564,1.523-4.564,4.568V287.79z"
                              fill="#dd6b20"
                              data-original="#000000"
                            />
                            <path
                              d="M470.513,328.903h-27.404c-3.046,0-4.572,1.526-4.572,4.572v27.404c0,3.039,1.526,4.572,4.572,4.572h27.404    c3.046,0,4.572-1.526,4.572-4.572v-27.404C475.085,330.43,473.562,328.903,470.513,328.903z"
                              fill="#dd6b20"
                              data-original="#000000"
                            />
                            <path
                              d="M296.928,219.268h27.411c3.046,0,4.565-1.525,4.565-4.57v-27.406c0-3.046-1.52-4.565-4.565-4.57h-27.411    c-3.046,0-4.565,1.524-4.565,4.57v27.406C292.362,217.743,293.882,219.268,296.928,219.268z"
                              fill="#dd6b20"
                              data-original="#000000"
                            />
                            <path
                              d="M370.018,219.268h27.404c3.046,0,4.572-1.525,4.572-4.57v-27.406c0-3.046-1.526-4.565-4.572-4.57h-27.404    c-3.046,0-4.572,1.524-4.572,4.57v27.406C365.445,217.743,366.972,219.268,370.018,219.268z"
                              fill="#dd6b20"
                              data-original="#000000"
                            />
                            <path
                              d="M401.991,287.79c0,3.042,1.522,4.572,4.568,4.572h63.953c3.046,0,4.572-1.53,4.572-4.572V187.292    c0-3.046-1.522-4.565-4.572-4.57h-27.404c-3.046,0-4.572,1.524-4.572,4.57v68.52H406.56c-3.046,0-4.568,1.523-4.568,4.568V287.79z    "
                              fill="#dd6b20"
                              data-original="#000000"
                            />
                          </g>
                        </g>
                      </g>
                    </svg>
                    Клавиатура
                  </button>
                </div>
              </div>

              {/* <button
                    type="button"
                    className="p-2 bg-red-600 text-white"
                    onClick={() => setRegOpen(false)}
                  >
                    X
                  </button> */}
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-col">
          <label
            className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
            htmlFor="phone"
          >
            Марка авто
          </label>
          <div className="flex-shrink w-full inline-block relative">
            <select
              className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
              name="regnumber"
              id="regnumber"
            >
              <option value="" hidden>
                Выберите бренд
              </option>
              {options.mark.map((it) => (
                <option value={it.name} label={it.name} key={it.id_car_mark} />
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Car
