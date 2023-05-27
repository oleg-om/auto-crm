import mongoose from 'mongoose'
import config from '../config'

mongoose.connection.on('connected', () => {
  console.log('db is connected')
})

mongoose.connection.on('error', (err) => {
  console.log(`can not connected to db ${err}`)
  process.exit(1)
})

const connect = async (mongoURL = config.mongoURL) => {
  await mongoose.connect(mongoURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    poolSize: 40
  })
  return mongoose.connection
}

export default connect
