import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import cx from 'classnames'
import 'react-toastify/dist/ReactToastify.css'
import Employee from './employees'
import Car from './car'
import Service from './service'
import Material from './material'
import Final from './final'
import sizeThreeList from '../../lists/shinomontazhdiametr'
import statusList from '../../../common/enums/shinomontazh-statuses'
import { updateStorageStatus } from '../../redux/reducers/storage'
import { dateNew } from '../storage/storage.preorder.edit'
import { useFindCustomer } from '../../hooks/findCustomer'
import { useKeyboard } from '../../hooks/keyboard'
import { useMaterials } from '../../hooks/handleMaterials'
import { useServices } from '../../hooks/handleServices'
import { ServiceSubmitButtons } from '../shared/buttons/OrderSubmitButtons'
import { GroupSwitch, useGroup } from '../../hooks/useGroup'
import EmployeeTab from '../common/employeeTab'

const ShinomontazhsEdit = (props) => {
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const history = useHistory()
  const checkLink = () => history.location.pathname.split('/').includes('shinomontazhboss')

  const isFromPreentry = history?.location?.search.includes('from=preentry')

  const employeeList = useSelector((s) => s.employees.list)
  // const customerList = useSelector((s) => s.customers.list)

  const auth = useSelector((s) => s.auth)
  const shinomontazhprices = useSelector((s) => s.shinomontazhprices.list)

  const materialprices = useSelector((s) => s.materials.list)
  const placeList = useSelector((s) => s.places.list)

  const currentPlace = placeList.find((it) => it.id === auth.place)

  const [regNumber, setRegNumber] = useState([])
  const { keyboard, regOpen, setRegOpen, switchKeyboard } = useKeyboard()
  const { group, onChangeGroup, groupCount, setGroupCount } = useGroup(props?.groupCount)

  const [state, setState] = useState({
    place: props.place,
    regnumber: props.regnumber,
    mark: props.mark,
    model: props.model,
    comment: props.comment,
    kuzov: props.kuzov,
    diametr: props.diametr,
    dateStart: props.dateStart || new Date(),
    dateFinish: props.dateFinish ? props.dateFinish : new Date(),
    discount: props.discount,
    payment: props.payment,
    talon: props.id_shinomontazhs
  })

  const [box, setBox] = useState(props.box ? props.box : '')

  // const [service, setService] = useState(props.services ? props.services : [])

  const {
    materials,
    checkboxMaterialChange,
    materialPlusChange,
    materialEightChange,
    checkboxMaterialPlusChange,
    materialMinusChange,
    materialPriceChange,
    materialOnChange
  } = useMaterials(props.material, group)

  const {
    service,
    checkboxServiceChange,
    servicePlusChange,
    serviceMinusChange,
    onServiceQuantityChange,
    servicePriceChange
  } = useServices(props.services, group)

  const [tyres, setTyres] = useState(props.tyre ? props.tyre[0] : { sale: 'no' })
  const [employees, setEmployees] = useState(props.employee ? props.employee : [])

  const onChangeRegNumber = (e) => {
    const { value } = e.target
    setRegNumber((prevState) => [...prevState.concat(value)])
  }
  const onDeleteRegNumber = () => {
    const removeItem = regNumber.filter((element, index) => index < regNumber.length - 1)
    setRegNumber(removeItem)
  }

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

  const onChangeRegnumberUppercaseRussian = (e) => {
    const { name, value } = e.target

    setState((prevState) => ({
      ...prevState,
      [name]: value
        ? value
            .toUpperCase()
            .replace(/\s/g, '')
            .replace(/[^а-яё0-9]/i, '')
        : ''
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

  const {
    customer,
    setCustomer,
    search,
    setSearch,
    customerList,
    activeCustomer,
    setActiveCustomer
  } = useFindCustomer(props, state)

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

  useEffect(() => {
    const findCar = options.mark ? options.mark.find((it) => props.mark === it.name) : null
    if (props.mark) {
      setStateId((prevState) => ({
        ...prevState,
        mark: findCar ? findCar.id_car_mark : '',
        model: ''
      }))
    }
  }, [props.mark, options.mark])

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
  const [termCash, setTermCash] = useState({
    terminal: props.combTerm ? props.combTerm : 0,
    cash: props.combCash ? props.combCash : 0
  })
  const onChangeTermCash = (e) => {
    const { name, value } = e.target
    setTermCash((prevState) => ({
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

  const applyCustomer = () => {
    const newCustomer = customerList.find((it) => it.id === search)

    const findCar = options?.mark.find((it) => newCustomer?.mark === it.name)
    if (newCustomer) {
      setStateId((prevState) => ({
        ...prevState,
        mark: findCar ? findCar.id_car_mark : '',
        model: '',
        gen: '',
        mod: ''
      }))
      setCustomer((prevState) => ({
        ...prevState,
        regnumber: newCustomer.regnumber ? newCustomer.regnumber : '',
        vinnumber: newCustomer.vinnumber ? newCustomer.vinnumber : '',
        mark: newCustomer.mark ? newCustomer.mark : '',
        model: newCustomer.model ? newCustomer.model : '',
        gen: newCustomer.gen ? newCustomer.gen : '',
        mod: newCustomer.mod ? newCustomer.mod : '',
        name: newCustomer.name ? newCustomer.name : '',
        phone: newCustomer.phone ? newCustomer.phone : '',
        kuzov: newCustomer.kuzov ? newCustomer.kuzov : '',
        diametr: newCustomer.diametr ? newCustomer.diametr : '',
        idOfItem: newCustomer.id
      }))
      setState((prevState) => ({
        ...prevState,
        regnumber: newCustomer.regnumber ? newCustomer.regnumber : '',
        vinnumber: newCustomer.vinnumber ? newCustomer.vinnumber : '',
        mark: newCustomer.mark ? newCustomer.mark : '',
        model: newCustomer.model ? newCustomer.model : '',
        gen: newCustomer.gen ? newCustomer.gen : '',
        mod: newCustomer.mod ? newCustomer.mod : '',
        name: newCustomer.name ? newCustomer.name : '',
        kuzov: newCustomer.kuzov ? newCustomer.kuzov : '',
        diametr: newCustomer.diametr ? newCustomer.diametr : '',
        phone: newCustomer.phone ? newCustomer.phone : ''
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

  const serviceItemIsInActualService = (itId) =>
    service && service?.length && service.find((serviceItem) => serviceItem?.serviceName === itId)

  useEffect(() => {
    const helpToGetDiametr = (item) => {
      if (item) {
        if (item === 'R16С (скорая)') {
          return '16Camb'
        }
        if (item === '22.5 (спец шина)') {
          return '23'
        }
        return item.replace(/[^C\d]/g, '')
      }
      return item
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
      (state.kuzov === 'sedan' || state.kuzov === 'crossover' || state.kuzov === 'runflat')
    ) {
      setActualService(
        shinomontazhprices
          .filter(
            (it) =>
              (it.type === 'legk' &&
                (it.category === state.kuzov ||
                  it.category === 'other' ||
                  it.category === 'free')) ||
              serviceItemIsInActualService(it.id)
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
              (it.type === 'gruz' &&
                (it.category === 'common' || it.category === 'other' || it.category === 'free')) ||
              serviceItemIsInActualService(it.id)
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
              (it.type === 'selhoz' &&
                (it.category === 'common' || it.category === 'other' || it.category === 'free')) ||
              serviceItemIsInActualService(it.id)
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

  const [active, setActive] = useState(isFromPreentry ? 'employee' : 'finish')

  const dispatch = useDispatch()

  const updateStorageStat = (idOFStorage, shinomontazhId) => {
    if (idOFStorage) {
      dispatch(
        updateStorageStatus(idOFStorage, {
          status: 'Произведен шиномонтаж',
          date: dateNew,
          shinomontazh_id: shinomontazhId
        })
      )
    }
  }

  const preChangeShinomontazh = () => {
    if (!state.regnumber) notify('Заполните поле гос.номер')
    if (!state.mark) notify('Укажите марку авто')
    if (!state.model) notify('Укажите модель авто')
    if (!state.place) notify('Укажите место работы')
    else {
      props.updateShinomontazh(props.id, {
        place: state.place,
        regnumber: state.regnumber,
        mark: state.mark,
        model: state.model,
        comment: state.comment,
        kuzov: state.kuzov,
        diametr: state.diametr,
        discount: state.discount,
        payment: state.payment,
        services: service,
        material: materials,
        tyre: [tyres],
        employee: employees,
        dateStart: props?.dateStart ? props.dateStart : new Date(),
        status: props.status === 'Новая запись' ? 'В работе' : props.status,
        box,
        customerId: activeCustomer || props.customerId || null,
        groupCount
      })
      if (checkLink()) {
        history.push(`/shinomontazhboss/list/${props.num ? props.num : ''}`)
      } else {
        history.push(`/shinomontazh/list/${props.num ? props.num : ''}`)
      }
      notify('Запись изменена')
    }
  }

  const changeShinomontazh = () => {
    const dateFinishObj =
      props?.status === 'Новая запись'
        ? {}
        : { dateFinish: props.dateFinish ? props.dateFinish : new Date() }
    if (!state.regnumber) notify('Заполните поле гос.номер')
    if (!state.mark) notify('Укажите марку авто')
    if (!state.model) notify('Укажите модель авто')
    if (!state.place) notify('Укажите место работы')
    if (groupCount > 1 && !!employees?.find((e) => e?.group === 2)?.length) {
      notify('Укажите сотрудников для группы 2')
      return
    }
    if (!state.payment && !props.dateFinish) {
      props.updateShinomontazh(props.id, {
        place: state.place,
        regnumber: state.regnumber,
        mark: state.mark,
        model: state.model,
        comment: state.comment,
        kuzov: state.kuzov,
        diametr: state.diametr,
        discount: state.discount,
        payment: state.payment,
        services: service,
        material: materials,
        tyre: [tyres],
        employee: employees,
        dateStart: props.dateStart ? props.dateStart : new Date(),
        ...dateFinishObj,
        status: props?.status === 'Новая запись' ? statusList[0] : statusList[1],
        box,
        customerId: activeCustomer || props.customerId || null,
        groupCount
      })
      updateStorageStat(props?.storage, props?.id_shinomontazhs)
      if (checkLink()) {
        history.push(`/shinomontazhboss/list/${props.num ? props.num : ''}`)
      } else {
        history.push(`/shinomontazh/list/${props.num ? props.num : ''}`)
      }
      notify('Запись изменена')
    } else if (state.payment === 'yes') {
      props.updateShinomontazh(props.id, {
        discount: state.discount,
        payment: state.payment,
        comment: state.comment,
        status: statusList[2],
        box,
        customerId: activeCustomer || props.customerId || null,
        groupCount
      })
      // updateStorageStat(state?.storage, state?.id_shinomontazhs)
      if (checkLink()) {
        history.push(`/shinomontazhboss/list/${props.num ? props.num : ''}`)
      } else {
        history.push(`/shinomontazh/list/${props.num ? props.num : ''}`)
      }
      notify('Работа оплачена')
    } else if (state.payment === 'card') {
      props.updateShinomontazh(props.id, {
        discount: state.discount,
        payment: state.payment,
        comment: state.comment,
        status: statusList[3],
        box,
        customerId: activeCustomer || props.customerId || null,
        groupCount
      })
      // updateStorageStat(state?.storage, state?.id_shinomontazhs)
      if (checkLink()) {
        history.push(`/shinomontazhboss/list/${props.num ? props.num : ''}`)
      } else {
        history.push(`/shinomontazh/list/${props.num ? props.num : ''}`)
      }
      notify('Работа оплачена (безнал)')
    } else if (state.payment === 'terminal') {
      props.updateShinomontazh(props.id, {
        discount: state.discount,
        payment: state.payment,
        comment: state.comment,
        status: statusList[4],
        box,
        customerId: activeCustomer || props.customerId || null,
        groupCount
      })
      //  updateStorageStat(state?.storage, state?.id_shinomontazhs)
      if (checkLink()) {
        history.push(`/shinomontazhboss/list/${props.num ? props.num : ''}`)
      } else {
        history.push(`/shinomontazh/list/${props.num ? props.num : ''}`)
      }
      notify('Работа оплачена (терминал)')
    } else if (state.payment === 'termandcash') {
      props.updateShinomontazh(props.id, {
        discount: state.discount,
        payment: state.payment,
        comment: state.comment,
        status: statusList[6],
        combTerm: termCash.terminal,
        combCash: termCash.cash,
        box,
        customerId: activeCustomer || props.customerId || null,
        groupCount
      })
      //  updateStorageStat(state?.storage, state?.id_shinomontazhs)
      if (checkLink()) {
        history.push(`/shinomontazhboss/list/${props.num ? props.num : ''}`)
      } else {
        history.push(`/shinomontazh/list/${props.num ? props.num : ''}`)
      }
      notify('Работа оплачена (терминал + наличные)')
    } else if (state.payment === 'cancel') {
      props.updateShinomontazh(props.id, {
        discount: state.discount,
        payment: state.payment,
        comment: state.comment,
        status: statusList[5],
        box,
        customerId: activeCustomer || props.customerId || null,
        groupCount
      })
      if (checkLink()) {
        history.push(`/shinomontazhboss/list/${props.num ? props.num : ''}`)
      } else {
        history.push(`/shinomontazh/list/${props.num ? props.num : ''}`)
      }
      notify('Работа отменена')
    } else {
      props.updateShinomontazh(props.id, {
        // ...state,
        // services: service,
        // material: materials,
        // tyre: [tyres],
        // employee: employees,
        discount: state.discount,
        payment: state.payment,
        comment: state.comment,
        box,
        customerId: activeCustomer || props.customerId || null
      })
      if (checkLink()) {
        history.push(`/shinomontazhboss/list/${props.num ? props.num : ''}`)
      } else {
        history.push(`/shinomontazh/list/${props.num ? props.num : ''}`)
      }
      notify('Запись изменена')
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
      changeShinomontazh()
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

  const printOne = (totalSumWithoutMaterials, totalMaterial, totalSumm, totalWithDiscount) => {
    props.shinomontazhPrintOne({
      ...state,
      services: service,
      material: materials,
      tyre: [tyres],
      employee: employees,
      totalSumWithoutMaterials,
      totalMaterial,
      totalSumm,
      totalWithDiscount,
      id_shinomontazhs: props.id_shinomontazhs,
      groupCount
    })
  }

  const printTwo = (totalSumWithoutMaterials, totalMaterial, totalSumm, totalWithDiscount) => {
    props.shinomontazhPrintTwo({
      ...state,
      services: service,
      material: materials,
      tyre: [tyres],
      employee: employees,
      totalSumWithoutMaterials,
      totalMaterial,
      totalSumm,
      totalWithDiscount,
      id_shinomontazhs: props.id_shinomontazhs,
      groupCount
    })
  }

  return (
    <div>
      <GroupSwitch
        groupCount={groupCount}
        group={group}
        onChangeGroup={onChangeGroup}
        setGroupCount={setGroupCount}
        employees={employees}
        dateEnd={props.dateFinish}
      />
      <div className="bg-white shadow rounded-lg px-8 py-6 mb-4 flex flex-col my-2">
        <div className="flex flex-row">
          <EmployeeTab changeStep={changeStep} employees={employees} active={active} />
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
      <div className="bg-white shadow rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
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
            dateEnd={props.dateFinish}
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
            dateEnd={props.dateFinish}
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
            dateEnd={props.dateFinish}
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
            onChangeTermCash={onChangeTermCash}
            termCash={termCash}
            checkboxTyresChange={checkboxTyresChange}
            dateEnd={props.dateFinish}
            printOne={printOne}
            printTwo={printTwo}
            id_shinomontazhs={props.id_shinomontazhs}
            setTermCash={setTermCash}
            group={group}
            groupCount={groupCount}
          />
        </div>
      </div>

      <ServiceSubmitButtons
        active={active}
        props={props}
        nextStep={nextStep}
        change={changeShinomontazh}
        preChange={preChangeShinomontazh}
      />
    </div>
  )
}

export default ShinomontazhsEdit
