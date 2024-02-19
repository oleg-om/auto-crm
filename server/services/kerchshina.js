import fetch from 'node-fetch'
import Tyre from '../model/tyres'
import Setting from '../model/settings'
import tyresController from '../controller/tyres.controller'

const LAST_ORDER = 3292

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

function takeOrderNumberFromSettings() {
  return new Promise((resolve) => {
    Setting.find()
      .sort({ siteNumber: -1 })
      .limit(1)
      .then((data) => data[0].lastKerchshina)
      .then((data) => Number(data))
      .then((data) => resolve(data))
      .catch((err) => console.log(err))
  })
}

// 2. Create an async function
async function takeOrderFromKerchshina() {
  const result = await takeOrderNumber()
  const resultSecond = await takeOrderNumberFromSettings()
  return new Promise((resolve) => {
    if (result) {
      fetch('http://kerchshina.com/api/orders')
        .then((response) => response.json())
        // .then((data) => (data.find((it) => it.Order.id === JSON.stringify(result))? data.find((it) => it.Order.id === JSON.stringify(result)) : data.find((it) => it.Order.id === JSON.stringify(result+1))))
        .then((data) =>
          data.find((it) => Number(it.Order.id) >= result && Number(it.Order.id) >= LAST_ORDER)
        )
        .then((data) => (data ? resolve(data) : console.log('There is no new orders')))
        .catch((err) => console.log(err))
    } else if (!result) {
      fetch('http://kerchshina.com/api/orders')
        .then((response) => response.json())
        .then((data) => data.find((it) => it.Order.id === JSON.stringify(resultSecond)))
        .then((data) => (data ? resolve(data) : console.log('There is no settings number')))
        .catch((err) => console.log(err))
    }
  })
}

async function takeProducts() {
  const order = await takeOrderFromKerchshina()
  const idsArray = order.OrderProduct.reduce((acc, rec) => [...acc, rec.product_id], [])
  return new Promise((resolve) => {
    if (!idsArray.includes('six654321')) {
      fetch('http://kerchshina.com/api/products')
        .then((response) => response.json())
        .then((data) => data.filter((item) => idsArray.includes(item.Product.id)))
        .then((data) => resolve(data))
    }
  })
}

async function takeBrands() {
  const products = await takeProducts()
  const idsArray = products.reduce((acc, rec) => [...acc, rec.Product.brand_id], [])
  return new Promise((resolve) => {
    fetch('http://kerchshina.com/api/brands')
      .then((response) => response.json())
      .then((data) => data.filter((item) => idsArray.includes(item.Brand.id)))
      .then((data) => resolve(data))
  })
}

async function takeModels() {
  const products = await takeProducts()
  const idsArray = products.reduce((acc, rec) => [...acc, rec.Product.model_id], [])
  return new Promise((resolve) => {
    fetch('http://kerchshina.com/api/models')
      .then((response) => response.json())
      .then((data) => data.filter((item) => idsArray.includes(item.BrandModel.id)))
      .then((data) => resolve(data))
  })
}

async function kerchshinaCheck(io) {
  const order = await takeOrderFromKerchshina()
  const products = await takeProducts()
  const brands = await takeBrands()
  const models = await takeModels()
  return new Promise(() => {
    const productssnew = products.reduce((acc, rec) => [...acc, rec.Product], [])
    const brandsnew = brands.reduce((acc, rec) => [...acc, rec.Brand], [])
    const modelsnew = models.reduce((acc, rec) => [...acc, rec.BrandModel], [])
    const resultOrder = {
      siteNumber: order.Order.id,
      name: order.Order.name,
      phone: order.Order.phone,
      employee: 'kerchshina.com',
      place: 'kerchshina.com',
      date: new Date(order.Order.created),
      comment: `${order.Order.email ? `Эмйел: ${order.Order.email} , ` : ''}${
        order.Order.city ? `город: ${order.Order.city} , ` : ''
      }${order.Order.address ? `адрес: ${order.Order.address} , ` : ''}${
        order.OrderEvent && order.OrderEvent?.length && order.OrderEvent.find((oev) => oev?.comment)
          ? `Комментарий: ${order.OrderEvent.find((oev) => oev?.comment)?.comment || ''}`
          : ''
      }`
    }
    const finalArr = {
      ...resultOrder,
      preorder: order.OrderProduct.reduce(
        (acc, rec) => [
          ...acc,
          rec && rec.product_id
            ? {
                price: rec.price,
                mode: 'full',
                tyreItem: '',
                quantity: rec.quantity,
                brand: brandsnew.find(
                  (item) => item.id === productssnew.find((it) => it.id === rec.product_id).brand_id
                )?.title,
                model: modelsnew.find(
                  (item) => item.id === productssnew.find((it) => it.id === rec.product_id).model_id
                )?.title,
                type: productssnew.find((it) => it.id === rec.product_id)?.category_id,
                sizeone:
                  productssnew.find((it) => it.id === rec.product_id).category_id === '1'
                    ? productssnew.find((it) => it.id === rec.product_id)?.size1
                    : '',
                sizetwo:
                  productssnew.find((it) => it.id === rec.product_id).category_id === '1'
                    ? productssnew.find((it) => it.id === rec.product_id)?.size2
                    : '',
                sizethree:
                  productssnew.find((it) => it.id === rec.product_id).category_id === '1'
                    ? productssnew.find((it) => it.id === rec.product_id)?.size3
                    : '',
                indexone:
                  productssnew.find((it) => it.id === rec.product_id).category_id === '1'
                    ? productssnew.find((it) => it.id === rec.product_id)?.f1
                    : '',
                indextwo:
                  productssnew.find((it) => it.id === rec.product_id).category_id === '1'
                    ? productssnew.find((it) => it.id === rec.product_id)?.f2
                    : '',
                season:
                  productssnew.find((it) => it.id === rec.product_id).category_id === '1'
                    ? productssnew.find((it) => it.id === rec.product_id)?.season
                    : '',
                stud:
                  productssnew.find((it) => it.id === rec.product_id).category_id === '1'
                    ? productssnew.find((it) => it.id === rec.product_id)?.stud
                    : '',
                diametr:
                  productssnew.find((it) => it.id === rec.product_id).category_id === '2'
                    ? productssnew.find((it) => it.id === rec.product_id)?.size1
                    : '',
                pcd:
                  productssnew.find((it) => it.id === rec.product_id).category_id === '2'
                    ? productssnew.find((it) => it.id === rec.product_id)?.size2
                    : '',
                et:
                  productssnew.find((it) => it.id === rec.product_id).category_id === '2'
                    ? productssnew.find((it) => it.id === rec.product_id)?.et
                    : '',
                dia:
                  productssnew.find((it) => it.id === rec.product_id).category_id === '2'
                    ? productssnew.find((it) => it.id === rec.product_id)?.hub
                    : '',
                wheelwidth:
                  productssnew.find((it) => it.id === rec.product_id).category_id === '2'
                    ? productssnew.find((it) => it.id === rec.product_id)?.size3
                    : '',
                tok:
                  productssnew.find((it) => it.id === rec.product_id).category_id === '3'
                    ? productssnew.find((it) => it.id === rec.product_id)?.current
                    : '',
                emkost:
                  productssnew.find((it) => it.id === rec.product_id).category_id === '3'
                    ? productssnew.find((it) => it.id === rec.product_id)?.ah
                    : '',
                typeakb:
                  productssnew.find((it) => it.id === rec.product_id).category_id === '3'
                    ? productssnew.find((it) => it.id === rec.product_id)?.f1
                    : '',
                polar:
                  productssnew.find((it) => it.id === rec.product_id).category_id === '3'
                    ? productssnew.find((it) => it.id === rec.product_id)?.f2
                    : ''
              }
            : null
        ],
        []
      )
    }
    // const arrtoDb = new Tyre(finalArr)
    if (finalArr.siteNumber) {
      // arrtoDb.save()
      console.log('kerchina check')
      tyresController.create(
        { body: finalArr },
        { json: (e) => console.log('kerchshina create', e) }
      )
      io.emit('update tyre from oline shop')
    }
  })
}

// async function kerchshinaCheck() {
//   const order = await takeOrderFromKerchshina()
//   const products = await takeProducts()
//   console.log('final step')
//   const idsArray = order.reduce((acc, rec) => [...acc, rec.product_id], [])
// }

export default kerchshinaCheck
