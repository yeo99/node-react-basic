const express = require('express')
const app = express()
const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require("./models/User");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());

// mongodb+srv://timek70:<password>@boilerplate.jifwa.mongodb.net/?retryWrites=true&w=majority
const mongoose = require('mongoose');
const { json } = require('express/lib/response');
const req = require('express/lib/request');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true
}).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello World!'));

app.post('api/users/register', (req, res) => {
    // 회원 가입 할 때 필요한 정보들을 client에서 가져오면 DB에 넣어줌

    const user = new User(req.body)

    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err })
        // 성공하면(200) success true가 뜨도록
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/api/users/login', (req, res) => {
    // 요청된 이메일이 데이터베이스에 있는지 찾는다
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            // true로 전달되어야할 isMatch가 false라면
            if (!isMatch) {
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })
            }
            // 비밀번호까지 맞다면 토큰을 생성
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);

                // 토큰을 쿠키나 로컬스토리지에 저장
                res.cookie("x_auth", user.token)
                .status(200)
                .json({ loginSuccess: true, userId: user._id })
            })
        })

    })

})

// auth 미들웨어 추가. endpoint의 request를 받은 다음 callback하기전에 중간에서 동작함. /middleware/auth.js에서 처리
app.get('/api/users/auth', auth, (req, res) => {
    // 여기 까지 미들웨어를 통과해 왔다는 것은 Authentication이 true
    req.status(200).json({
        // 미들웨어에서 auth성공 시 req에 user를 넣어서 보냈으므로 사용 가능
        _id: req.user.id,
        // role: 0 => 일반 유저, role: 1 => 관리자
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

// 로그아웃 기능. login된 상태에서 행위이므로 auth미들웨어도 넣어줌
// 로그아웃 Route -> 로그아웃 하려는 유저를 DB에서 찾아서 -> 해당 유저의 토큰을 지워줌
app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user._id}, {token: ""}, (err, user) => {
        if(err) return res.json({succes: false, err})
        return res.status(200).send({
            succes: true
        })
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));