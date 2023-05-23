import { useState } from 'react'

export function useServices(propsServices) {
  const [service, setService] = useState(propsServices || [])

  const checkboxServiceChange = (e) => {
    const { name, placeholder, checked, attributes } = e.target
    if (checked) {
      setService((prevState) => [
        ...prevState,
        {
          serviceName: name,
          quantity: 1,
          price: placeholder,
          name: attributes.somename.value,
          free: attributes.somefree?.value
        }
      ])
    } else {
      setService((prevState) => prevState.filter((it) => it.serviceName !== name))
    }
  }
  const servicePlusChange = (e) => {
    const { name } = e.target
    setService(
      service.map((object) => {
        if (object.serviceName === name) {
          return {
            ...object,
            quantity: object.quantity + 1
          }
        }
        return object
      })
    )
  }

  const serviceMinusChange = (e) => {
    const { name } = e.target
    setService(
      service.map((object) => {
        if (object.serviceName === name && object.quantity >= 2) {
          return {
            ...object,
            quantity: object.quantity - 1
          }
        }
        return object
      })
    )
  }

  const onServiceQuantityChange = (e) => {
    const { name, attributes, value } = e.target
    if (!service.find((it) => it.serviceName.includes(name))) {
      setService((prevState) => [
        ...prevState,
        {
          serviceName: name,
          quantity: value,
          price: attributes.someprice?.value || 0,
          name: attributes.somename.value,
          free: attributes.somefree?.value
        }
      ])
    } else {
      setService(
        service.map((object) => {
          if (object.serviceName === name && object.quantity) {
            return {
              ...object,
              quantity: value
            }
          }
          return object
        })
      )
    }
  }

  const servicePriceChange = (e) => {
    const { value, id, attributes, name } = e.target

    if (service.find((object) => object.serviceName === id)) {
      setService(
        service.map((object) => {
          if (object.serviceName === id) {
            return {
              ...object,
              price: value
            }
          }
          return object
        })
      )
    } else {
      setService((prevState) => [
        ...prevState,
        {
          serviceName: name,
          quantity: 1,
          price: value,
          name: attributes.somename.value,
          free: attributes.somefree.value
        }
      ])
    }
  }

  return {
    service,
    setService,
    checkboxServiceChange,
    servicePlusChange,
    serviceMinusChange,
    onServiceQuantityChange,
    servicePriceChange
  }
}

export default useServices
