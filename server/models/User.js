const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;  // 10자리인 salt를 생성하여 암호화에 이용
const jwt = require('jsonwebtoken');
const { decode } = require('jsonwebtoken');

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
    // 비밀번호 암호화가 아닌 다른 정보를 변경한다면
    } else {
        next();
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    //
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;
    //jsonwebtoken을 이용해서 token 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken');

    // user._id + 'secretToken' = token;
    user.token = token;
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    // 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded){
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id" : decoded, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null, user)
        })
    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }