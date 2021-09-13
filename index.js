const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const {User} = require('./models/User')

// application/x-www-form-urlencoded 타입으로 된것을 가져올 수 있게 해주는 
app.use(bodyParser.urlencoded({extended: true}))

// application/json 타입 분석해서 가져올수 있게 
app.use(bodyParser.json())

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


app.post('/register', (req, res) => {
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





