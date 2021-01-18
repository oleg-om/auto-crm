import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import XLSX from 'xlsx'
import 'react-toastify/dist/ReactToastify.css'
import LoadExample from './load.example'
import Modal from '../Modal.delete'

const ShinomontazhpriceImport = (props) => {
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const history = useHistory()
  // const [state, setState] = useState({
  //   name: '',
  //   artikul: '',
  //   price: '',
  //   quantity: '',
  //   type: ''
  // })

  // const onChange = (e) => {
  //   const { name, value } = e.target
  //   setState((prevState) => ({
  //     ...prevState,
  //     [name]: value
  //   }))
  // }

  const [load, setLoad] = useState('')
  const [loadingData, setLoadingData] = useState([])
  // const [finishData, setFinishData] = useState([])
  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsArrayBuffer(file)

      fileReader.onload = (e) => {
        setLoad('loading')

        const bufferArray = e.target.result

        const wb = XLSX.read(bufferArray, { type: 'buffer' })

        const wsname = wb.SheetNames[0]

        const ws = wb.Sheets[wsname]

        const data = XLSX.utils.sheet_to_json(ws)

        resolve(data)
      }
      fileReader.onerror = (error) => {
        reject(error)
        setLoad('error')
      }
    })

    promise.then((d) => {
      setLoadingData(d)
      setLoad('finish')
    })
  }

  const [isOpen, SetIsOpen] = useState(false)
  const sendData = () => {
    if (loadingData === undefined) notify('Загрузите файл')
    else {
      props.create(loadingData)
      history.push('/shinomontazhprice/list')
      notify('Услуги добавлены')
      props.getShinomontazhprice()
    }
  }

  const deleteData = () => {
    props.delete()
    notify('Услуги удалены')
    props.getShinomontazhprice()
    SetIsOpen(false)
  }
  return (
    <div>
      <div className="bg-white shadow rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
        <div className="-mx-3 md:flex flex-wrap mb-3">
          <div className="px-3 mb-4 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Перед загрузкой удалите все услуги
            </label>
            <button
              type="button"
              onClick={() => SetIsOpen(true)}
              className="p-1 text-white bg-red-600 hover:bg-red-700 rounded-lg"
            >
              Удалить все услуги
            </button>
          </div>
        </div>
        <div className="-mx-3 md:flex flex-wrap mt-3">
          <div className="md:w-1/2 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Загрузите файл Xls или Xlsx
            </label>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files[0]
                readExcel(file)
              }}
            />
          </div>
        </div>
        <div className="my-2">
          {load === 'loading' ? <p className="text-gray-900">Загрузка...</p> : null}
          {load === 'error' ? <p className="text-red-600">Ошибка</p> : null}
          {load === 'finish' ? (
            <p className="text-gray-900">Файл загружен, обнаружено {loadingData.length} услуг</p>
          ) : null}
        </div>
        <div>
          <label
            className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
            htmlFor="grid-first-name"
          >
            Как должна выглядеть загружаемая таблица
          </label>
          <LoadExample />
        </div>
        <div
          className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 mt-3 shadow-md"
          role="alert"
        >
          <div className="flex">
            <div className="py-1">
              <svg
                className="fill-current h-6 w-6 text-teal-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Прочтите перед загрузкой прайса</p>
              <p className="text-sm">Сформируйте таблицу:</p>
              <p className="text-sm">
                <b>name</b> - Наименование
              </p>
              <p className="text-sm">
                <b>artikul</b> - Артикул
              </p>
              <p className="text-sm">
                <b>price</b> - Розничная цена
              </p>
              <p className="text-sm">
                <b>quantity</b> - Количество
              </p>
              <p className="text-sm">
                <b>category</b> - Категория, например: Латки универсальные, Вентили для легковых
                автомобилей
              </p>
              <p className="text-sm">
                <b>type</b> - Направление, существуют следующие типы:{' '}
                <p className="text-sm mt-2">
                  В таблице все указанные значения пишем английскими буквами без пробелов,
                  маленькими буквами
                </p>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className=" flex my-2">
        <Link
          to="/shinomontazhprice/list"
          className="my-3 mr-2 py-2 md:w-1/3 px-3 bg-red-600 text-white text-center hover:bg-red-700 hover:text-white rounded-lg"
        >
          Отмена
        </Link>

        <button
          className="my-3 ml-2 py-2 md:w-2/3 px-3 bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg"
          onClick={sendData}
          type="submit"
        >
          Загрузить
        </button>
      </div>
      <Modal open={isOpen} onClose={() => SetIsOpen(false)} onSubmit={deleteData} />
    </div>
  )
}

export default ShinomontazhpriceImport
