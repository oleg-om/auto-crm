import mongoose from 'mongoose'

mongoose.connection.on('connected', () => {
  console.log('db is connected')
})

mongoose.connection.on('error', (err) => {
  console.log(`can not connected to db ${err}`)
  process.exit(1)
})

const connect = async () => {
  mongoose.connect('mongodb://localhost:27017/chat', {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  return mongoose.connection
}

export default connect
