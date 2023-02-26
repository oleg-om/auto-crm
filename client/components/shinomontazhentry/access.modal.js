import React from 'react'

const AccessModal = ({ open, onClose, itemId, deleteItem, activeAdress }) => {
  if (!open) return null

  const openDeleteModal = () => {
    deleteItem()
  }
  const propsDate = new Date(itemId.date)
  const dateActive = `${propsDate
    .getDate()
    .toString()
    .replace(/^(\d)$/, '0$1')}.${(propsDate.getMonth() + 1)
    .toString()
    .replace(/^(\d)$/, '0$1')}.${propsDate.getFullYear()}`.toString()

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
                  Дата записи: {dateActive} {itemId.time}
                </h3>
                <div className="mt-2">
                  <p className="text-sm leading-5 text-gray-900 mb-2">Запись невозможна</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {activeAdress === itemId.place ? (
              <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                <button
                  type="button"
                  onClick={openDeleteModal}
                  className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                >
                  Удалить
                </button>
              </span>
            ) : null}
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

export default AccessModal
