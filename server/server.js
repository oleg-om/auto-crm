/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import http from 'http'
import socketServer from 'socket.io'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'

import cookieParser from 'cookie-parser'
import passport from 'passport'
import jwt from 'jsonwebtoken'

import config from './config'
import connectDatabase from './services/mongoose'
import passportJWT from './services/passport'
import User from './model/User.model'
import Message from './model/Message.model'
import Html from '../client/html'
import kerchshinaCheck from './services/kerchshina'

const { createProxyMiddleware } = require('http-proxy-middleware')

const taskRoutes = require('./routes/api/task.routes')
const placeRoutes = require('./routes/api/place.routes')
const employeeRoutes = require('./routes/api/employee.routes')
const carRoutes = require('./routes/api/car.routes')
const autopartRoutes = require('./routes/api/autoparts.routes')
const customerRoutes = require('./routes/api/customer.routes')
const razvalRoutes = require('./routes/api/razval.routes')
const oilRoutes = require('./routes/api/oil.routes')
const settingRoutes = require('./routes/api/setting.routes')
const materialRoutes = require('./routes/api/material.routes')
const shinomotazhpriceRoutes = require('./routes/api/shinomotazh.price.routes')
const shinomotazhRoutes = require('./routes/api/shinomotazh.routes')
const vendorRoutes = require('./routes/api/vendor.routes')
const tyreRoutes = require('./routes/api/tyres.routes')
const storageRoutes = require('./routes/api/storage.routes')
const toolRoutes = require('./routes/api/tools.routes')
const stopriceRoutes = require('./routes/api/sto.price.routes')
const stoRoutes = require('./routes/api/sto.routes')
const categoryRoutes = require('./routes/api/category.routes')
const washpriceRoutes = require('./routes/api/wash.price.routes')
const washRoutes = require('./routes/api/wash.routes')
const windowRoutes = require('./routes/api/window.routes')
const windowPriceRoutes = require('./routes/api/window.price.routes')
const condRoutes = require('./routes/api/cond.routes')
const condPriceRoutes = require('./routes/api/cond.price.routes')

const Root = () => ''

try {
  console.log('start')
} catch (ex) {
  console.error(' run yarn build:prod to enable ssr')
}

const connections = []
const userNames = {}

connectDatabase()

const port = process.env.PORT || 8090
const server = express()
const serve = http.createServer(server)
const io = socketServer(serve)

const middleware = [
  cors({
    origin: 'http://localhost:8087/'
  }),
  passport.initialize(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  bodyParser.json({ limit: '50mb', extended: true }),
  cookieParser()
]

middleware.forEach((it) => server.use(it))

passport.use('jwt', passportJWT)

function createToken(user) {
  const payload = { uid: user.id }
  const token = jwt.sign(payload, config.secret, { expiresIn: '8760h' })
  delete user.password
  return token
}

async function getTokenAndUser(data) {
  const user = await User.findAndValidateUser(data)
  const token = createToken(user)
  return { token, user }
}

function createCookie(token, res) {
  return res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 8760 })
}

function getFormatMessages(messages) {
  const formatedMessages = messages.map((it) => ({ [it.userName]: it.message }))
  return formatedMessages
}

const isStudyMode = process.env.MODE === 'study'

// proxy if is study mode
const placesProxy = createProxyMiddleware('/api/v1/place', {
  target: `${process.env.WORK_DOMAIN}`,
  changeOrigin: true
})
const carsProxy = createProxyMiddleware('/api/v1/car', {
  target: `${process.env.WORK_DOMAIN}`,
  changeOrigin: true
})
const customerProxy = createProxyMiddleware('/api/v1/customer', {
  target: `${process.env.WORK_DOMAIN}`,
  changeOrigin: true
})
const materialProxy = createProxyMiddleware('/api/v1/material', {
  target: `${process.env.WORK_DOMAIN}`,
  changeOrigin: true
})
const shinomontazhPriceProxy = createProxyMiddleware('/api/v1/shinomontazhprice', {
  target: `${process.env.WORK_DOMAIN}`,
  changeOrigin: true
})
const vendorProxy = createProxyMiddleware('/api/v1/vendor', {
  target: `${process.env.WORK_DOMAIN}`,
  changeOrigin: true
})
const stoPriceProxy = createProxyMiddleware('/api/v1/stoprice', {
  target: `${process.env.WORK_DOMAIN}`,
  changeOrigin: true
})
const washPriceProxy = createProxyMiddleware('/api/v1/washprice', {
  target: `${process.env.WORK_DOMAIN}`,
  changeOrigin: true
})
const condPriceProxy = createProxyMiddleware('/api/v1/condprice', {
  target: `${process.env.WORK_DOMAIN}`,
  changeOrigin: true
})
const windowPriceProxy = createProxyMiddleware('/api/v1/windowprice', {
  target: `${process.env.WORK_DOMAIN}`,
  changeOrigin: true
})
const categoryProxy = createProxyMiddleware('/api/v1/category', {
  target: `${process.env.WORK_DOMAIN}`,
  changeOrigin: true
})

if (isStudyMode) {
  server.use('/api/v1/place', placesProxy)
  server.use('/api/v1/car', carsProxy)
  server.use('/api/v1/customer', customerProxy)
  server.use('/api/v1/material', materialProxy)
  server.use('/api/v1/shinomontazhprice', shinomontazhPriceProxy)
  server.use('/api/v1/vendor', vendorProxy)
  server.use('/api/v1/stoprice', stoPriceProxy)
  server.use('/api/v1/washprice', washPriceProxy)
  server.use('/api/v1/condprice', condPriceProxy)
  server.use('/api/v1/windowprice', windowPriceProxy)
  server.use('/api/v1/category', categoryProxy)
}

server.use('/api/v1', placeRoutes)
server.use('/api/v1', taskRoutes)
server.use('/api/v1', employeeRoutes)
server.use('/api/v1', carRoutes)
server.use('/api/v1', autopartRoutes)
server.use('/api/v1', customerRoutes)
server.use('/api/v1', razvalRoutes)
server.use('/api/v1', oilRoutes)
server.use('/api/v1', settingRoutes)
server.use('/api/v1', materialRoutes)
server.use('/api/v1', shinomotazhpriceRoutes)
server.use('/api/v1', shinomotazhRoutes)
server.use('/api/v1', vendorRoutes)
server.use('/api/v1', tyreRoutes)
server.use('/api/v1', storageRoutes)
server.use('/api/v1', toolRoutes)
server.use('/api/v1', stopriceRoutes)
server.use('/api/v1', stoRoutes)
server.use('/api/v1', categoryRoutes)
server.use('/api/v1', washpriceRoutes)
server.use('/api/v1', washRoutes)
server.use('/api/v1', windowRoutes)
server.use('/api/v1', windowPriceRoutes)
server.use('/api/v1', condRoutes)
server.use('/api/v1', condPriceRoutes)

server.get('/api/v1/auth', async (req, res) => {
  try {
    const jwtUser = jwt.verify(req.cookies.token, config.secret)
    const user = await User.findById(jwtUser.uid)

    const token = createToken(user)
    createCookie(token, res)
    res.json({ status: 'ok', token, user })
  } catch (err) {
    res.json({ status: 'error', err })
  }
})

server.get('/api/v1/account', async (req, res) => {
  const list = await User.find({})
  return res.json({ status: 'ok', data: list })
})

server.patch('/api/v1/account/:id', async (req, res) => {
  let account = await User.findOneAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { upsert: false, useFindAndModify: false }
  )
  await account.save()
  account = await User.findOne({ _id: req.params.id })

  return res.json({ status: 'ok', data: account })
})

server.delete('/api/v1/account/:id', async (req, res) => {
  await User.deleteOne({ _id: req.params.id })
  return res.json({ status: 'ok', _id: req.params.id })
})

server.post('/api/v1/account', async (req, res) => {
  const account = new User(req.body)
  await account.save()
  return res.json({ status: 'ok', data: account })
})

server.post('/api/v1/auth', async (req, res) => {
  try {
    const { token, user } = await getTokenAndUser(req.body)
    createCookie(token, res)
    res.json({ status: 'ok', token, user })
  } catch (err) {
    res.json({ status: 'error', message: `auth error ${err}` })
  }
})

server.post('/api/v1/registration', async (req, res) => {
  const { login, password, userName } = req.body
  try {
    const newUser = new User({
      login,
      password,
      userName
    })
    await newUser.save()
    const { token, user } = await getTokenAndUser(req.body)
    createCookie(token, res)
    res.json({ status: 'ok', token, user })
  } catch (err) {
    res.json({ status: 'error', message: `registrate error ${err}` })
  }
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Skillcrucial - Become an IT HERO'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

serve.listen(port)

io.on('connection', (socket) => {
  console.log('new user')
  connections.push(socket)
  socket.on('new login', async ({ token, currentRoom }) => {
    try {
      const user = jwt.verify(token, config.secret)
      const { userName, role } = await User.findById(user.uid)
      userNames[socket.id] = [userName, role]
      if (role.indexOf('admin') !== -1) {
        socket.emit('all users', userNames)
      }
      socket.join(currentRoom)
    } catch {
      console.log('tried to login without token')
    }
  })

  socket.on('load history', async (roomName) => {
    const messages = getFormatMessages(await Message.find({ room: roomName }))
    io.to(socket.id).emit('history messages', messages)
  })

  socket.on('send mess', async ({ messages, currentRoom }) => {
    try {
      const newMessage = new Message({
        userName: userNames[socket.id][0],
        message: messages,
        room: currentRoom
      })
      await newMessage.save()
    } catch (err) {
      console.log(`err${err}`)
    }
    io.to(currentRoom).emit('new message', { [userNames[socket.id][0]]: messages })
  })

  socket.on('disconnect', () => {
    delete userNames[socket.id]
  })

  socket.on('get clients', () => {
    if (
      typeof userNames[socket.id] !== 'undefined' &&
      userNames[socket.id].indexOf('admin') !== -1
    ) {
      socket.emit('all users', userNames)
    }
  })

  socket.on('disconnect user', (id) => {
    io.to(id).emit('delete cookie')
    io.of('/').sockets.get(id).disconnect()
    delete userNames[id]
  })

  const socketObj = (obj) => {
    if (!obj) {
      return obj
    }
    return {
      ...obj,
      ...(isStudyMode ? { crmMode: 'study' } : { crmMode: 'main' })
    }
  }

  socket.on('new autopart', () => {
    io.emit('update autopart', { status: 'test', place: 'test' })
  })

  socket.on('edit autopart', () => {
    io.emit('update edited autopart', { status: 'test', place: 'test' })
  })

  socket.on('new tool', () => {
    io.emit('update tool', { status: 'test', place: 'test' })
  })

  socket.on('edit tool', () => {
    io.emit('update edited tool', { status: 'test', place: 'test' })
  })

  socket.on('new razval', ({ razval }) => {
    // io.emit('update razval', { result: razval })
    io.emit('update razval', socketObj(razval))
  })

  socket.on('edit razval', () => {
    io.emit('update edited razval')
  })

  socket.on('new oil', ({ oil }) => {
    io.emit('update oil', socketObj(oil))
  })

  socket.on('edit oil', () => {
    io.emit('update edited oil')
  })

  // socket.on('new tyre', ({ tyre }) => {
  //   io.emit('update tyre', tyre)
  // })

  // socket.on('edit tyre', () => {
  //   io.emit('update edited tyre')
  // })

  socket.on('shinomontazh one print', (shinomontazh) => {
    io.emit('shinoneprint', socketObj(shinomontazh))
  })
  socket.on('shinomontazh two print', (shinomontazh) => {
    io.emit('shintwoprint', socketObj(shinomontazh))
  })

  socket.on('sto one print', (sto) => {
    io.emit('stooneprint', socketObj(sto))
  })
  socket.on('sto two print', (sto) => {
    io.emit('stotwoprint', socketObj(sto))
  })

  socket.on('wash one print', (sto) => {
    io.emit('washoneprint', socketObj(sto))
  })
  socket.on('wash two print', (sto) => {
    io.emit('washtwoprint', socketObj(sto))
  })

  socket.on('cond one print', (shinomontazh) => {
    io.emit('condoneprint', socketObj(shinomontazh))
  })
  socket.on('cond two print', (shinomontazh) => {
    io.emit('condtwoprint', socketObj(shinomontazh))
  })

  socket.on('window one print', (shinomontazh) => {
    io.emit('windowoneprint', socketObj(shinomontazh))
  })
  socket.on('window two print', (shinomontazh) => {
    io.emit('windowtwoprint', socketObj(shinomontazh))
  })

  socket.on('new shinomontazh', () => {
    console.log('new shinomontazh')
    io.emit('update shinomontazh')
  })

  socket.on('edit shinomontazh', () => {
    io.emit('update edited shinomontazh')
  })

  // socket.on('new storage', ({ storage }) => {
  //   io.emit('update storage', storage)
  // })

  // socket.on('edit storage', () => {
  //   io.emit('update edited storage')
  // })
})

console.log(`Serving at http://localhost:${port}`)

if (process.env.MODE !== 'study') {
  setInterval(() => kerchshinaCheck(io), 44000)
}
