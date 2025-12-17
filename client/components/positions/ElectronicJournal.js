import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import cx from 'classnames'
import Navbar from '../Navbar'
import Sidebar from '../Sidebar'
import Modal from '../Modal.delete'
import { getPositions, createPosition, deletePosition } from '../../redux/reducers/positions'
import PositionTab from './PositionTab'
import 'react-toastify/dist/ReactToastify.css'

const ElectronicJournal = () => {
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const dispatch = useDispatch()
  const positions = useSelector((s) => s.positions.list)
  const [activePositionId, setActivePositionId] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [itemId, setItemId] = useState('')
  const [newPositionName, setNewPositionName] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    dispatch(getPositions())
  }, [dispatch])

  useEffect(() => {
    if (positions.length > 0 && !activePositionId) {
      setActivePositionId(positions[0].id)
    }
  }, [positions, activePositionId])

  const openAndDelete = (id) => {
    const position = positions.find((p) => p.id === id)
    if (position && position.duties && position.duties.length > 0) {
      notify('Нельзя удалить должность с обязанностями')
      return
    }
    setIsOpen(true)
    setItemId(id)
  }

  const deletePositionLocal = (id) => {
    dispatch(deletePosition(id)).then((result) => {
      if (result && result.status === 'ok') {
        setIsOpen(false)
        notify('Должность удалена')
        if (activePositionId === id && positions.length > 1) {
          const remainingPositions = positions.filter((p) => p.id !== id)
          if (remainingPositions.length > 0) {
            setActivePositionId(remainingPositions[0].id)
          } else {
            setActivePositionId(null)
          }
        } else if (positions.length === 1) {
          setActivePositionId(null)
        }
      } else if (result && result.status === 'error') {
        notify(result.message || 'Ошибка при удалении')
      }
    })
  }

  const handleCreatePosition = () => {
    if (!newPositionName.trim()) {
      notify('Введите название должности')
      return
    }
    dispatch(createPosition(newPositionName.trim())).then(() => {
      setNewPositionName('')
      setShowAddForm(false)
      notify('Должность добавлена')
    })
  }

  const activePosition = positions.find((p) => p.id === activePositionId)

  return (
    <div>
      <Navbar />
      <div className="flex flex-row">
        <Sidebar />
        <div className="container mx-auto px-4">
          <h1 className="text-3xl py-4 border-b mb-6">Электронный журнал</h1>

          {/* Вкладки должностей */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {positions.map((position) => (
                <button
                  key={position.id}
                  type="button"
                  onClick={() => setActivePositionId(position.id)}
                  className={cx(
                    'px-4 py-2 rounded-lg border-2 transition-colors',
                    activePositionId === position.id
                      ? 'bg-main-600 text-white border-main-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  )}
                >
                  {position.name}
                  {position.duties && position.duties.length > 0 && (
                    <span className="ml-2 text-xs opacity-75">
                      ({position.duties.length})
                    </span>
                  )}
                </button>
              ))}
              {!showAddForm ? (
                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className="px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-main-600 hover:text-main-600 transition-colors"
                >
                  + Добавить должность
                </button>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-main-600">
                  <input
                    type="text"
                    value={newPositionName}
                    onChange={(e) => setNewPositionName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleCreatePosition()
                      }
                    }}
                    placeholder="Название должности"
                    className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-main-600"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleCreatePosition}
                    className="px-3 py-1 bg-main-600 text-white rounded hover:bg-main-700"
                  >
                    ✓
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false)
                      setNewPositionName('')
                    }}
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Кнопка удаления активной должности */}
            {activePosition && (
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={() => openAndDelete(activePosition.id)}
                  disabled={activePosition.duties && activePosition.duties.length > 0}
                  className={cx(
                    'px-4 py-2 rounded-lg border-2 transition-colors',
                    activePosition.duties && activePosition.duties.length > 0
                      ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                      : 'bg-red-500 text-white border-red-500 hover:bg-red-600'
                  )}
                >
                  Удалить должность
                </button>
              </div>
            )}
          </div>

          {/* Содержимое активной должности */}
          {activePosition ? (
            <PositionTab position={activePosition} />
          ) : (
            <div className="text-center py-12 text-gray-500">
              {positions.length === 0
                ? 'Добавьте первую должность'
                : 'Выберите должность'}
            </div>
          )}
        </div>
        <Modal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onSubmit={() => deletePositionLocal(itemId)}
        />
      </div>
    </div>
  )
}

export default ElectronicJournal

