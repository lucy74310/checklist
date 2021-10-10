const express = require("express");
const app = express();
const port = 3001;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// application/x-www-form-urlencoded 타입으로 된것을 가져올 수 있게 해주는
app.use(bodyParser.urlencoded({ extended: true }));

// application/json 타입 분석해서 가져올수 있게
app.use(bodyParser.json());

// token 정보 쿠키에 저장하기 위해
app.use(cookieParser());

const config = require("./config/key");

/**
 * GET : 가져오는거
 * PUT : 변경
 * POST : 새로생성하는거
 * DELETE : 삭제
 */

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongo DB Connected Successfully!"))
  .catch((err) => console.log(err));

const usersRoutes = require("./routes/User");
app.use("/api/user", usersRoutes);

const listsRoutes = require("./routes/List");
app.use("/api/list", listsRoutes);
