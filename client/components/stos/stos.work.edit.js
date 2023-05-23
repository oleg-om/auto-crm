import React, { useState, useEffect } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
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
import statusList from '../../../common/enums/shinomontazh-statuses'
import { useFindCustomer } from '../../hooks/findCustomer'
import { useKeyboard } from '../../hooks/keyboard'
import { useMaterials } from '../../hooks/handleMaterials'
import { useServices } from '../../hooks/handleServices'

const StosEdit = (props) => {
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const type = props?.type || 'sto'

  const history = useHistory()
  const location = useLocation()

  const SERVICES_WITHOUT_TYPE =
    location.pathname.includes('/window') || location.pathname.includes('/cond')

  const checkLink = () => history.location.pathname.includes('boss')

  const employeeList = useSelector((s) => s.employees.list)
  // const customerList = useSelector((s) => s.customers.list)
  const auth = useSelector((s) => s.auth)
  const stoprices = useSelector((s) => s[`${type}prices`].list)
  const materialprices = useSelector((s) => s.materials.list).filter((it) => it.type === type)

  const placeList = useSelector((s) => s.places.list)
  const currentPlace = placeList.find((it) => it.id === auth.place)

  const [regNumber, setRegNumber] = useState([])
  // const [keyboard, setKeyboard] = useState(true)
  const { keyboard, regOpen, setRegOpen, switchKeyboard } = useKeyboard()
  // const [regOpen, setRegOpen] = useState(false)

  const [state, setState] = useState({
    place: props.place,
    regnumber: props.regnumber,
    mark: props.mark,
    model: props.model,
    comment: props.comment,
    kuzov: props.kuzov,
    diametr: props.diametr,
    dateStart: props.dateStart,
    dateFinish: props.dateFinish ? props.dateFinish : new Date(),
    discount: props.discount,
    payment: props.payment,
    talon: props[`id_${type || 'sto'}s`],
    class: props.class,
    category: props.category || (SERVICES_WITHOUT_TYPE ? 'price' : '')
  })

  const [box, setBox] = useState(props.box ? props.box : '')

  // const [service, setService] = useState(props.services ? props.services : [])
  // const [materials, setMaterials] = useState(props.material ? props.material : [])
  const [tyres, setTyres] = useState(props.tyre ? props.tyre[0] : { sale: 'no' })
  const [employees, setEmployees] = useState(props.employee ? props.employee : [])

  const {
    materials,
    checkboxMaterialChange,
    materialPlusChange,
    materialEightChange,
    checkboxMaterialPlusChange,
    materialMinusChange,
    materialPriceChange,
    materialOnChange
  } = useMaterials(props.material)

  const {
    service,
    checkboxServiceChange,
    servicePlusChange,
    serviceMinusChange,
    onServiceQuantityChange,
    servicePriceChange
  } = useServices(props.services)

  const onChangeRegNumber = (e) => {
    const { value } = e.target
    setRegNumber((prevState) => [...prevState.concat(value)])
  }
  const onDeleteRegNumber = () => {
    const removeItem = regNumber.filter((element, index) => index < regNumber.length - 1)
    setRegNumber(removeItem)
  }
  // useEffect(() => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     regnumber: regNumber.join('').toString()
  //   }))
  // }, [regNumber])

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
          role: 'second'
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

  // const [customer, setCustomer] = useState({
  //   regnumber: '',
  //   vinnumber: '',
  //   mark: '',
  //   model: '',
  //   gen: '',
  //   mod: '',
  //   name: '',
  //   phone: '',
  //   idOfItem: ''
  // })

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

  // const [search, setSearch] = useState()
  // const [activeCustomer, setActiveCustomer] = useState('')
  // useEffect(() => {
  //   if (state.regnumber !== '') {
  //     setCustomerOptions(
  //       customerList.filter(
  //         (it) => it.regnumber === state.regnumber && it.regnumber !== '' && state.regnumber !== ''
  //       )
  //     )
  //   } else if (state.regnumber === '') {
  //     setCustomerOptions([])
  //   }
  // }, [state.regnumber, customerList])

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
    const findCar = options.mark.find((it) => newCustomer.mark === it.name)

    const getClassOptions = () => {
      if (SERVICES_WITHOUT_TYPE) {
        return {}
      }
      return {
        class: newCustomer.class ? newCustomer.class : '',
        category: newCustomer.category ? newCustomer.category : ''
      }
    }

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
        mark: newCustomer.mark ? newCustomer.mark : '',
        model: newCustomer.model ? newCustomer.model : '',
        name: newCustomer.name ? newCustomer.name : '',
        phone: newCustomer.phone ? newCustomer.phone : '',
        ...getClassOptions(),
        idOfItem: newCustomer.id
      }))
      setState((prevState) => ({
        ...prevState,
        regnumber: newCustomer.regnumber ? newCustomer.regnumber : '',
        mark: newCustomer.mark ? newCustomer.mark : '',
        mod: newCustomer.mod ? newCustomer.mod : '',
        name: newCustomer.name ? newCustomer.name : '',
        ...getClassOptions(),
        phone: newCustomer.phone ? newCustomer.phone : ''
      }))
      setActiveCustomer(newCustomer.id)
    }
    return null
  }
  const [actualService, setActualService] = useState([])

  useEffect(() => {
    const actualDiametr = state.category
    const getPrice = (item) => {
      return item[actualDiametr]
    }
    if ((state.class && state.category) || SERVICES_WITHOUT_TYPE) {
      setActualService(
        stoprices
          .filter((it) => (it.type && SERVICES_WITHOUT_TYPE ? it.type : it.type === state.class))
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
  }, [state.diametr, state.kuzov, stoprices])

  const [active, setActive] = useState('finish')
  // const checkboxServiceChange = (e) => {
  //   const { name, placeholder, checked, attributes } = e.target
  //   if (checked) {
  //     setService((prevState) => [
  //       ...prevState,
  //       {
  //         serviceName: name,
  //         quantity: 1,
  //         price: placeholder,
  //         name: attributes.somename.value,
  //         free: attributes.somefree?.value
  //       }
  //     ])
  //   } else {
  //     setService((prevState) => prevState.filter((it) => it.serviceName !== name))
  //   }
  // }
  // const servicePlusChange = (e) => {
  //   const { name } = e.target
  //   setService(
  //     service.map((object) => {
  //       if (object.serviceName === name) {
  //         return {
  //           ...object,
  //           quantity: object.quantity + 1
  //         }
  //       }
  //       return object
  //     })
  //   )
  // }

  // const serviceMinusChange = (e) => {
  //   const { name } = e.target
  //   setService(
  //     service.map((object) => {
  //       if (object.serviceName === name && object.quantity >= 2) {
  //         return {
  //           ...object,
  //           quantity: object.quantity - 1
  //         }
  //       }
  //       return object
  //     })
  //   )
  // }

  // const onServiceQuantityChange = (e) => {
  //   const { name, attributes, value } = e.target
  //   if (!service.find((it) => it.serviceName.includes(name))) {
  //     setService((prevState) => [
  //       ...prevState,
  //       {
  //         serviceName: name,
  //         quantity: value,
  //         price: attributes.someprice.value,
  //         name: attributes.somename.value,
  //         free: attributes.somefree?.value
  //       }
  //     ])
  //   } else {
  //     setService(
  //       service.map((object) => {
  //         if (object.serviceName === name && object.quantity) {
  //           return {
  //             ...object,
  //             quantity: value
  //           }
  //         }
  //         return object
  //       })
  //     )
  //   }
  // }

  // const servicePriceChange = (e) => {
  //   const { value, id, attributes, name } = e.target

  //   if (service.find((object) => object.serviceName === id)) {
  //     setService(
  //       service.map((object) => {
  //         if (object.serviceName === id) {
  //           return {
  //             ...object,
  //             price: value
  //           }
  //         }
  //         return object
  //       })
  //     )
  //   } else {
  //     setService((prevState) => [
  //       ...prevState,
  //       {
  //         serviceName: name,
  //         quantity: 1,
  //         price: value,
  //         name: attributes.somename.value,
  //         free: attributes.somefree.value
  //       }
  //     ])
  //   }
  // }

  const preChangeSto = () => {
    if (!state.regnumber) notify('Заполните поле гос.номер')
    if (!state.mark) notify('Укажите марку авто')
    if (!state.model) notify('Укажите модель авто')
    if (!state.place) notify('Укажите место работы')
    else {
      props.updateSto(props.id, {
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
        tyre: [...tyres],
        customerId: activeCustomer || props.customerId || null
      })
      if (checkLink()) {
        history.push(`/${type}boss/list/${props.num ? props.num : ''}`)
      } else {
        history.push(`/${type}/list/${props.num ? props.num : ''}`)
      }
      notify('Запись изменена')
    }
  }

  const changeSto = () => {
    if (!state.regnumber) notify('Заполните поле гос.номер')
    if (!state.mark) notify('Укажите марку авто')
    if (!state.model) notify('Укажите модель авто')
    if (!state.place) notify('Укажите место работы')
    if (!state.payment && !props.dateFinish) {
      props.updateSto(props.id, {
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
        tyre: [...tyres],
        employee: employees,
        dateFinish: props.dateFinish ? props.dateFinish : new Date(),
        status: statusList[1],
        customerId: activeCustomer || props.customerId || null
      })
      if (checkLink()) {
        history.push(`/${type}boss/list/${props.num ? props.num : ''}`)
      } else {
        history.push(`/${type}/list/${props.num ? props.num : ''}`)
      }
      notify('Запись изменена')
    } else if (state.payment === 'yes') {
      props.updateSto(props.id, {
        discount: state.discount,
        payment: state.payment,
        comment: state.comment,
        status: statusList[2],
        customerId: activeCustomer || props.customerId || null
      })
      if (checkLink()) {
        history.push(`/${type}boss/list/${props.num ? props.num : ''}`)
      } else {
        history.push(`/${type}/list/${props.num ? props.num : ''}`)
      }
      notify('Работа оплачена')
    } else if (state.payment === 'card') {
      props.updateSto(props.id, {
        discount: state.discount,
        payment: state.payment,
        comment: state.comment,
        status: statusList[3],
        customerId: activeCustomer || props.customerId || null
      })
      if (checkLink()) {
        history.push(`/${type}boss/list/${props.num ? props.num : ''}`)
      } else {
        history.push(`/${type}/list/${props.num ? props.num : ''}`)
      }
      notify('Работа оплачена (безнал)')
    } else if (state.payment === 'terminal') {
      props.updateSto(props.id, {
        discount: state.discount,
        payment: state.payment,
        comment: state.comment,
        status: statusList[4],
        customerId: activeCustomer || props.customerId || null
      })
      if (checkLink()) {
        history.push(`/${type}boss/list/${props.num ? props.num : ''}`)
      } else {
        history.push(`/${type}/list/${props.num ? props.num : ''}`)
      }
      notify('Работа оплачена (терминал)')
    } else if (state.payment === 'termandcash') {
      props.updateSto(props.id, {
        discount: state.discount,
        payment: state.payment,
        comment: state.comment,
        status: statusList[6],
        combTerm: termCash.terminal,
        combCash: termCash.cash,
        customerId: activeCustomer || props.customerId || null
      })
      if (checkLink()) {
        history.push(`/${type}boss/list/${props.num ? props.num : ''}`)
      } else {
        history.push(`/${type}/list/${props.num ? props.num : ''}`)
      }
      notify('Работа оплачена (терминал + наличные)')
    } else if (state.payment === 'cancel') {
      props.updateSto(props.id, {
        discount: state.discount,
        payment: state.payment,
        comment: state.comment,
        status: statusList[5],
        customerId: activeCustomer || props.customerId || null
      })
      if (checkLink()) {
        history.push(`/${type}boss/list/${props.num ? props.num : ''}`)
      } else {
        history.push(`/${type}/list/${props.num ? props.num : ''}`)
      }
      notify('Работа отменена')
    } else {
      props.updateSto(props.id, {
        // ...state,
        // services: service,
        // material: materials,
        // tyre: [...tyres],
        // employee: employees,
        discount: state.discount,
        payment: state.payment,
        comment: state.comment,
        customerId: activeCustomer || props.customerId || null
      })
      if (checkLink()) {
        history.push(`/${type}boss/list/${props.num ? props.num : ''}`)
      } else {
        history.push(`/${type}/list/${props.num ? props.num : ''}`)
      }
      notify('Запись изменена')
    }
  }

  // const nextStep = () => {
  //   if (active === 'employee') {
  //     if (employees.length < 1) {
  //       notify('Сначала выберите сотрудников')
  //     } else {
  //       setActive('car')
  //     }
  //   } else if (active === 'car') {
  //     if (!state.regnumber) {
  //       notify('Заполните гос. номер')
  //     } else if (!state.mark) {
  //       notify('Заполните поле Марка авто')
  //     } else if (!state.model) {
  //       notify('Заполните поле Модель авто')
  //     } else if (!state.kuzov) {
  //       notify('Выберите кузов')
  //     } else if (!state.diametr) {
  //       notify('Выберите диаметр')
  //     } else {
  //       setActive('service')
  //     }
  //   } else if (active === 'service') {
  //     if (service.length < 1) {
  //       notify('Выбериту услугу')
  //     } else {
  //       setActive('material')
  //     }
  //   } else if (active === 'material') {
  //     setActive('finish')
  //   } else if (active === 'finish') {
  //     setActive('finish')
  //   }
  // }

  const nextStep = () => {
    if (active === 'employee') {
      if (employees.length < 1) {
        notify('Сначала выберите сотрудников')
      }
      if (!box) {
        notify('Выберите бокс')
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
      } else if (!state.category && type === 'sto') {
        notify('Выберите категорию')
      } else if (!state.class && type === 'sto') {
        notify('Выберите класс авто')
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
      setActive('finish')
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
      } else if (!state.category && type === 'sto') {
        notify('Выберите категорию')
      } else if (!state.class && type === 'sto') {
        notify('Выберите класс авто')
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

  // const changeStep = (wanted) => {
  //   if (wanted === 'employee') {
  //     setActive('employee')
  //   }
  //   if (wanted === 'car') {
  //     if (employees.length < 1) {
  //       notify('Сначала выберите сотрудников')
  //     } else {
  //       setActive('car')
  //     }
  //   } else if (wanted === 'service') {
  //     if (employees.length < 1) {
  //       notify('Сначала выберите сотрудников')
  //     } else if (!state.regnumber) {
  //       notify('Заполните гос. номер')
  //     } else if (!state.mark) {
  //       notify('Заполните поле Марка авто')
  //     } else if (!state.model) {
  //       notify('Заполните поле Модель авто')
  //     } else if (!state.kuzov) {
  //       notify('Выберите кузов')
  //     } else if (!state.diametr) {
  //       notify('Выберите диаметр')
  //     } else {
  //       setActive('service')
  //     }
  //   } else if (wanted === 'material') {
  //     if (employees.length < 1) {
  //       notify('Сначала выберите сотрудников')
  //     } else if (!state.regnumber) {
  //       notify('Заполните гос. номер')
  //     } else if (!state.mark) {
  //       notify('Заполните поле Марка авто')
  //     } else if (!state.model) {
  //       notify('Заполните поле Модель авто')
  //     } else if (service.length < 1) {
  //       notify('Выбериту услугу')
  //     } else {
  //       setActive('material')
  //     }
  //   } else if (wanted === 'finish') {
  //     if (employees.length < 1) {
  //       notify('Сначала выберите сотрудников')
  //     } else if (!state.regnumber) {
  //       notify('Заполните гос. номер')
  //     } else if (!state.mark) {
  //       notify('Заполните поле Марка авто')
  //     } else if (!state.model) {
  //       notify('Заполните поле Модель авто')
  //     } else if (service.length < 1) {
  //       notify('Выбериту услугу')
  //     } else {
  //       setActive('finish')
  //     }
  //   }
  // }

  const printOne = (totalSumWithoutMaterials, totalMaterial, totalSumm, totalWithDiscount) => {
    props.stoPrintOne({
      ...state,
      services: service,
      material: materials,
      tyre: [...tyres],
      employee: employees,
      totalSumWithoutMaterials,
      totalMaterial,
      totalSumm,
      totalWithDiscount,
      box,
      [`id_${type}s`]: props[`id_${type}s`]
    })
  }

  const printTwo = (totalSumWithoutMaterials, totalMaterial, totalSumm, totalWithDiscount) => {
    props.stoPrintTwo({
      ...state,
      services: service,
      material: materials,
      tyre: [...tyres],
      employee: employees,
      totalSumWithoutMaterials,
      totalMaterial,
      totalSumm,
      totalWithDiscount,
      box,
      [`id_${type}s`]: props[`id_${type}s`]
    })
  }

  return (
    <div>
      <div className="bg-white shadow rounded-lg px-8 py-6 mb-4 flex flex-col my-2">
        <div className="flex flex-row">
          <div className="w-1/5 p-2">
            <button
              type="button"
              className={cx('p-4 bg-gray-200 rounded w-full h-full overflow-hidden', {
                block: active !== 'employee',
                'border-b-8 border-blue-400': active === 'employee'
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
                'border-b-8 border-blue-400': active === 'car'
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
                'border-b-8 border-blue-400': active === 'service'
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
                'border-b-8 border-blue-400': active === 'material'
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
                'border-b-8 border-blue-400': active === 'finish'
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
            type={type}
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
            type={type}
          />
        </div>
        <div
          className={cx('', {
            block: active === 'service',
            hidden: active !== 'service'
          })}
          key={state?.category}
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
            type={type}
            onServiceQuantityChange={onServiceQuantityChange}
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
            stoprices={stoprices}
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
            id_stos={props.id_stos}
            setTermCash={setTermCash}
            type={type}
          />
        </div>
      </div>
      <div className=" flex my-2">
        <Link
          to={
            checkLink()
              ? `/${type || 'sto'}boss/list/${props.num ? props.num : ''}`
              : `/${type || 'sto'}/list/${props.num ? props.num : ''}`
          }
          className="my-3 mr-2 py-3 w-1/3 px-3 bg-red-600 text-white text-center hover:bg-red-700 hover:text-white rounded-lg"
        >
          Отмена
        </Link>
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
              onClick={preChangeSto}
              type="submit"
            >
              Сохранить
            </button>
            <button
              className="my-3 ml-2 py-3 w-1/2 px-3 bg-green-600 text-white hover:bg-green-700 hover:text-white rounded-lg"
              onClick={changeSto}
              type="submit"
            >
              Завершить
            </button>
          </div>
        ) : null}
        {active === 'finish' && props.dateFinish ? (
          <button
            className="my-3 ml-2 py-3 w-2/3 px-3 bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg"
            onClick={changeSto}
            type="submit"
          >
            Сохранить
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default StosEdit
