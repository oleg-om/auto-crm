require('dotenv').config()

const options = {
  port: process.env.PORT,
  app: process.env.APP,
  env: process.env.NODE_ENV,
  isSocketsEnabled: process.env.ENABLE_SOCKETS,
  mongoURL: 'mongodb://localhost:27017/chat',
  secret: process.env.SECRET_JWT || 'secretKey'
}

export default options
