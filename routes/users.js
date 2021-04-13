const express = require('express');
const User = require('../models/user');
//const Comment = require('../models/comment');

const router = express.Router();
//GET /users, POST /users 주소로 요청이 들어올 때의 라우터
//요청 방식을 바꾸기로함
//post 방식을 이용하고 안의 데이터를 구분하여 받기로 해서 수정함
router.post('/',async(req,res,next)=>{
  if(req.body.Method=='Login'){
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

})


router.delete('/:id/delete',async(req,res,next)=>{
  try{
    const users = await User.destroy({
      where:{id:req.params.id}
    });
    res.json(users);
  }catch(err){
    console.error(err);
    next(err);
  }
});



module.exports = router;