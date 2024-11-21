import React from 'react'

const UpdateModal = ({ open, onClose, onSubmit, activeCustomerName, onDisSubmit }) => {
  if (!open) return null

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75" />
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" />
        &#8203;
        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex justify-center">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                  Вы выбрали клиента и изменили его данные. Клиент будет обновлен. Продолжить?
                </h3>
                <div className="mt-2">
                  <p className="text-sm leading-5 text-gray-900 mb-2">
                    <b>Клиент:</b>
                  </p>
                  {activeCustomerName.name ? (
                    <p className="text-sm leading-5 text-gray-900 mb-2">
                      Имя: {activeCustomerName.name}
                    </p>
                  ) : null}
                  {activeCustomerName.phone ? (
                    <p className="text-sm leading-5 text-gray-900 mb-2">
                      Телефон: {activeCustomerName.phone}
                    </p>
                  ) : null}
                  <p className="text-sm leading-5 text-gray-900 mb-2">
                    Авто: {activeCustomerName.mark} {activeCustomerName.model}
                  </p>
                  {activeCustomerName.regnumber ? (
                    <p className="text-sm leading-5 text-gray-900 mb-2">
                      Гос. номер: {activeCustomerName.regnumber}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
              <button
                type="button"
                onClick={onSubmit}
                className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-main-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-main-500 focus:outline-none focus:border-main-700 focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm sm:leading-5"
              >
                Обновить
              </button>
            </span>
            <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
              <button
                type="button"
                onClick={onDisSubmit}
                className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-green-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm sm:leading-5"
              >
                Пропустить
              </button>
            </span>
            <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
              >
                Отмена
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateModal
