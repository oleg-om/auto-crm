import React from 'react'
import cx from 'classnames'
import GoBack from './GoBack'

const SubmitButtons = ({
  sendData,
  submitText = 'Сохранить',
  deleteButton = false,
  deleteButtonAction
}) => {
  return (
    <div className="flex my-2">
      <GoBack />
      {deleteButton && (
        <button
          className="my-3 mr-2 py-2 w-1/3 px-3 bg-red-800 text-white text-center hover:bg-red-900 hover:text-white rounded-lg"
          type="button"
          onClick={deleteButtonAction}
        >
          Удалить
        </button>
      )}
      <button
        className={cx(
          'my-3 ml-2 py-2 px-3 bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg',
          {
            'md:w-2/3': !deleteButton,
            'md:w-1/3': deleteButton
          }
        )}
        onClick={sendData}
        type="submit"
      >
        {submitText}
      </button>
    </div>
  )
}

export const ServiceSubmitButtons = ({ active, props, nextStep, change, preChange }) => {
  return (
    <div className="flex my-2">
      <GoBack />
      {active !== 'finish' ? (
        <button
          className="my-3 ml-2 py-3 w-2/3 px-3 bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg"
          onClick={nextStep}
          type="submit"
        >
          Далее
        </button>
      ) : null}
      {active === 'finish' && !props.dateFinish ? (
        <div className="w-2/3 flex flex-row">
          <button
            className="my-3 mx-2 py-3 w-1/2 px-3 bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg"
            onClick={preChange}
            type="submit"
          >
            Сохранить
          </button>
          <button
            className="my-3 ml-2 py-3 w-1/2 px-3 bg-green-600 text-white hover:bg-green-700 hover:text-white rounded-lg"
            onClick={change}
            type="submit"
          >
            Завершить
          </button>
        </div>
      ) : null}
      {active === 'finish' && props.dateFinish ? (
        <button
          className="my-3 ml-2 py-3 w-2/3 px-3 bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg"
          onClick={change}
          type="submit"
        >
          Сохранить
        </button>
      ) : null}
    </div>
  )
}

export default SubmitButtons
