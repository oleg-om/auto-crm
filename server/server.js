/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
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
import { isAdmin } from './utils/roles'

let appVersion = 'dev'
try {
  // Written by webpack at build time; not present in local dev
  // eslint-disable-next-line import/no-unresolved
  appVersion = require('../dist/assets/version.json').version
} catch (e) {
  // local dev — no version.json
}

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
const employeeReportRoutes = require('./routes/api/employeeReport.routes')
const positionRoutes = require('./routes/api/position.routes')
const journalEntryRoutes = require('./routes/api/journalEntry.routes')
const organizationRoutes = require('./routes/api/organization.routes')
const diskpaintingRoutes = require('./routes/api/diskpainting.routes')
const diskpaintingPriceRoutes = require('./routes/api/diskpainting.price.routes')
const { errorHandler, registerProcessHandlers } = require('./middleware/errorHandler')

registerProcessHandlers()

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
const isStudyMode = process.env.MODE === 'study'

const io = new SocketIOServer(serve, {
  cors: {
    // `true` = reflect request Origin when SOCKET_CORS_ORIGIN unset (Docker / prod domain).
    // Set SOCKET_CORS_ORIGIN in .env to explicit URL(s) to lock down.
    origin: [
      process.env.WORK_DOMAIN,
      process.env.STUDY_DOMAIN,
      process.env.REACT_APP_STUDY_WEBSOCKET_URL,
      process.env.REACT_APP_MAIN_WEBSOCKET_URL
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
})

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

function createToken(user, extraPayload = {}) {
  const payload = { uid: user.id, ...extraPayload }
  const token = jwt.sign(payload, config.secret, { expiresIn: '8760h' })
  delete user.password
  return token
}

async function getTokenAndUser(data) {
  const user = await User.findAndValidateUser(data)
  const token = createToken(user)
  return { token, user }
}

const COOKIE_OPTIONS = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax',
  secure: config.env === 'production'
}

function createCookie(token, res) {
  return res.cookie('token', token, { ...COOKIE_OPTIONS, maxAge: 1000 * 60 * 60 * 8760 })
}

// Public - no valid session required yet, this is how one is obtained.
server.get('/api/v1/auth', async (req, res) => {
  try {
    const jwtUser = jwt.verify(req.cookies.token, config.secret, { algorithms: ['HS256'] })
    const user = await User.findById(jwtUser.uid)

    let impersonatedBy = null
    if (jwtUser.impersonatedBy) {
      const admin = await User.findById(jwtUser.impersonatedBy)
      if (admin) {
        impersonatedBy = { id: admin.id, login: admin.login }
      }
    }

    const token = createToken(user, impersonatedBy ? { impersonatedBy: impersonatedBy.id } : {})
    createCookie(token, res)
    res.json({ status: 'ok', token, user, impersonatedBy })
  } catch (err) {
    res.json({ status: 'error', err })
  }
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

// The token cookie is httpOnly - the client can't clear it itself on sign out,
// so it needs this endpoint. Public so it still works with an already-expired
// or invalid cookie.
server.post('/api/v1/logout', (req, res) => {
  res.clearCookie('token', COOKIE_OPTIONS)
  res.json({ status: 'ok' })
})

// The external site posts tyre orders here without a CRM login - accept it
// if it carries the shared secret instead of a session cookie.
const PUBLIC_API_KEY_ROUTES = [{ method: 'POST', path: '/api/v1/tyre' }]

// Everything else under /api/v1 requires a valid session from here on.
function requireAuth(req, res, next) {
  const requestPath = req.originalUrl.split('?')[0].replace(/\/+$/, '') || '/'
  const publicRoute = PUBLIC_API_KEY_ROUTES.find(
    (route) => route.method === req.method && route.path === requestPath
  )
  if (publicRoute) {
    if (config.externalApiKey && req.headers['x-api-key'] === config.externalApiKey) {
      next()
      return
    }
    res.status(401).json({ status: 'error', message: 'Unauthorized' })
    return
  }

  try {
    req.jwtUser = jwt.verify(req.cookies.token, config.secret, { algorithms: ['HS256'] })
    next()
  } catch (err) {
    res.status(401).json({ status: 'error', message: 'Unauthorized' })
  }
}

function getFormatMessages(messages) {
  const formatedMessages = messages.map((it) => ({ [it.userName]: it.message }))
  return formatedMessages
}

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

server.use('/api/v1', requireAuth)

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
server.use('/api/v1', employeeReportRoutes)
server.use('/api/v1', positionRoutes)
server.use('/api/v1', journalEntryRoutes)
server.use('/api/v1', diskpaintingRoutes)
server.use('/api/v1', diskpaintingPriceRoutes)
server.use('/api/v1', organizationRoutes)

// Account management (list/create/edit/delete/role changes) is admin-only -
// without this, any authenticated user (including a self-registered one)
// could edit their own account's `role` field and grant themselves admin.
async function requireAdmin(req, res, next) {
  const user = await User.findById(req.jwtUser.uid)
  if (!user || !isAdmin(user.role)) {
    res.status(403).json({ status: 'error', message: 'Forbidden' })
    return
  }
  next()
}

server.get('/api/v1/account', requireAdmin, async (req, res) => {
  const list = await User.find({}).select('-password')
  return res.json({ status: 'ok', data: list })
})

server.patch('/api/v1/account/:id', requireAdmin, async (req, res) => {
  const account = await User.findById(req.params.id)
  // Go through .save() (not findOneAndUpdate's $set) so the password gets
  // re-hashed by the pre('save') hook whenever it's part of the update -
  // findOneAndUpdate would otherwise write it to MongoDB in plain text.
  Object.assign(account, req.body)
  await account.save()

  const data = account.toObject()
  delete data.password
  return res.json({ status: 'ok', data })
})

server.delete('/api/v1/account/:id', requireAdmin, async (req, res) => {
  await User.deleteOne({ _id: req.params.id })
  return res.json({ status: 'ok', _id: req.params.id })
})

server.post('/api/v1/account', requireAdmin, async (req, res) => {
  const account = new User(req.body)
  await account.save()
  const data = account.toObject()
  delete data.password
  return res.json({ status: 'ok', data })
})

// Was public self-registration - closed off (admin-only, same as the rest of
// account management) since anyone could otherwise create their own account.
// Doesn't log the caller in as the new user - the admin creating it stays
// signed in as themselves.
server.post('/api/v1/registration', requireAdmin, async (req, res) => {
  const { login, password, userName } = req.body
  try {
    const newUser = new User({ login, password, userName })
    await newUser.save()
    const data = newUser.toObject()
    delete data.password
    res.json({ status: 'ok', data })
  } catch (err) {
    res.json({ status: 'error', message: `registrate error ${err}` })
  }
})

server.post('/api/v1/account/:id/impersonate', requireAdmin, async (req, res) => {
  try {
    const admin = await User.findById(req.jwtUser.uid)

    const target = await User.findById(req.params.id)
    if (!target) {
      res.status(404).json({ status: 'error', message: 'Account not found' })
      return
    }

    const token = createToken(target, { impersonatedBy: admin.id })
    createCookie(token, res)
    res.json({
      status: 'ok',
      token,
      user: target,
      impersonatedBy: { id: admin.id, login: admin.login }
    })
  } catch (err) {
    res.status(500).json({ status: 'error', message: `impersonate error ${err}` })
  }
})

server.post('/api/v1/account/return-to-self', async (req, res) => {
  try {
    if (!req.jwtUser.impersonatedBy) {
      res.status(400).json({ status: 'error', message: 'Not impersonating' })
      return
    }

    const admin = await User.findById(req.jwtUser.impersonatedBy)
    if (!admin) {
      res.status(404).json({ status: 'error', message: 'Original account not found' })
      return
    }

    const token = createToken(admin)
    createCookie(token, res)
    res.json({ status: 'ok', token, user: admin, impersonatedBy: null })
  } catch (err) {
    res.status(500).json({ status: 'error', message: `return-to-self error ${err}` })
  }
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  version: appVersion,
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
      version: appVersion,
      initialState
    })
  )
})

server.use(errorHandler)

serve.listen(port)

io.on('connection', (socket) => {
  console.log('new user')
  connections.push(socket)
  socket.on('new login', async ({ token, currentRoom }) => {
    try {
      const user = jwt.verify(token, config.secret, { algorithms: ['HS256'] })
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
    io.of('/').sockets.get(id)?.disconnect()
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

  socket.on('new diskpainting', () => {
    io.emit('update diskpainting')
  })

  socket.on('edit diskpainting', () => {
    io.emit('update edited diskpainting')
  })

  // socket.on('new storage', ({ storage }) => {
  //   io.emit('update storage', storage)
  // })

  // socket.on('edit storage', () => {
  //   io.emit('update edited storage')
  // })
})

console.log(`Serving at http://localhost:${port}`)
