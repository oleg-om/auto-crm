import { useEffect, useRef, useState } from 'react'

export function useFindCustomer(props, state) {
  const [customer, setCustomer] = useState({
    regnumber: '',
    vinnumber: '',
    mark: '',
    model: '',
    gen: '',
    mod: '',
    name: '',
    phone: '',
    idOfItem: ''
  })

  const [search, setSearch] = useState()
  console.log('search: ', search)
  const [activeCustomer, setActiveCustomer] = useState('')
  // find client
  useEffect(() => {
    console.log('props.customerId: ', props.customerId)
    if (props.customerId && !activeCustomer) {
      setActiveCustomer(props.customerId)
      setSearch(props.customerId)
    }
    return () => {}
  }, [props.customerId])

  const [customerList, setCustomerOptions] = useState([])
  console.log('customerList: ', customerList)

  // eslint-disable-next-line no-unused-vars
  const throttling = useRef(false)

  useEffect(() => {
    // if (throttling.current) {
    //   return
    // }

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

  useEffect(() => {
    if (props.customerId) {
      fetch(`/api/v1/customer/${props.customerId}`)
        .then((res) => res.json())
        .then((it) => {
          if (it?.data) {
            setCustomerOptions([it.data])
            setCustomer({ ...it.data, idOfItem: it.data.id })
          }
        })
    }
  }, [props.customerId])

  useEffect(() => {
    if (state.regnumber !== '') {
      setCustomerOptions(
        customerList.filter(
          (it) => it.regnumber === state.regnumber && it.regnumber !== '' && state.regnumber !== ''
        )
      )
    } else if (state.regnumber === '') {
      setCustomerOptions([])
    }
  }, [state.regnumber])

  return {
    customer,
    setCustomer,
    search,
    setSearch,
    customerList,
    activeCustomer,
    setActiveCustomer
  }
}

export default useFindCustomer
