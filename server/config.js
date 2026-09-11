require('dotenv').config()

// SECRET_JWT signs every login token - without it, this hardcoded fallback
// would let anyone forge a valid token for any account. Only tolerated
// outside production, where a missing secret is a hard error instead.
if (!process.env.SECRET_JWT && process.env.NODE_ENV === 'production') {
  throw new Error('SECRET_JWT must be set in production')
}

const options = {
  port: process.env.PORT,
  app: process.env.APP,
  env: process.env.NODE_ENV,
  isSocketsEnabled: process.env.ENABLE_SOCKETS,
  mongoURL: process.env.MONGO_URL,
  // mongoURL: 'mongodb://autoDOM:pul%tOIJ0?LE@localhost:27017/chat',
  secret: process.env.SECRET_JWT || 'secretKey',
  externalApiKey: process.env.EXTERNAL_API_KEY
}

export default options
