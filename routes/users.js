const express = require('express');
const User = require('../models/user');
//const Comment = require('../models/comment');

const router = express.Router();
//GET /users, POST /users 주소로 요청이 들어올 때의 라우터
router.route('/')
 .get(async (req, res, next) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const user = await User.create({
        name: req.body.name,
        pass: req.body.pass,
        married: req.body.married,
      });
    //post 요청의 body(html 파일 보면 있음)의 값을 파싱(가져올 때) 사용함
    //.body.name 이렇게 이름이 붙은 이유는 <body>에 있는 값을 
    //sequelize.js에서 받아서 name,age,married로 user.js로 넘겨줬기 때문
      console.log(user);
      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router.get('/:name', async (req, res, next) => {
  try {
    const comments = await User.findOne({
        where: { name: req.params.name },
      
    });
    //findAll메서드에 옵션이 추가됨
    //include 옵션에서 model속성에는 User모델을, where속성에는 :id로 받은 아이디 값을 넣음
    //include model:User를 했으니 댓글을 가져오면서 User의 정보도 들고오는 것
    //:id는 라우트 매개변수(6.3절에 있음)
    //req.params.id로 값을 가져올 수 있음
    //req.params는 get request의 URL에서 :(콜론)뒤에 오는 파라미터를 가져올 때(파싱) 사용
    //단 실제 URL에서 콜론이 입력되지는 않음.
    //만약 GET/users/1/comments라면 사용자 아이디가 1인 댓글을 불러옴
    console.log(comments);
    res.json(comments);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;