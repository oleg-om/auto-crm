import React, { useEffect, useRef } from 'react'

const OrganizationModal = ({ open, onClose, onConfirm, organizationName }) => {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current.focus()
    }
  }, [open])

  if (!open) return null

  const handleBackdropClick = () => {
    onClose()
  }

  const handleDialogClick = (e) => {
    e.stopPropagation()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-4" onClick={handleDialogClick}>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="org-modal-title"
          tabIndex={-1}
          onKeyDown={handleKeyDown}
        >
          <h2 id="org-modal-title" className="text-xl font-semibold mb-4">
            Выбор организации
          </h2>
          <p className="text-gray-700 mb-6">
            Клиент потенциально принадлежит к организации <strong>{organizationName}</strong>,
            выбрать <strong>{organizationName}</strong>?
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={onClose}
            >
              Отмена
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-main-600 text-white rounded hover:bg-main-700"
              onClick={onConfirm}
            >
              Выбрать
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrganizationModal
