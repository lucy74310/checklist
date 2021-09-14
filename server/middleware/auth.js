const { User } = require('../models/User')

let auth = (req, res, next) => {

    // 인증처리를 하는 곳

    // 1. 클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth;
    
    // 2. 토큰을 복호화하여 user._id를 찾는다.
    User.findByToken(token, (err, user) => {
        if (err) return err;
        if (!user) return res.json({
            isAuth: false,
            error: true
        })

        req.token = token;
        req.user = user;
        next() // next가 없으면 middleware에 갇혀버린다.
    })

    // 3. user가 있으면 인증 OKAY
    // 4. USER가 없으면 인증 FAIL
}

module.exports = { auth }