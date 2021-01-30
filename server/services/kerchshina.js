import fetch from 'node-fetch'
import Tyre from '../model/tyres'

function takeOrderNumber() {
  return new Promise((resolve) => {
    Tyre.find()
      .sort({ siteNumber: -1 })
      .limit(1)
      .then((data) => data[0].siteNumber)
      .then((data) => Number(data) + 1)
      .then((data) => resolve(data))
      .catch((err) => console.log(err))
  })
}

// 2. Create an async function
async function takeOrderFromKerchshina() {
  console.log('before promise call')
  const result = await takeOrderNumber()
  console.log(JSON.stringify(result))
  console.log('next step')
  return new Promise((resolve) => {
    fetch('http://kerchshina.com/api/orders')
      .then((response) => response.json())
      .then((data) => data.find((it) => it.Order.id === JSON.stringify(result)))
      .then((data) => resolve(data))
      .catch((err) => console.log(err))
  })
}

async function takeProducts() {
  const order = await takeOrderFromKerchshina()
  console.log(JSON.stringify(order))
  console.log('next step')
  const idsArray = order.OrderProduct.reduce((acc, rec) => [...acc, rec.product_id], [])
  console.log(idsArray)
  return new Promise((resolve) => {
    fetch('http://kerchshina.com/api/products')
      .then((response) => response.json())
      .then((data) => data.filter((item) => idsArray.includes(item.Product.id)))
      .then((data) => resolve(data))
  })
}

async function takeBrands() {
  const products = await takeProducts()
  console.log(JSON.stringify(products))
  console.log('next step')
  const idsArray = products.reduce((acc, rec) => [...acc, rec.Product.brand_id], [])
  console.log(idsArray)
  return new Promise((resolve) => {
    fetch('http://kerchshina.com/api/brands')
      .then((response) => response.json())
      .then((data) => data.filter((item) => idsArray.includes(item.Brand.id)))
      .then((data) => resolve(data))
  })
}

async function kerchshinaCheck() {
  const products = await takeProducts()
  const brands = await takeBrands()
  console.log(JSON.stringify(products))
  console.log(JSON.stringify(brands))
  console.log('next step')
  const idsArray = products.reduce((acc, rec) => [...acc, rec.Product.model_id], [])
  console.log(idsArray)
  return new Promise(() => {
    fetch('http://kerchshina.com/api/models')
      .then((response) => response.json())
      .then((data) => data.filter((item) => idsArray.includes(item.BrandModel.id)))
      .then((data) => console.log(JSON.stringify(data)))
  })
}

// async function kerchshinaCheck() {
//   const order = await takeOrderFromKerchshina()
//   const products = await takeProducts()
//   console.log('final step')
//   const idsArray = order.reduce((acc, rec) => [...acc, rec.product_id], [])
// }

export default kerchshinaCheck
