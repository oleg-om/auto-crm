import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import cx from 'classnames'
import 'react-toastify/dist/ReactToastify.css'
import Employee from './employees'
import { stripSalaryPercentsForGroup } from '../../utils/shinomontazhExecutorPreferences'
import Car from './car'
import Service from '../shinomontazhs/service'
import Material from '../shinomontazhs/material'
import Final from '../shinomontazhs/final'
import statusList from '../../../common/enums/shinomontazh-statuses'
import { useFindCustomer } from '../../hooks/findCustomer'
import { useKeyboard } from '../../hooks/keyboard'
import { useMaterials } from '../../hooks/handleMaterials'
import { useServices } from '../../hooks/handleServices'
import { ServiceSubmitButtons } from '../shared/buttons/OrderSubmitButtons'
import { GroupSwitch, useGroup } from '../../hooks/useGroup'
import { getOrganizations } from '../../redux/reducers/organizations'
import { getDiskpaintingprices } from '../../redux/reducers/diskpainting.prices'

const DiskpaintingsEdit = (props) => {
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()
  const checkLink = () => history.location.pathname.split('/').includes('diskpaintingboss')

  const navigateBack = () => {
    const pathname = checkLink()
      ? `/diskpaintingboss/list/${props.num ? props.num : ''}`
      : `/diskpainting/list/${props.num ? props.num : ''}`
    history.push({ pathname, search: location.search })
  }

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
  const { group, onChangeGroup, groupCount, setGroupCount } = useGroup(props?.groupCount)

  const [regNumber, setRegNumber] = useState([])
  const { keyboard, regOpen, setRegOpen, switchKeyboard } = useKeyboard()

  const [state, setState] = useState({
    place: props.place,
    regnumber: props.regnumber,
    mark: props.mark,
    model: props.model,
    comment: props.comment,
    kuzov: props.kuzov || '',
    class: props.class || 'legk',
    diametr: props.diametr,
    dateStart: props.dateStart || new Date(),
    dateFinish: props.dateFinish ? props.dateFinish : new Date(),
    discount: props.discount,
    payment: props.payment,
    beznalPaid: props.beznalPaid
      ? typeof props.beznalPaid === 'string'
        ? props.beznalPaid
        : new Date(props.beznalPaid).toISOString()
      : null,
    organizationId: props.organizationId || null
  })

  const [box, setBox] = useState(props.box ? props.box : '')

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
      setEmployees(employees.map((obj) => (obj.id === id ? { ...obj, role: 'main' } : obj)))
    } else if (employees.find((it) => it.id === id).role === 'main') {
      setEmployees(employees.map((obj) => (obj.id === id ? { ...obj, role: 'student' } : obj)))
    } else {
      setEmployees(employees.map((obj) => (obj.id === id ? { ...obj, role: 'second' } : obj)))
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

  const acceptRegnumber = () => setRegOpen(false)
  const openRegModal = () => {
    if (keyboard === false) setRegOpen(true)
  }

  const [options, setOptions] = useState({ mark: [], model: [] })
  const [stateId, setStateId] = useState({ mark: '', model: '' })

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
    setState((prevState) => ({ ...prevState, mark: value, model: '' }))
    setStateId((prevState) => ({ ...prevState, mark: findCar ? findCar.id_car_mark : '', model: '' }))
    setCustomer((prevState) => ({ ...prevState, mark: value }))
    setOptions((prevState) => ({ mark: prevState.mark, model: [] }))
  }

  const onChangeModel = (e) => {
    const { value } = e.target
    setState((prevState) => ({ ...prevState, model: value }))
    setCustomer((prevState) => ({ ...prevState, model: value }))
  }

  useEffect(() => {
    const findCar = options.mark ? options.mark.find((it) => props.mark === it.name) : null
    if (props.mark) {
      setStateId((prevState) => ({ ...prevState, mark: findCar ? findCar.id_car_mark : '', model: '' }))
    }
  }, [props.mark, options.mark])

  const onSearchChange = (event) => setSearch(event.target.value)

  const onChange = (e) => {
    const { name, value } = e.target
    if (name === 'beznalPaidSelect') {
      setState((prevState) => {
        if (prevState.beznalPaid) return prevState
        if (value === 'yes') return { ...prevState, beznalPaid: new Date().toISOString() }
        return { ...prevState, beznalPaid: null }
      })
      return
    }
    setState((prevState) => ({ ...prevState, [name]: value }))
  }

  const [termCash, setTermCash] = useState({
    terminal: props.combTerm ? props.combTerm : 0,
    cash: props.combCash ? props.combCash : 0
  })
  const onChangeTermCash = (e) => {
    const { name, value } = e.target
    setTermCash((prevState) => ({ ...prevState, [name]: value }))
  }

  const applyCustomer = () => {
    const newCustomer = customerList.find((it) => it.id === search)
    const findCar = options?.mark.find((it) => newCustomer?.mark === it.name)
    if (newCustomer) {
      setStateId((prevState) => ({ ...prevState, mark: findCar ? findCar.id_car_mark : '', model: '' }))
      setCustomer((prevState) => ({
        ...prevState,
        regnumber: newCustomer.regnumber || '',
        mark: newCustomer.mark || '',
        model: newCustomer.model || '',
        kuzov: newCustomer.kuzov || '',
        diametr: newCustomer.diametr || '',
        idOfItem: newCustomer.id
      }))
      setState((prevState) => ({
        ...prevState,
        regnumber: newCustomer.regnumber || '',
        mark: newCustomer.mark || '',
        class: newCustomer.diskpaintingClass || '',
        diametr: newCustomer.diametr || '',
        model: newCustomer.model || ''
      }))
      setActiveCustomer(newCustomer.id)
    }
    return null
  }

  const [actualService, setActualService] = useState([])

  function roundTo5(num) {
    return Math.round(num / 5) * 5
  }

  useEffect(() => {
    const percent = currentPlace ? currentPlace.shinostavka : ''
    const definition = currentPlace ? currentPlace.shinomeaning : ''
    const getPrice = (item) => {
      const priceKey = `R${state.diametr}`
      const rawPrice = item[priceKey]
      if (!percent) return rawPrice
      if (percent && definition === 'negative') {
        const pct = (rawPrice / 100) * Number(percent)
        return roundTo5(Number(rawPrice) - Number(pct))
      }
      if (percent && definition === 'positive') {
        const pct = (rawPrice / 100) * Number(percent)
        return roundTo5(Number(rawPrice) + Number(pct))
      }
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
    }
  }, [state.diametr, diskpaintingprices, currentPlace])

  const [active, setActive] = useState('finish')

  const changeDiskpainting = () => {
    const dateFinishObj =
      props?.status === 'Новая запись'
        ? {}
        : { dateFinish: props.dateFinish ? props.dateFinish : new Date() }
    if (!state.regnumber) { notify('Заполните поле гос.номер'); return }
    if (!state.mark) { notify('Укажите марку авто'); return }
    if (!state.model) { notify('Укажите модель авто'); return }
    if (!state.place) { notify('Укажите место работы'); return }
    if (!state.payment && !props.dateFinish) {
      props.updateDiskpainting(props.id, {
        place: state.place,
        regnumber: state.regnumber,
        mark: state.mark,
        model: state.model,
        comment: state.comment,
        kuzov: state.kuzov,
        diametr: state.diametr,
        discount: state.discount,
        payment: state.payment,
        beznalPaid: state.beznalPaid || null,
        organizationId: state.organizationId || null,
        services: service,
        material: materials,
        employee: employees,
        dateStart: props.dateStart ? props.dateStart : new Date(),
        ...dateFinishObj,
        status: props?.status === 'Новая запись' ? statusList[0] : statusList[1],
        box,
        customerId: activeCustomer || props.customerId || null,
        groupCount
      })
      navigateBack()
      notify('Запись изменена')
    } else {
      props.updateDiskpainting(props.id, {
        place: state.place,
        regnumber: state.regnumber,
        mark: state.mark,
        model: state.model,
        comment: state.comment,
        kuzov: state.kuzov,
        diametr: state.diametr,
        discount: state.discount,
        payment: state.payment,
        beznalPaid: state.beznalPaid || null,
        organizationId: state.organizationId || null,
        services: service,
        material: materials,
        employee: employees,
        dateStart: props.dateStart ? props.dateStart : new Date(),
        dateFinish: state.dateFinish,
        status: statusList[2],
        box,
        customerId: activeCustomer || props.customerId || null,
        groupCount
      })
      navigateBack()
      notify('Запись завершена')
    }
  }

  const changeStep = (wanted) => {
    setActive(wanted)
  }

  const onChangeTyres = () => {}
  const checkboxTyresChange = () => {}

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
            dateEnd={props.dateFinish}
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
            dateEnd={props.dateFinish}
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
            dateEnd={props.dateFinish}
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
            onChangeTermCash={onChangeTermCash}
            onChangeTyres={onChangeTyres}
            tyres={{}}
            checkboxTyresChange={checkboxTyresChange}
            dateEnd={props.dateFinish}
            termCash={termCash}
            groupCount={groupCount}
            showBeznalPaid
            organizations={organizations}
            customerId={activeCustomer || props.customerId || null}
          />
        </div>
      </div>
      <ServiceSubmitButtons
        active={active}
        props={props}
        change={changeDiskpainting}
        preChange={changeDiskpainting}
        nextStep={() => {
          const steps = ['employee', 'car', 'service', 'material', 'finish']
          const idx = steps.indexOf(active)
          if (idx < steps.length - 1) setActive(steps[idx + 1])
          else changeDiskpainting()
        }}
      />
    </div>
  )
}

export default DiskpaintingsEdit
