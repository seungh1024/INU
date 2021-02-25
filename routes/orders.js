const express = require('express');
const Order = require('../models/order');

const router = express.Router();

router.route('/')// orders/로 get방식일 때
 .get(async (req, res, next) => {
    try {
      const orders = await Order.findAll();
      res.json(orders);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .post(async (req, res, next) => {//post방식일 때
    console.log(req.body);
    const neworder = await Order.findOne({
        where:{store_code:req.body.store_code,menu_name:req.body.menu_name,table_num:req.body.table_num}
    })
    if(!neworder){
        try {
            const orders = await Order.create({//사용자 추가를 하는 것
              store_code: req.body.store_code,
              menu_name: req.body.menu_name,
              menu_cnt: req.body.menu_cnt,
              table_num: req.body.table_num,
              cook:req.body.cook,
      
            });
          //post 요청의 body(html 파일 보면 있음)의 값을 파싱(가져올 때) 사용함
          //.body.name 이렇게 이름이 붙은 이유는 <body>에 있는 값을 
          //sequelize.js에서 받아서 name,age,married로 user.js로 넘겨줬기 때문
            console.log(orders);
            res.status(201).json(orders);
          } catch (err) {
            console.error(err);
            next(err);
          }
    }else{
        try{
            const num1 = parseInt(neworder.menu_cnt);
            const num2 = parseInt(req.body.menu_cnt);
            const num = num1+num2;
            console.log(neworder.menu_cnt);
            console.log(parseInt(req.body.menu_cnt));
            console.log(num);
            const result = await Order.update({
                menu_cnt:num,
                
            },{
                where:{store_code:req.body.store_code ,table_num:req.body.table_num, menu_name:req.body.menu_name },
            });
            res.json(result);

        }catch(err){
            console.error(err);
            next(err);
        }
    }
    
  });

router.get('/:store_code',async(req,res,next)=>{
    console.log(req.body);
    try{
        const orders =await Order.findAll({
            where:{store_code:req.params.store_code}
        });
        res.json(orders);
    }catch(err){
        console.error(err);
        next(err);
    }
});

router.delete('/:store_code/:table_num/:menu_name/delete',async(req,res,next)=>{
    try{
        const orders = await Order.destroy({
          where:{store_code:req.params.store_code, table_num:req.params.table_num,menu_name:req.params.menu_name}
        });
        res.json(orders);
      }catch(err){
        console.error(err);
        next(err);
      }
});

router.patch('/:store_code/:table_num/:menu_name',async(req,res,next)=>{//주문 조리여부 업데이트
    console.log(req.body.cook);
    try{
        const result = await Order.update({
            cook:req.body.cook,
            
        },{
            where:{store_code:req.params.store_code ,table_num:req.params.table_num,menu_name:req.params.menu_name },
        });
        res.json(result);
    }catch(err){
        console.error(err);
        next(err);
    }
});

router.patch('/:store_code/:table_num/:menu_name/change',async(req,res,next)=>{//주문 조리여부 업데이트
    console.log(req.body.menu_cnt);
    try{
        const result = await Order.update({
            menu_cnt:req.body.menu_cnt,
            
        },{
            where:{store_code:req.params.store_code ,table_num:req.params.table_num,menu_name:req.params.menu_name },
        });
        res.json(result);
    }catch(err){
        console.error(err);
        next(err);
    }
});


module.exports = router;