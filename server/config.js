require('dotenv').config()

const options = {
  port: process.env.PORT,
  app: process.env.APP,
  env: process.env.NODE_ENV,
  isSocketsEnabled: process.env.ENABLE_SOCKETS,
  mongoURL: process.env.MONGO_URL,
  // mongoURL: 'mongodb://autoDOM:pul%tOIJ0?LE@localhost:27017/chat',
  secret: process.env.SECRET_JWT || 'secretKey'
}

export default options
