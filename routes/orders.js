const express = require('express');
const Order = require('../models/order');
const Sequelize = require('sequelize');

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
    // const neworder = await Order.findOne({
    //     where:{store_code:req.body.store_code, menu_name:req.body.menu_name, table_num:req.body.table_num}
    //     //사업자번호,메뉴명,테이블번호를 이용하여 해당 가게의 테이블의 어떤메뉴를 추가하는지 확인
    // })

    // //console.log(new Date());
    // var nowdate = new Date();
    // nowdate = nowdate.toLocaleString();
    // //toLocalString()을 하면 2021.3.4. 오후 몇시 이렇게 나옴
    // console.log(nowdate);
    var newdate = new Date();
    var year = newdate.getFullYear();
    var month = newdate.getMonth()+1;
    var day = newdate.getDate();
    var hour = newdate.getHours() + 9;
    if(hour < 0){
        hour = hour +24;
    }
    if(hour >24){
        hour = hour - 24;
    }
    var min = newdate.getMinutes();
    var sec = newdate.getSeconds();
    var now =year+'-'+month+'-'+day+' '+hour+':'+min+':'+sec;
    now = now.toString();
    try {
        const orders = await Order.create({//사용자 추가를 하는 것
          store_code: req.body.store_code,
          menu_name: req.body.menu_name,
          menu_cnt: req.body.menu_cnt,
          table_num: req.body.table_num,
          cook:req.body.cook,
          pay:req.body.pay,
          date:now,
  
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


    //else{
    //     //같은 테이블의 같은 메뉴가 추가됐을 때 메뉴개수만 업데이트 시켜줌
    //     try{
    //         const num1 = parseInt(neworder.menu_cnt);
    //         const num2 = parseInt(req.body.menu_cnt);
    //         const num = num1+num2;
    //         const result = await Order.update({
    //             menu_cnt:num,
                
    //         },{
    //             where:{store_code:req.body.store_code ,table_num:req.body.table_num, menu_name:req.body.menu_name },
    //         });e
    //         res.json(result);

    //     }catch(err){
    //         console.error(err);
    //         next(err);
    //     }
    // }
    
  });

router.get('/:store_code',async(req,res,next)=>{
    //해당가게의 주문들을 모두 가져옴
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

//주문 조리여부 버튼으로 동작 하는 업데이트
router.patch('/:store_code/:table_num/:menu_name/:date/cook',async(req,res,next)=>{
    //기존 cook값이 0이면 1, 1이면 0으로 바꿔줌
    //console.log(req.body.cook);
    var cnt = 0;
    try{
        var order = await Order.findOne({
            where:{store_code:req.params.store_code ,table_num:req.params.table_num,
                menu_name:req.params.menu_name ,date:req.params.date}
        })
    }catch(err){
        console.error(err);
        next(err);
    }

    if(order.cook == 0){
        cnt =1;
    }else{
        cnt = 0;
    };
    try{
        const result = await Order.update({
            cook:cnt,
            
        },{
            where:{store_code:req.params.store_code ,table_num:req.params.table_num,
                menu_name:req.params.menu_name ,date:req.params.date},
        });
        res.json(result);
    }catch(err){
        console.error(err);
        next(err);
    }
});

// router.patch('/:store_code/:table_num/:menu_name/change',async(req,res,next)=>{
//     //폼과 연동시에 사용됨
//     //메뉴 카운트를 하기위한 것
//     console.log(req.body.menu_cnt);
//     try{
//         const result = await Order.update({
//             menu_cnt:req.body.menu_cnt,
            
//         },{
//             where:{store_code:req.params.store_code ,table_num:req.params.table_num,menu_name:req.params.menu_name },
//         });
//         res.json(result);
//     }catch(err){
//         console.error(err);
//         next(err);
//     }
// });

//결제여부변동을 위한 update
//해당 결제여부 변동은 해당 가게의 해당 테이블의 해당 메뉴종류 하나만 결제여부가 나옴
router.patch('/:store_code/:table_num/:menu_name/:date/pay',async(req,res,next)=>{
    try{
        var paycnt = await Order.findOne({
            where:{store_code:req.params.store_code, table_num:req.params.table_num, 
                menu_name:req.params.menu_name ,date:req.params.date,},
        })
    }catch(err){
        console.error(err);
        next(err);
    };

    if(paycnt.pay == 0 && paycnt.cook == 1){
        //조리가 완료되고 결제까지 완료했으면 삭제시킴
        //해당 라우터는 pay값이 변동 될 때 실행이 되는 것
        //pay 값은 default로 0이므로 0일 때 이 요청이 들어오면 1로 만들어 달라는 것
        //1이되는 즉시 지우면 되므로 0일때 요청이 들어왔으니 지우면 됨
        try{
            const result = await Order.destroy({
                where:{store_code:req.params.store_code, table_num:req.params.table_num, 
                    menu_name:req.params.menu_name, date:req.params.date,},
            })
            res.json(result);
        }catch(err){
            console.error(err);
            next(err);
        }
    }else{//pay값이 1일 땐 그대로 계속 값을 바꿔주면 됨
        var cnt = 0;
        if(paycnt.pay == 0 ){
            cnt = 1;
        }else{
            cnt = 0;
        }
        console.log(cnt);
        try{
            const result = await Order.update({
                pay:cnt,
                
            },{
                where:{store_code:req.params.store_code ,table_num:req.params.table_num,
                    menu_name:req.params.menu_name ,date:req.params.date,},
            });
            res.json(result);
        }catch(err){
            console.error(err);
            next(err);
        }
    }

});

//전부다 pay를 1로 바꿔주는 라우터
router.patch('/:store_code/:table_num/payall',async(req,res,next)=>{
    //가게코드와 해당 테이블 번호의 모든 pay값을 1로 변환
    var cnt = 1
    try{
        var result = await Order.update({
            pay:1,
            
        },{
            where:{store_code:req.params.store_code ,table_num:req.params.table_num },
        });
        res.json(result);
    }catch(err){
        console.error(err);
        next(err);
    }

})


module.exports = router;