import mongoose from 'mongoose'
import bcrypt from 'bcrypt-nodejs'

const userSchema = new mongoose.Schema(
  {
    login: {
      type: String,
      required: true,
      unique: true
    },
    userName: {
      type: String,
      required: false,
      unique: false
    },
    role: {
      type: [String],
      required: false,
      default: ['user']
    },
    password: {
      type: String,
      required: true
    },
    place: {
      type: String,
      required: false
    },
    requestPasswordForReport: {
      type: Boolean,
      required: false
    },
    post: {
      type: Number,
      required: false
    }
  },
  {
    timestamp: true
  }
)

userSchema.pre('save', async function saveFunc(next) {
  if (!this.isModified('password')) {
    return next()
  }
  this.password = bcrypt.hashSync(this.password)
  return next()
})

userSchema.method({
  passwordMatches(password) {
    return bcrypt.compareSync(password, this.password)
  }
})

userSchema.statics = {
  async findAndValidateUser({ login, password }) {
    if (!login) {
      throw new Error('No Login')
    }
    if (!password) {
      throw new Error('No Password')
    }
    const user = await this.findOne({ login }).exec()
    if (!user) {
      throw new Error('No User')
    }

    const isPasswordOk = await user.passwordMatches(password)

    if (!isPasswordOk) {
      throw new Error('Password Incorrect')
    }

    return user
  }
}

export default mongoose.model('users', userSchema)
