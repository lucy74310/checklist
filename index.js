const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const {User} = require('./models/User')
const {auth} = require('./middleware/auth')
// application/x-www-form-urlencoded 타입으로 된것을 가져올 수 있게 해주는 
app.use(bodyParser.urlencoded({extended: true}))

// application/json 타입 분석해서 가져올수 있게 
app.use(bodyParser.json())

// token 정보 쿠키에 저장하기 위해
app.use(cookieParser())


const config = require('./config/key')

/**
 * GET : 가져오는거
 * PUT : 변경
 * POST : 새로생성하는거 
 * DELETE : 삭제
 */
app.get('/', (req, res) => {
    res.send('Hello World!~~안녕하세요~ggg')
})

app.get('/test', (req, res) => {
    res.send('Hello World!~~안녕하세요~')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})



const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
    }).then(() => console.log('Mongo DB Connected Successfully!'))
    .catch(err => console.log(err));



/** 회원가입 **/
app.post('/api/users/register', (req, res) => {
    //회원가입할때 필요한 정보들을 client 에서 가져오면 그것들을 db에 넣어준다.
    // {
    //     id: "hell",
    //     password: "123"
    // }

    const user = new User(req.body)
    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true
        })
    })

})



/**로그인**/
app.post('/api/users/login', (req, res) => {
    // 1. DB안에서 요청된 EMAIL 찾기 
    User.findOne({
        email: req.body.email
    }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        // 2. 요청된 EMAIL이 DB에 있다면, 비밀번호가 맞는 비밀번호 인지 확인

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
            return res.json({
                loginSuccess: false,
                message: "비밀번호가 틀렸습니다."
            })
        })

        // 3. 비밀번호도 맞다면, 토큰을 생성하기
        user.generateToken((err, user) => {
            if (err) return res.status(400).send(err)
            
            // 토큰을 저장한다. 어디에 ? 쿠키, 로컬스토리지, 세션 ... 어디가 안전한가.... 논란이 많음... 각기 장단점이 있다.
            // 쿠키에 저장.  install cookie-parser --save
            res.cookie("x_auth", user.token)
            .status(200)
            .json({
                loginSuccess: true,
                userId: user._id
            })
        })
    })
})


/**인증(Auth)**/
/**
* auth 라는 middleware 사용. 
* req를 받은 다음에 callback 하기전에 중간에서 뭘 해줌.

role 1 어드민 2 특정부서어드민
role 0 일반유저 role 0아님 관리자 
 */
app.get('/api/users/auth', auth, (req, res) => {
    // 여기까지 middleware를 통과해 왔다는 얘기는 authentication이 True라는 뜻 
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : ture,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image

    })
})



console.log(process.env.NODE_ENV)
app.get('/api/users/logout', auth, (req, res) => {
    const user = new User(req.body)
    user.token = null

    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.clearCookie('x_auth').status(200).json({ success: true })
    })

    

})