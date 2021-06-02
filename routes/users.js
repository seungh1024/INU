const express = require('express');
const User = require('../models/user');

const router = express.Router();
//GET /users, POST /users 주소로 요청이 들어올 때의 라우터
//요청 방식을 바꾸기로함
//post 방식을 이용하고 안의 데이터를 구분하여 받기로 해서 수정함

//로그인
router.post('/',async(req,res,next)=>{
  console.log(req.body);

  if(req.body.Method=='Login') {
    try{
      const user = await User.findOne({
        attributes:["Nick"],
        where:{
          ID:req.body.ID,
          PW:req.body.PW,
          Who:req.body.Who,
        }
      })
      res.status(200).json(user);
    }catch(err){
      console.error(err);
      next(err);
    }
  }

  //회원가입
  else if(req.body.Method=='Regist') {
    try{
      var id = await User.findOne({
        where:{
          ID:req.body.ID,
        }
      })
      if (id != null) { res.send("ID 중복"); }
      else {
        var nick = await User.findOne({
          where:{
            Nick:req.body.Nick,
          }
        })
        if (nick != null) { res.send("Nickname 중복"); }
        else {
          const user = await User.create({
            ID : req.body.ID,
            PW : req.body.PW,
            Who : req.body.Who,
            Nick : req.body.Nick,
          });
          console.log(user);
          res.send("Done");
        }
      }
    }catch(err){
      console.error(err);
      next(err);
    }
  }
})


module.exports = router;