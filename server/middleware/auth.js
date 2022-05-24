const { User } = require("../models/User");

let auth = (req, res, next) => {
    // 인증 처리를 하는 곳
    // 인증 처리
    // 클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth;

    // 토큰을 복호화 한 후 유저를 찾는다.
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        // 유저가 없으면
        if(!user) return res.json({ isAuth: false, error: ture})

        // 유저가 있으면
        req.token = token;
        req.user = user;
        // 검증이 끝났으면 next()로 원래 절차를 계속 진행
        next();
    })
}

module.exports = { auth };