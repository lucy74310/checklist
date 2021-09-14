const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const config = require('../config/key')

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

//저장하기 전에
userSchema.pre('save', function(next) {
    //비밀번호를 암호화 시킨다.

    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) return next(err)
    
    
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err)
                user.password = hash // plain password를 hash 된 password로 변경 
    
                next()
            })
    
        })
    } else {
        next()
    }

})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    // plainPassword 1234
    // hash $2b$10$TX.MfNVYZeOYppLVg2EI9urmDWW.Ckt9SaQuwg.3WHWvVWiuRZBta
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch) // isMatch는 이때 true
    })
}


userSchema.methods.generateToken = function(cb) {
    var user = this;
    // json web token 을 이용해서 token을 생성하기 

    var token = jwt.sign(user._id.toHexString(), config.encodeKEY) //user._id + encodeKEY => token && 나중에 token에 encodeKEY을 넣으면 user._id가 나옴 


    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })

}



/**
 * Auth 기능 왜필요한가. 
 * 로그인 되어 있는 유저만 이용가능 
 * 관리자 유저만 이용가능
 * 
 * 1. Cookie에 저장된 token을 가져와서 복호화 -> user._id가 나옴
 * 2. 
 *  
 */
userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    jwt.verify(token, config.encodeKEY, function(err, decoded) {
        // 유저아이디를 이용해서 유저를 찾은 다음에 
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인 
        user.findOne({
            "_id": decoded,
            "token": token
        }, function(err, user) {
            if (err) return cb(err)
            cb(null, user)
        })
    })

}



const User = mongoose.model('User', userSchema)

module.exports = { User }