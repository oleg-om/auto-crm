import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import cx from 'classnames'
import 'react-toastify/dist/ReactToastify.css'
import Employee from './employees'
import Car from './car'
import Service from '../shinomontazhs/service'
import Material from '../shinomontazhs/material'
import Final from '../shinomontazhs/final'
import { useKeyboard } from '../../hooks/keyboard'
import { useMaterials } from '../../hooks/handleMaterials'
import { useServices } from '../../hooks/handleServices'
import SubmitButtons from '../shared/buttons/OrderSubmitButtons'
import { GroupSwitch, useGroup } from '../../hooks/useGroup'
import { checkSalariesIsNotValid } from '../shared/services/SalariesDivider'
import { stripSalaryPercentsForGroup } from '../../utils/shinomontazhExecutorPreferences'
import { getOrganizations } from '../../redux/reducers/organizations'
import { getDiskpaintingprices } from '../../redux/reducers/diskpainting.prices'

const DiskpaintingsCreate = (props) => {
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const history = useHistory()
  const dispatch = useDispatch()

  const employeeList = useSelector((s) => s.employees.list)
  const auth = useSelector((s) => s.auth)
  const diskpaintingprices = useSelector((s) => s.diskpaintingprices.list)
  const materialprices = useSelector((s) => s.materials.list.filter((it) => it.type === 'diskpainting'))
  const placeList = useSelector((s) => s.places.list)
  const organizations = useSelector((s) => s.organizations.list)

  useEffect(() => {
    dispatch(getOrganizations())
    dispatch(getDiskpaintingprices())
  }, [dispatch])

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
    class: 'legk',
    diametr: '',
    dateStart: new Date(),
    beznalPaid: null,
    organizationId: null
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
    setState((prevState) => ({
      ...prevState,
      model: value
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
    if (name === 'beznalPaidSelect') {
      setState((prevState) => {
        if (prevState.beznalPaid) return prevState
        if (value === 'yes') {
          return { ...prevState, beznalPaid: new Date().toISOString() }
        }
        return { ...prevState, beznalPaid: null }
      })
      return
    }
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }
  const onChangeTyres = () => {}
  const checkboxTyresChange = () => {}
  const [customerList, setCustomerOptions] = useState([])

  const throttling = useRef(false)

  useEffect(() => {
    if (throttling.current) {
      return
    }
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
        diametr: newCustomer.diametr ? newCustomer.diametr : '',
        idOfItem: newCustomer.id
      }))
      setState((prevState) => ({
        ...prevState,
        regnumber: newCustomer.regnumber ? newCustomer.regnumber : '',
        mark: newCustomer.mark ? newCustomer.mark : '',
        class: newCustomer.diskpaintingClass ? newCustomer.diskpaintingClass : '',
        diametr: newCustomer.diametr ? newCustomer.diametr : '',
        model: newCustomer.model ? newCustomer.model : ''
      }))
      setActiveCustomer(newCustomer.id)
    }
    return null
  }

  const [actualService, setActualService] = useState([])

  useEffect(() => {
    const percent = currentPlace ? currentPlace.shinostavka : ''
    const definition = currentPlace ? currentPlace.shinomeaning : ''
    const getPrice = (item) => {
      const priceKey = `R${state.diametr}`
      const rawPrice = item[priceKey]
      if (!percent) return rawPrice
      const applyDiscount = (number, p) => {
        const numberPercent = (number / 100) * Number(p)
        return Math.round((Number(number) - Number(numberPercent)) / 5) * 5
      }
      const applyDiscountPlus = (number, p) => {
        const numberPercent = (number / 100) * Number(p)
        return Math.round((Number(number) + Number(numberPercent)) / 5) * 5
      }
      if (percent && definition === 'negative') return applyDiscount(rawPrice, percent)
      if (percent && definition === 'positive') return applyDiscountPlus(rawPrice, percent)
      return rawPrice
    }

    if (state.diametr) {
      setActualService(
        diskpaintingprices
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
    } else {
      setActualService([])
    }
  }, [state.diametr, diskpaintingprices, currentPlace])

  const sendData = () => {
    const checkCustomer =
      customerList !== []
        ? customerList.find((it) => it.id === search)
        : { mark: '', model: '', regnumber: '', diametr: '', diskpaintingClass: '' }

    if (!state.mark) notify('Укажите марку авто')
    if (!state.model) notify('Укажите модель авто')
    if (!state.place) notify('Укажите место работы')
    else if (employees && state.place && state.mark && state.model) {
      if (
        checkCustomer !== undefined &&
        state.mark === checkCustomer.mark &&
        state.model === checkCustomer.model &&
        state.regnumber === checkCustomer.regnumber
      ) {
        props.create({
          ...state,
          services: service,
          material: materials,
          employee: employees,
          box,
          customerId: activeCustomer || null,
          groupCount
        })
        if (props.checkLink) {
          history.push('/diskpaintingboss/list')
        } else {
          history.push('/diskpainting/list')
        }
        notify('Запись добавлена')
      } else if (checkCustomer !== undefined && activeCustomer !== '') {
        props.openAndUpdate(
          activeCustomer,
          { ...customer, regnumber: state.regnumber, diametr: state.diametr, diskpaintingClass: state.class },
          {
            ...state,
            services: service,
            material: materials,
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
          employee: employees,
          box,
          customerId: activeCustomer || null,
          groupCount
        })
        props.createCust({
          ...customer,
          regnumber: state.regnumber,
          diametr: state.diametr,
          diskpaintingClass: state.class
        })
        if (props.checkLink) {
          history.push('/diskpaintingboss/list')
        } else {
          history.push('/diskpainting/list')
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
      setEmployees((prevState) => {
        const next = [
          ...prevState,
          {
            id: name,
            numberId: placeholder,
            name: attributes.itemName.value,
            surname: attributes.itemSurname.value,
            role: 'second',
            group
          }
        ]
        return stripSalaryPercentsForGroup(next, group)
      })
    } else {
      setEmployees((prevState) => {
        const next = prevState.filter((it) => it.id !== name)
        return stripSalaryPercentsForGroup(next, group)
      })
    }
  }

  const checkBoxEmpRoleChange = (e) => {
    const { id } = e.target
    if (employees.find((it) => it.id === id).role === 'second') {
      setEmployees(
        employees.map((object) => {
          if (object.id === id) return { ...object, role: 'main' }
          return object
        })
      )
    } else if (employees.find((it) => it.id === id).role === 'main') {
      setEmployees(
        employees.map((object) => {
          if (object.id === id) return { ...object, role: 'student' }
          return object
        })
      )
    } else {
      setEmployees(
        employees.map((object) => {
          if (object.id === id) return { ...object, role: 'second' }
          return object
        })
      )
    }
  }

  const plateRegex =
    /^(?:[АВЕКМНОРСТУХ]\d{3}[АВЕКМНОРСТУХ]{2}\s?\d{2,3}|[АВЕКМНОРСТУХ]\d{4}\s?\d{2,3}|\d{4}[АВЕКМНОРСТУХ]{2}|\d{4}[АВЕКМНОРСТУХ]{2}\s?\d{2,3})$/i

  const nextStep = () => {
    if (active === 'employee') {
      if (employees.length < 1) {
        notify('Сначала выберите сотрудников')
      } else if (checkSalariesIsNotValid(employees)) {
        notify('Перераспределите проценты между сотрудниками')
      } else {
        setActive('car')
      }
    } else if (active === 'car') {
      if (!state.regnumber) {
        notify('Заполните гос. номер')
      } else if (!plateRegex.test(state.regnumber)) {
        notify('Гос номер некорректный')
      } else if (!state.mark) {
        notify('Заполните поле Марка авто')
      } else if (!state.model) {
        notify('Заполните поле Модель авто')
      } else if (!state.diametr) {
        notify('Выберите диаметр')
      } else {
        setActive('service')
      }
    } else if (active === 'service') {
      if (service.length < 1) {
        notify('Выберите услугу')
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
      } else if (checkSalariesIsNotValid(employees)) {
        notify('Перераспределите проценты между сотрудниками')
      } else {
        setActive('car')
      }
    } else if (wanted === 'service') {
      if (employees.length < 1) {
        notify('Сначала выберите сотрудников')
      } else if (!state.regnumber) {
        notify('Заполните гос. номер')
      } else if (!plateRegex.test(state.regnumber)) {
        notify('Гос номер некорректный')
      } else if (!state.mark) {
        notify('Заполните поле Марка авто')
      } else if (!state.model) {
        notify('Заполните поле Модель авто')
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
        notify('Выберите услугу')
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
        notify('Выберите услугу')
      } else {
        setActive('finish')
      }
    }
  }

  const [termCash] = useState({ terminal: 0, cash: 0 })

  return (
    <div>
      <GroupSwitch
        groupCount={groupCount}
        group={group}
        onChangeGroup={onChangeGroup}
        setGroupCount={setGroupCount}
        employees={employees}
        dateEnd={null}
      />
      <div className="bg-white shadow rounded-lg px-8 py-6 mb-4 flex flex-col my-2">
        <div className="flex flex-row">
          {['employee', 'car', 'service', 'material', 'finish'].map((step) => {
            const labels = {
              employee: 'Исполнители',
              car: 'Авто',
              service: 'Услуги',
              material: 'Материалы',
              finish: 'Итог'
            }
            return (
              <div key={step} className="w-1/5 p-2">
                <button
                  type="button"
                  className={cx('p-4 bg-gray-200 rounded w-full h-full overflow-hidden', {
                    block: active !== step,
                    'border-b-8 border-main-400': active === step
                  })}
                  onClick={() => changeStep(step)}
                >
                  {labels[step]}
                </button>
              </div>
            )
          })}
        </div>
      </div>
      <div className="bg-white shadow rounded-lg px-8 pt-6 lg:pb-8 mb-4 flex flex-col my-2">
        <div className={cx('', { block: active === 'employee', hidden: active !== 'employee' })}>
          <Employee
            employeeList={employeeList}
            auth={auth}
            employees={employees}
            setEmployees={setEmployees}
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
            hideBox
          />
        </div>
        <div className={cx('', { block: active === 'car', hidden: active !== 'car' })}>
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
            onChange={onChange}
            setOptions={setOptions}
            stateId={stateId}
            hideClass
          />
        </div>
        <div className={cx('', { block: active === 'service', hidden: active !== 'service' })}>
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
        <div className={cx('', { block: active === 'material', hidden: active !== 'material' })}>
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
        <div className={cx('', { block: active === 'finish', hidden: active !== 'finish' })}>
          <Final
            materialprices={materialprices}
            auth={auth}
            materials={materials}
            state={state}
            service={service}
            onChange={onChange}
            onChangeTyres={onChangeTyres}
            tyres={{}}
            checkboxTyresChange={checkboxTyresChange}
            dateEnd=""
            termCash={termCash}
            groupCount={groupCount}
            showBeznalPaid
            organizations={organizations}
            customerId={activeCustomer || props.customerId || null}
          />
        </div>
      </div>
      <SubmitButtons submitText={active !== 'finish' ? 'Далее' : 'В работу'} sendData={nextStep} />
    </div>
  )
}

export default DiskpaintingsCreate
