const express = require("express");

const userRoute = express.Router();

const { User } = require("../models");
const { auth } = require("../middleware/auth");

/** 회원가입 **/
userRoute.post("/", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name)
      return res
        .status(400)
        .send({ err: "email, password, name are required" });
    const user = new User({ email, password, name });
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).send({ err: "This email already exist." });
    }
    await user.save();
    return res.send({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

/**로그인**/
userRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. DB안에서 요청된 EMAIL 찾기
    // return res.status(500).send({ err: "test중" });

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ err: "email doesn't exist" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ err: "password is incorrect" });
    }

    user = await user.generateToken();
    if (!user) {
      return res.status(400).json({ err: "failed to generate token" });
    }
    return res.cookie("x_auth", user.token).status(200).json({
      login: true,
    });

    // (err, user) => {
    //   if (!user) {
    //     return res.json({
    //       loginSuccess: false,
    //       message: "제공된 이메일에 해당하는 유저가 없습니다.",
    //     });
    //   }

    // // 2. 요청된 EMAIL이 DB에 있다면, 비밀번호가 맞는 비밀번호 인지 확인

    // user.comparePassword(req.body.password, (err, isMatch) => {
    //   if (!isMatch)
    //     return res.json({
    //       loginSuccess: false,
    //       message: "비밀번호가 틀렸습니다.",
    //     });
    // });

    // // 3. 비밀번호도 맞다면, 토큰을 생성하기
    // user.generateToken((err, user) => {
    //   if (err) return res.status(400).send(err);
    //   console.log(user);
    //   // 토큰을 저장한다. 어디에 ? 쿠키, 로컬스토리지, 세션 ... 어디가 안전한가.... 논란이 많음... 각기 장단점이 있다.
    //   // 쿠키에 저장.  install cookie-parser --save
    //   res.cookie("x_auth", user.token).status(200).json({
    //     loginSuccess: true,
    //     userId: user._id,
    //   });
    // });
    // }
    // );
    // return res.send({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

/**인증(Auth)**/
/**
* auth 라는 middleware 사용. 
* req를 받은 다음에 callback 하기전에 중간에서 뭘 해줌.

role 1 어드민 2 특정부서어드민
role 0 일반유저 role 0아님 관리자 
 */
userRoute.get("/auth", auth, async (req, res) => {
  // 여기까지 middleware를 통과해 왔다는 얘기는 authentication이 True라는 뜻
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : ture,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

// Logout
userRoute.patch("/", auth, async (req, res) => {
  // const user = new User(req.user)
  // console.log(user)
  // user.token = null

  // user.save((err, userInfo) => {
  //     if (err) return res.json({ success: false, err })
  //     return res.clearCookie('x_auth').status(200).json({ success: true })
  // })

  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ err });
    return res.clearCookie("x_auth").status(200).send({
      logout: true,
    });
  });
});

module.exports = {
  userRoute,
};
