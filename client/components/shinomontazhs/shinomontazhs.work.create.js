import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import cx from 'classnames'
import 'react-toastify/dist/ReactToastify.css'
import Employee from './employees'
import Car from './car'
import Service from './service'
import Material from './material'
import Final from './final'
import sizeThreeList from '../../lists/shinomontazhdiametr'
import { useKeyboard } from '../../hooks/keyboard'
import { useMaterials } from '../../hooks/handleMaterials'
import { useServices } from '../../hooks/handleServices'
import SubmitButtons from '../shared/buttons/OrderSubmitButtons'
import { GroupSwitch, useGroup } from '../../hooks/useGroup'

const ShinomontazhsCreate = (props) => {
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const history = useHistory()

  const employeeList = useSelector((s) => s.employees.list)
  const auth = useSelector((s) => s.auth)
  const shinomontazhprices = useSelector((s) => s.shinomontazhprices.list)
  const materialprices = useSelector((s) => s.materials.list)
  const placeList = useSelector((s) => s.places.list)

  const currentPlace = placeList.find((it) => it.id === auth.place)

  const [regNumber, setRegNumber] = useState([])
  const { keyboard, regOpen, setRegOpen, switchKeyboard } = useKeyboard()
  const { group, onChangeGroup, groupCount, setGroupCount } = useGroup()

  const [box, setBox] = useState('')

  const [state, setState] = useState({
    place: auth.place,
    regnumber: regNumber.toString(),
    mark: '',
    model: '',
    comment: '',
    kuzov: '',
    diametr: '',
    dateStart: new Date()
  })

  const {
    materials,
    checkboxMaterialChange,
    materialPlusChange,
    materialEightChange,
    checkboxMaterialPlusChange,
    materialMinusChange,
    materialPriceChange,
    materialOnChange
  } = useMaterials(null, group)

  const {
    service,
    checkboxServiceChange,
    servicePlusChange,
    serviceMinusChange,
    onServiceQuantityChange,
    servicePriceChange
  } = useServices(null, group)

  const [tyres, setTyres] = useState({ sale: 'no' })
  const [employees, setEmployees] = useState([])

  const onChangeRegNumber = (e) => {
    const { value } = e.target
    setRegNumber((prevState) => [...prevState.concat(value)])
  }
  const onDeleteRegNumber = () => {
    const removeItem = regNumber.filter((element, index) => index < regNumber.length - 1)
    setRegNumber(removeItem)
  }
  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      regnumber: regNumber.join('').toString()
    }))
  }, [regNumber])
  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      place: auth.place
    }))
  }, [auth])

  const onChangeRegnumberUppercaseRussian = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value
        .toUpperCase()
        .replace(/\s/g, '')
        .replace(/[^а-яё0-9]/i, '')
    }))
  }

  // const switchKeyboard = () => {
  //   setKeyboard(true)
  //   setRegOpen(false)
  // }

  const acceptRegnumber = () => {
    setRegOpen(false)
  }

  const openRegModal = () => {
    if (keyboard === false) {
      setRegOpen(true)
    }
  }

  const [options, setOptions] = useState({
    mark: [],
    model: []
  })

  const [stateId, setStateId] = useState({
    mark: '',
    model: ''
  })

  const [customer, setCustomer] = useState({
    mark: '',
    model: '',
    idOfItem: ''
  })

  const onChangeMark = (e) => {
    const { value } = e.target
    const findCar = options.mark ? options.mark.find((it) => value === it.name) : null
    setState((prevState) => ({
      ...prevState,
      mark: value,
      model: ''
    }))
    setStateId((prevState) => ({
      ...prevState,
      mark: findCar ? findCar.id_car_mark : '',
      model: ''
    }))
    setCustomer((prevState) => ({
      ...prevState,
      mark: value
    }))
    setOptions((prevState) => ({
      mark: prevState.mark,
      model: []
    }))
  }

  const onChangeModel = (e) => {
    const { value } = e.target
    const finModel = options.model.find((it) => value === it.name)
    setState((prevState) => ({
      ...prevState,
      model: value
    }))
    setStateId((prevState) => ({
      ...prevState,
      model: finModel ? finModel.id_car_model : ''
    }))
    setCustomer((prevState) => ({
      ...prevState,
      model: value
    }))
  }

  const [search, setSearch] = useState()
  const [activeCustomer, setActiveCustomer] = useState('')

  const onSearchChange = (event) => {
    setSearch(event.target.value)
  }
  const onChange = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }
  const onChangeTyres = (e) => {
    const { name, value } = e.target
    setTyres((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }
  const checkboxTyresChange = (e) => {
    const { checked } = e.target
    if (checked) {
      setTyres((prevState) => ({
        ...prevState,
        sale: 'yes'
      }))
    } else {
      setTyres((prevState) => ({
        ...prevState,
        sale: 'no'
      }))
    }
  }
  const [customerList, setCustomerOptions] = useState([])

  const throttling = useRef(false)

  useEffect(() => {
    if (throttling.current) {
      return
    }

    // If there is no search term, do not make API call
    throttling.current = true
    setTimeout(() => {
      throttling.current = false
      if (state.regnumber !== '' && state.regnumber.length > 4) {
        fetch(
          `/api/v1/customerfind/${state.regnumber ? state.regnumber : 'reg'}/${
            state.vinnumber ? state.vinnumber : 'vin'
          }/${state.phone ? state.phone : 'phone'}`
        )
          .then((res) => res.json())
          .then((it) => {
            setCustomerOptions(it.data)
          })
      } else if (state.regnumber === '') {
        setCustomerOptions([])
      }
    }, 200)
  }, [state.regnumber])

  const applyCustomer = () => {
    const newCustomer = customerList.find((it) => it.id === search)
    const findCar = options.mark.find((it) => newCustomer.mark === it.name)
    if (newCustomer) {
      setStateId((prevState) => ({
        ...prevState,
        mark: findCar ? findCar.id_car_mark : '',
        model: ''
      }))
      setCustomer((prevState) => ({
        ...prevState,
        regnumber: newCustomer.regnumber ? newCustomer.regnumber : '',
        mark: newCustomer.mark ? newCustomer.mark : '',
        model: newCustomer.model ? newCustomer.model : '',
        kuzov: newCustomer.kuzov ? newCustomer.kuzov : '',
        diametr: newCustomer.diametr ? newCustomer.diametr : '',
        idOfItem: newCustomer.id
      }))
      setState((prevState) => ({
        ...prevState,
        regnumber: newCustomer.regnumber ? newCustomer.regnumber : '',
        mark: newCustomer.mark ? newCustomer.mark : '',
        kuzov: newCustomer.kuzov ? newCustomer.kuzov : '',
        diametr: newCustomer.diametr ? newCustomer.diametr : '',
        model: newCustomer.model ? newCustomer.model : ''
      }))
      setActiveCustomer(newCustomer.id)
    }
    return null
  }
  const [actualService, setActualService] = useState([])
  const applyDiscount = (number, percent) => {
    const number_percent = (number / 100) * Number(percent)

    return Number(number) - Number(number_percent)
  }
  const applyDiscountPlus = (number, percent) => {
    const number_percent = (number / 100) * Number(percent)

    return Number(number) + Number(number_percent)
  }
  function roundTo5(num) {
    return Math.round(num / 5) * 5
  }

  useEffect(() => {
    const helpToGetDiametr = (item) => {
      if (item === 'R16С (скорая)') {
        return '16Camb'
      }
      if (item === '22.5 (спец шина)') {
        return '23'
      }
      return item.replace(/[^C\d]/g, '')
    }
    const actualDiametr = 'R'.concat(helpToGetDiametr(state.diametr))
    const percent = currentPlace ? currentPlace.shinostavka : ''
    const definition = currentPlace ? currentPlace.shinomeaning : ''
    const getPrice = (item) => {
      if (!percent) {
        return item[actualDiametr]
      }
      if (percent && definition === 'negative') {
        return roundTo5(applyDiscount(item[actualDiametr], percent))
      }
      if (percent && definition === 'positive') {
        return roundTo5(applyDiscountPlus(item[actualDiametr], percent))
      }
      return item[actualDiametr]
    }
    if (
      state.diametr &&
      (state.kuzov === 'sedan' ||
        state.kuzov === 'sedan-shtamp' ||
        state.kuzov === 'crossover' ||
        state.kuzov === 'runflat')
    ) {
      setActualService(
        shinomontazhprices
          .filter(
            (it) =>
              it.type === 'legk' &&
              (it.category === state.kuzov || it.category === 'other' || it.category === 'free')
          )
          .map((item) => ({
            name: item.name,
            id: item.id,
            type: item.type,
            category: item.category,
            number: item.number,
            actualprice: getPrice(item),
            free: item.free
          }))
      )
    }
    if (state.diametr && state.kuzov === 'gruz') {
      setActualService(
        shinomontazhprices
          .filter(
            (it) =>
              it.type === 'gruz' &&
              (it.category === 'common' || it.category === 'other' || it.category === 'free')
          )
          .map((item) => ({
            name: item.name,
            id: item.id,
            type: item.type,
            category: item.category,
            number: item.number,
            actualprice: getPrice(item),
            free: item.free
          }))
      )
    }
    if (state.diametr && state.kuzov === 'selhoz') {
      setActualService(
        shinomontazhprices
          .filter(
            (it) =>
              it.type === 'selhoz' &&
              (it.category === 'common' || it.category === 'other' || it.category === 'free')
          )
          .map((item) => ({
            name: item.name,
            id: item.id,
            type: item.type,
            category: item.category,
            number: item.number,
            actualprice: getPrice(item),
            free: item.free
          }))
      )
    }
    return () => {}
  }, [state.diametr, state.kuzov, shinomontazhprices])

  const sendData = () => {
    const checkCustomer =
      customerList !== []
        ? customerList.find((it) => it.id === search)
        : {
            mark: '',
            model: '',
            regnumber: '',
            kuzov: '',
            diametr: ''
          }

    if (!state.mark) notify('Укажите марку авто')
    if (!state.model) notify('Укажите модель авто')
    if (!state.place) notify('Укажите место работы')
    else if (employees && state.place && state.mark && state.model) {
      if (
        checkCustomer !== undefined &&
        state.mark === checkCustomer.mark &&
        state.model === checkCustomer.model &&
        state.regnumber === checkCustomer.regnumber &&
        state.kuzov === checkCustomer.kuzov &&
        state.diametr === checkCustomer.diametr
      ) {
        props.create({
          ...state,
          services: service,
          material: materials,
          tyre: tyres,
          employee: employees,
          box,
          customerId: activeCustomer || null,
          groupCount
        })
        if (props.checkLink) {
          history.push('/shinomontazhboss/list')
        } else {
          history.push('/shinomontazh/list')
        }
        notify('Запись добавлена')
      } else if (checkCustomer !== undefined && activeCustomer !== '') {
        props.openAndUpdate(
          activeCustomer,
          { ...customer, regnumber: state.regnumber, kuzov: state.kuzov, diametr: state.diametr },
          {
            ...state,
            services: service,
            material: materials,
            tyre: [...tyres],
            employee: employees,
            box,
            customerId: activeCustomer || null,
            groupCount
          }
        )
      } else {
        props.create({
          ...state,
          services: service,
          material: materials,
          tyre: [...tyres],
          employee: employees,
          box,
          customerId: activeCustomer || null,
          groupCount
        })
        props.createCust({
          ...customer,
          regnumber: state.regnumber,
          kuzov: state.kuzov,
          diametr: state.diametr
        })
        if (props.checkLink) {
          history.push('/shinomontazhboss/list')
        } else {
          history.push('/shinomontazh/list')
        }
        notify('Запись добавлена')
        notify('Создан новый клиент')
      }
    }
  }

  const [active, setActive] = useState('employee')

  const checkboxEmployeeChange = (e) => {
    const { name, placeholder, checked, attributes } = e.target
    if (checked) {
      setEmployees((prevState) => [
        ...prevState,
        {
          id: name,
          numberId: placeholder,
          name: attributes.itemName.value,
          surname: attributes.itemSurname.value,
          role: 'second',
          group
        }
      ])
    } else {
      setEmployees((prevState) => prevState.filter((it) => it.id !== name))
    }
  }

  const checkBoxEmpRoleChange = (e) => {
    const { id } = e.target
    if (employees.find((it) => it.id === id).role === 'second') {
      setEmployees(
        employees.map((object) => {
          if (object.id === id) {
            return {
              ...object,
              role: 'main'
            }
          }
          return object
        })
      )
    } else if (employees.find((it) => it.id === id).role === 'main') {
      setEmployees(
        employees.map((object) => {
          if (object.id === id) {
            return {
              ...object,
              role: 'student'
            }
          }
          return object
        })
      )
    } else {
      setEmployees(
        employees.map((object) => {
          if (object.id === id) {
            return {
              ...object,
              role: 'second'
            }
          }
          return object
        })
      )
    }
  }

  const nextStep = () => {
    if (active === 'employee') {
      if (employees.length < 1) {
        notify('Сначала выберите сотрудников')
      } else {
        setActive('car')
      }
    } else if (active === 'car') {
      if (!state.regnumber) {
        notify('Заполните гос. номер')
      } else if (!state.mark) {
        notify('Заполните поле Марка авто')
      } else if (!state.model) {
        notify('Заполните поле Модель авто')
      } else if (!state.kuzov) {
        notify('Выберите кузов')
      } else if (!state.diametr) {
        notify('Выберите диаметр')
      } else {
        setActive('service')
      }
    } else if (active === 'service') {
      if (service.length < 1) {
        notify('Выбериту услугу')
      } else {
        setActive('material')
      }
    } else if (active === 'material') {
      setActive('finish')
    } else if (active === 'finish') {
      sendData()
    }
  }

  const changeStep = (wanted) => {
    if (wanted === 'employee') {
      setActive('employee')
    }
    if (wanted === 'car') {
      if (employees.length < 1) {
        notify('Сначала выберите сотрудников')
      } else {
        setActive('car')
      }
    } else if (wanted === 'service') {
      if (employees.length < 1) {
        notify('Сначала выберите сотрудников')
      } else if (!state.regnumber) {
        notify('Заполните гос. номер')
      } else if (!state.mark) {
        notify('Заполните поле Марка авто')
      } else if (!state.model) {
        notify('Заполните поле Модель авто')
      } else if (!state.kuzov) {
        notify('Выберите кузов')
      } else if (!state.diametr) {
        notify('Выберите диаметр')
      } else {
        setActive('service')
      }
    } else if (wanted === 'material') {
      if (employees.length < 1) {
        notify('Сначала выберите сотрудников')
      } else if (!state.regnumber) {
        notify('Заполните гос. номер')
      } else if (!state.mark) {
        notify('Заполните поле Марка авто')
      } else if (!state.model) {
        notify('Заполните поле Модель авто')
      } else if (service.length < 1) {
        notify('Выбериту услугу')
      } else {
        setActive('material')
      }
    } else if (wanted === 'finish') {
      if (employees.length < 1) {
        notify('Сначала выберите сотрудников')
      } else if (!state.regnumber) {
        notify('Заполните гос. номер')
      } else if (!state.mark) {
        notify('Заполните поле Марка авто')
      } else if (!state.model) {
        notify('Заполните поле Модель авто')
      } else if (service.length < 1) {
        notify('Выбериту услугу')
      } else {
        setActive('finish')
      }
    }
  }
  const [termCash] = useState({
    terminal: 0,
    cash: 0
  })
  return (
    <div>
      <GroupSwitch
        groupCount={groupCount}
        group={group}
        onChangeGroup={onChangeGroup}
        setGroupCount={setGroupCount}
        employees={employees}
      />
      <div className="bg-white shadow rounded-lg px-8 py-6 mb-4 flex flex-col my-2">
        <div className="flex flex-row">
          <div className="w-1/5 p-2">
            <button
              type="button"
              className={cx('p-4 bg-gray-200 rounded w-full h-full overflow-hidden', {
                block: active !== 'employee',
                'border-b-8 border-main-400': active === 'employee'
              })}
              onClick={() => changeStep('employee')}
            >
              Исполнители
            </button>
          </div>
          <div className="w-1/5 p-2">
            <button
              type="button"
              className={cx('p-4 bg-gray-200 rounded w-full h-full overflow-hidden', {
                block: active !== 'car',
                'border-b-8 border-main-400': active === 'car'
              })}
              onClick={() => changeStep('car')}
            >
              Авто
            </button>
          </div>
          <div className="w-1/5 p-2">
            <button
              type="button"
              className={cx('p-4 bg-gray-200 rounded w-full h-full overflow-hidden', {
                block: active !== 'service',
                'border-b-8 border-main-400': active === 'service'
              })}
              onClick={() => changeStep('service')}
            >
              Услуги
            </button>
          </div>
          <div className="w-1/5 p-2">
            <button
              type="button"
              className={cx('p-4 bg-gray-200 rounded w-full h-full overflow-hidden', {
                block: active !== 'material',
                'border-b-8 border-main-400': active === 'material'
              })}
              onClick={() => changeStep('material')}
            >
              Материалы
            </button>
          </div>
          <div className="w-1/5 p-2">
            <button
              type="button"
              className={cx('p-4 bg-gray-200 rounded w-full h-full overflow-hidden', {
                block: active !== 'finish',
                'border-b-8 border-main-400': active === 'finish'
              })}
              onClick={() => changeStep('finish')}
            >
              Итог
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg px-8 pt-6 lg:pb-8 mb-4 flex flex-col my-2">
        <div
          className={cx('', {
            block: active === 'employee',
            hidden: active !== 'employee'
          })}
        >
          <Employee
            employeeList={employeeList}
            auth={auth}
            employees={employees}
            checkboxEmployeeChange={checkboxEmployeeChange}
            checkBoxEmpRoleChange={checkBoxEmpRoleChange}
            dateEnd=""
            box={box}
            setBox={setBox}
            currentPlace={currentPlace}
            group={group}
            onChangeGroup={onChangeGroup}
            groupCount={groupCount}
            setGroupCount={setGroupCount}
          />
        </div>
        <div
          className={cx('', {
            block: active === 'car',
            hidden: active !== 'car'
          })}
        >
          <Car
            regOpen={regOpen}
            onChangeRegNumber={onChangeRegNumber}
            onDeleteRegNumber={onDeleteRegNumber}
            onChangeRegnumberUppercaseRussian={onChangeRegnumberUppercaseRussian}
            switchKeyboard={switchKeyboard}
            acceptRegnumber={acceptRegnumber}
            openRegModal={openRegModal}
            state={state}
            keyboard={keyboard}
            onChangeMark={onChangeMark}
            onChangeModel={onChangeModel}
            options={options}
            onSearchChange={onSearchChange}
            search={search}
            customer={customer}
            customerOptions={customerList}
            activeCustomer={activeCustomer}
            setActiveCustomer={setActiveCustomer}
            applyCustomer={applyCustomer}
            sizeThreeList={sizeThreeList}
            onChange={onChange}
            setOptions={setOptions}
            stateId={stateId}
          />
        </div>
        <div
          className={cx('', {
            block: active === 'service',
            hidden: active !== 'service'
          })}
        >
          <Service
            actualService={actualService}
            auth={auth}
            service={service}
            state={state}
            checkboxServiceChange={checkboxServiceChange}
            servicePlusChange={servicePlusChange}
            serviceMinusChange={serviceMinusChange}
            servicePriceChange={servicePriceChange}
            dateEnd=""
            onServiceQuantityChange={onServiceQuantityChange}
            group={group}
            groupCount={groupCount}
          />
        </div>
        <div
          className={cx('', {
            block: active === 'material',
            hidden: active !== 'material'
          })}
        >
          <Material
            materialprices={materialprices}
            auth={auth}
            materials={materials}
            checkboxMaterialChange={checkboxMaterialChange}
            materialPlusChange={materialPlusChange}
            materialMinusChange={materialMinusChange}
            materialPriceChange={materialPriceChange}
            dateEnd=""
            materialEightChange={materialEightChange}
            checkboxMaterialPlusChange={checkboxMaterialPlusChange}
            materialOnChange={materialOnChange}
            group={group}
            groupCount={groupCount}
          />
        </div>
        <div
          className={cx('', {
            block: active === 'finish',
            hidden: active !== 'finish'
          })}
        >
          <Final
            materialprices={materialprices}
            auth={auth}
            materials={materials}
            shinomontazhprices={shinomontazhprices}
            state={state}
            service={service}
            onChange={onChange}
            onChangeTyres={onChangeTyres}
            tyres={tyres}
            checkboxTyresChange={checkboxTyresChange}
            dateEnd=""
            termCash={termCash}
            groupCount={groupCount}
          />
        </div>
      </div>
      <SubmitButtons submitText={active !== 'finish' ? 'Далее' : 'В работу'} sendData={nextStep} />
    </div>
  )
}

export default ShinomontazhsCreate
