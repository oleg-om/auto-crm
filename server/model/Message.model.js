import mongoose from 'mongoose'

const messageScheme = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    room: {
      type: String,
      required: true
    }
  },
  {
    timestamp: true
  }
)

export default mongoose.model('messages', messageScheme)
