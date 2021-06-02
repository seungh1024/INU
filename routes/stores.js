const express = require('express');
const User = require('../models/user');
const Store = require('../models/store');
const  Menu  = require('../models/menu');

const router = express.Router();

router.route('/')// stores/로 get방식일 때
 .get(async (req, res, next) => {
    try {
      const stores = await Store.findAll({
      });
      res.json(stores);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });
  

//기존의 라우팅 방식이 안드로이드 측에서 느리다는 단점이 생겨 서버 측에서 post 방식으로
//Method에 어떤 데이터가 담겨 오느냐에 따라서 다르게 처리해주기로 함 
//기존의 코드를 삭제하고 새로 짜게 됨

router.post('/',async(req,res,next)=>{
  if(req.body.Method == "each"){
    try{
      const store = await Store.findOne({
        attributes:[
          "Status",
          "Table_cnt",
        ],
        where:{Store_code:req.body.Store_code},
      })
      console.log(store);
      res.json(store);
    }catch(err){
      console.error(err);
      next(err);
    }
  }

  else if(req.body.Method == "all"){
    try{
      if (req.body.Category == "모든 가게") {
        const store = await Store.findAll({
          attributes:[
            "Store_code",
            "Nick",
            "Category",
            "Latitude",
            "Longitude"
          ],
          where:{
            Status:1,
          }
        })
        res.json(store);
      }
      else {
        const store = await Store.findAll({
          attributes:[
            "Store_code",
            "Nick",
            "Category",
            "Latitude",
            "Longitude"
          ],
          where:{
            Status:1,
            Category:req.body.Category,
          }
        })
        res.json(store);
      }
      
    }catch(err){
      console.error(err);
      next(err);
    }
  }
})

router.patch('/',async(req,res,next)=>{
  if(req.body.Method == "switch"){
    try{
      var store = await Store.update(
        {
          Status:req.body.Status,
        },
        {
          where:{Store_code:req.body.Store_code},
        }
      )
      console.log(store);
      res.status(200).send();
    }catch(err){
      console.error(err);
      next(err);
    }
  }
  
})

  module.exports = router;