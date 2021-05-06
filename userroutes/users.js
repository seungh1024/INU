const express = require('express');
const AppUser = require('../models/appuser');
//const Comment = require('../models/comment');

const router = express.Router();
//GET /users, POST /users 주소로 요청이 들어올 때의 라우터
router.route('/')
 .get(async (req, res, next) => {
    try {
      const appusers = await AppUser.findAll();
      res.json(appusers);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .post(async (req, res, next) => {
    console.log(req.body);
    try {
      const user = await AppUser.create({
        id: req.body.id,
        pass: req.body.pass,

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

router.delete('/:id/delete',async(req,res,next)=>{
  try{
    const appusers = await AppUser.destroy({
      where:{id:req.params.id}
    });
    res.json(appusers);
  }catch(err){
    console.error(err);
    next(err);
  }
});


router.get('/:id', async (req, res, next) => {
  try {
    const appusers = await AppUser.findOne({
        where:{ id: req.params.id },
      
    });
    res.json(users);
    
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;