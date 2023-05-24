import { useState } from 'react'

export function useMaterials(propsMaterials) {
  const [materials, setMaterials] = useState(propsMaterials || [])

  const checkboxMaterialChange = (e) => {
    const { name, placeholder, checked, attributes } = e.target
    if (checked) {
      setMaterials((prevState) => [
        ...prevState,
        {
          serviceName: name,
          quantity: 1,
          price: placeholder,
          name: attributes.somename.value,
          free: attributes.somefree.value
        }
      ])
    } else {
      setMaterials((prevState) => prevState.filter((it) => it.serviceName !== name))
    }
  }
  const materialPlusChange = (e) => {
    const { name } = e.target
    setMaterials(
      materials.map((object) => {
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

  const materialEightChange = (e) => {
    const { name } = e.target
    setMaterials(
      materials.map((object) => {
        if (object.serviceName === name) {
          return {
            ...object,
            quantity: 8
          }
        }
        return object
      })
    )
  }

  const checkboxMaterialPlusChange = (e) => {
    const { name, attributes } = e.target
    if (!materials.find((it) => it.serviceName.includes(name))) {
      setMaterials((prevState) => [
        ...prevState,
        {
          serviceName: name,
          quantity: 8,
          price: attributes.someprice.value,
          name: attributes.somename.value,
          free: attributes.somefree.value
        }
      ])
    }
  }

  const materialMinusChange = (e) => {
    const { name } = e.target
    setMaterials(
      materials.map((object) => {
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

  const materialPriceChange = (e) => {
    const { value, id } = e.target
    setMaterials(
      materials.map((object) => {
        if (object.serviceName === id) {
          return {
            ...object,
            price: value
          }
        }
        return object
      })
    )
  }

  const materialOnChange = (e) => {
    const { value, id, attributes, name } = e.target
    if (!materials.find((it) => it.serviceName.includes(name))) {
      setMaterials((prevState) => [
        ...prevState,
        {
          serviceName: name,
          quantity: value,
          price: attributes.someprice.value,
          name: attributes.somename.value,
          free: attributes.somefree.value
        }
      ])
    } else {
      setMaterials(
        materials.map((object) => {
          if (object.serviceName === id) {
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

  return {
    materials,
    setMaterials,
    checkboxMaterialChange,
    materialPlusChange,
    materialEightChange,
    checkboxMaterialPlusChange,
    materialMinusChange,
    materialPriceChange,
    materialOnChange
  }
}

export default useMaterials
