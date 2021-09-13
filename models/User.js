const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    name: {
        type: String,
        matlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 4
    },
    lastname: {
         type: String,
         maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }

//   writer: {
//     type: Schema.Types.ObjectId,
//     ref: 'User'
//   },
  
})


const User = mongoose.model('User', userSchema)

module.exports = { User }