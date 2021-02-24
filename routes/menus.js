const express = require('express');
const Menu = require('../models/menu');

const router = express.Router();

router.route('/')// stores/로 get방식일 때
 .get(async (req, res, next) => {
    try {
      const menus = await Menu.findAll();
      res.json(menus);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .post(async (req, res, next) => {//post방식일 때
    console.log(req.body);
    try {
      const store = await Menu.create({//사용자 추가를 하는 것
        store_code: req.body.store_code,
        menu_name: req.body.menu_name,
        price: req.body.price,
        sold: req.body.sold,

      });
    //post 요청의 body(html 파일 보면 있음)의 값을 파싱(가져올 때) 사용함
    //.body.name 이렇게 이름이 붙은 이유는 <body>에 있는 값을 
    //sequelize.js에서 받아서 name,age,married로 user.js로 넘겨줬기 때문
      console.log(store);
      res.status(201).json(store);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router.get('/:store_code',async(req,res,next)=>{
    console.log(req.body);
    try{
        const menus =await Menu.findAll({
            where:{store_code:req.params.store_code}
        });
        res.json(menus);
    }catch(err){
        console.error(err);
        next(err);
    }
});

router.delete('/:store_code/delete',async(req,res,next)=>{
    try{
        const menu = await Menu.destroy({
          where:{store_code:req.params.store_code}
        });
        res.json(menu);
      }catch(err){
        console.error(err);
        next(err);
      }
});


module.exports = router;