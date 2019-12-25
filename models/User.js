const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  avatar: String,
}, {timestamp: true}  )


mongoose.model('User', userSchema)