import mongoose from 'mongoose'
import config from '../config'

mongoose.connection.on('connected', () => {
  console.log('db is connected')
})

mongoose.connection.on('error', (err) => {
  console.log(`can not connected to db ${err}`)
})

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...')
})

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected')
})

const connect = async (mongoURL = config.mongoURL) => {
  await mongoose.connect(mongoURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    maxPoolSize: 20, // Уменьшаем пул соединений (было 40)
    minPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4, // Использовать IPv4, избегая проблем с IPv6
    retryWrites: true,
    retryReads: true
  })
  return mongoose.connection
}

export default connect
