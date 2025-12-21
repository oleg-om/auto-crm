import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import sizethreeList from '../../lists/tyres/sizethree'

const TyresAnalysisModal = ({ open, onClose }) => {
  const [year, setYear] = useState(new Date().getFullYear())
  const [sizeFilter, setSizeFilter] = useState('')
  const [seasonFilter, setSeasonFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysisData, setAnalysisData] = useState([])

  useEffect(() => {
    if (open) {
      setYear(new Date().getFullYear())
      setSizeFilter('')
      setSeasonFilter('')
      setAnalysisData([])
    }
  }, [open])

  const handleAnalyze = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        year: year.toString(),
        sizeFilter,
        season: seasonFilter
      })

      const response = await fetch(`/api/v1/tyres/analysis?${params}`)
      const result = await response.json()

      if (result.status === 'ok') {
        setAnalysisData(result.data || [])
      } else {
        toast.error('Ошибка при получении данных анализа')
      }
    } catch (error) {
      toast.error('Ошибка при загрузке данных')
      // eslint-disable-next-line no-console
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const formatSize = (item) => {
    const parts = []
    if (item.sizeone) parts.push(item.sizeone)
    if (item.sizetwo) parts.push(`/${item.sizetwo}`)
    if (item.sizethree) parts.push(` R${item.sizethree}`)
    return parts.join('')
  }

  const formatSeason = (season) => {
    if (season === 'summer') return 'лето'
    if (season === 'winter') return 'зима'
    if (season === 'all') return 'всесезонная'
    return ''
  }

  const formatSpike = (stud) => {
    return stud === '1' || stud === 1 ? 'шип' : 'не шип'
  }

  const formatTyreSize = (item) => {
    return formatSize(item)
  }

  if (!open) return null

  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear; i >= currentYear - 10; i--) {
    years.push(i)
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleBackdropKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity"
          onClick={handleBackdropClick}
          onKeyDown={handleBackdropKeyDown}
          role="button"
          tabIndex={0}
          aria-label="Закрыть модальное окно"
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75" />
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" />
        &#8203;
        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900 mb-4"
                  id="modal-headline"
                >
                  Анализ продажи шин
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="year-select"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Год
                    </label>
                    <select
                      id="year-select"
                      className="block w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 rounded"
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                    >
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="size-select"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Размер
                    </label>
                    <select
                      id="size-select"
                      className="block w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 rounded"
                      value={sizeFilter}
                      onChange={(e) => setSizeFilter(e.target.value)}
                    >
                      <option value="">Все</option>
                      {sizethreeList.map((size) => (
                        <option key={size} value={size}>
                          R{size}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="season-select"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Сезон
                    </label>
                    <select
                      id="season-select"
                      className="block w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 rounded"
                      value={seasonFilter}
                      onChange={(e) => setSeasonFilter(e.target.value)}
                    >
                      <option value="">Все</option>
                      <option value="winter">Зима</option>
                      <option value="summer">Лето</option>
                      <option value="all">Всесезонная</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      className="w-full bg-green-600 text-white hover:bg-green-700 py-2 px-4 rounded"
                      onClick={handleAnalyze}
                      disabled={loading}
                    >
                      {loading ? 'Загрузка...' : 'Анализировать'}
                    </button>
                  </div>
                </div>
                {loading ? (
                  <div className="mt-4 text-center py-4">
                    <p className="text-gray-600">Загрузка данных...</p>
                  </div>
                ) : analysisData.length > 0 ? (
                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Типоразмер</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Шип/не шип</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Сезон</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Количество заказов</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysisData.slice(0, 40).map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">
                              {formatTyreSize(item)}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {formatSpike(item.stud)}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {formatSeason(item.season)}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              {item.count}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="mt-4 text-center py-4">
                    <p className="text-gray-600">Не найдено</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TyresAnalysisModal

