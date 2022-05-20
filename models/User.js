const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;  // 10자리인 salt를 생성하여 암호화에 이용

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50

    },

    email: {
        type: String,
        trim: true, // 공백 없애줌
        unique: 1
    },

    password: {
        type: String,
        minlength: 5
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
})

// userSchema를 저장하기 전 암호화. 암호화를 마친 후 next()해서 user.save로 보내줌
userSchema.pre('save', function (next) {
    var user = this;

    // 암호를 변경할 때만 암호화 시킨다
    if (user.isModified('password')) {
        // 비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next();
            })
        })
    }
})

const User = mongoose.model('User', userSchema)

module.exports = { User }