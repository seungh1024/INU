const express = require('express');
const Order = require('../models/order');
const Menu = require('../models/menu');
const Analysis = require('../models/analysis');
const Sequelize = require('sequelize');

const router = express.Router();

router.route('/')// orders/로 get방식일 때
 .get(async (req, res, next) => {
    try {
      var orders = await Order.findAll({
        //   include:{
        //       model: Menu,
        //   },
        //   where:{store_code:1},
      });
      //console.log(orders.store_code);
      //하나만 찾을 땐 orders 이용
      //console.log(orders.length);
      //배열 형태일 땐 orders[0]이런식으로 이용하고 길이는 orders.lengtrh
    //   console.log(orders[0].Menu.price);
    //조인한 것으로 부터 데이터 추출하는 것을 확인함
      //console.log(orders[0].menu_name);
      //데이터베이스가 배열 형태로 저장된 것을 확인함
      //console.log(orders.length);
      //길이 추출 확인함
      //if(orders[0].time < orders[1].time)console.log('0이 더 빨리 생성 됨');
      //날짜끼리 비교 가능 확인
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
    var realTime = new Date(new Date().setHours(new Date().getHours()+9));
    var newdate = new Date();
    console.log(newdate);
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
    var now =year+'-'+month+'-'+day+'@'+hour+':'+min+':'+sec;
    console.log(hour);
    now = now.toString();
    // if(year.toString() > month.toString()){
    //     console.log('#################');
    // }
    try {
        const orders = await Order.create({//사용자 추가를 하는 것
          store_code: req.body.store_code,
          menu_name: req.body.menu_name,
          menu_cnt: req.body.menu_cnt,
          table_num: req.body.table_num,
          cook:req.body.cook,
          pay:req.body.pay,
          date:now,
          time:realTime,  
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

router.delete('/:store_code/:table_num/:menu_name/:date/delete',async(req,res,next)=>{
    try{
        const orders = await Order.destroy({
          where:{store_code:req.params.store_code, table_num:req.params.table_num,
            menu_name:req.params.menu_name,date:req.params.date,}
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
        payone(req.params.store_code,req.params.table_num,
            req.params.menu_name,req.params.date);

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
    //0이면 1로, 1이면 0으로 pay값을 바꿔줌
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
        //updateAnalysis(req.params.store_code, req.params.table_num);
        payone(req.params.store_code,req.params.table_num,
            req.params.menu_name,req.params.date);

        res.json(result);
    }catch(err){
        console.error(err);
        next(err);
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
        //updateAnalysis(req.params.store_code, req.params.table_num);
        deletepay(req.params.store_code, req.params.table_num);
        //해당 가게의 해당 테이블에서 cook 이 1이고, pay 가 1인 모든 행을 지운다
        res.json(result);
    }catch(err){
        console.error(err);
        next(err);
    }

})

//부분결제, 하나씩 결제 시 사용하는 함수로 analysis로 옮겨줌
async function updateOne(store_code,table_num,menu_name,date){
    console.log(store_code);
    console.log(table_num);
    console.log(menu_name);
    console.log(date);
    try{
        var orders = await Order.findOne({
            include:{
                model: Menu,
                where:{store_code:store_code}
            },

            where:{store_code:store_code, table_num:table_num, 
                menu_name:menu_name, date:date, cook:1, pay:1}

        })
        console.log(orders);
    }catch(err){
        console.error(err);
        return err;
    }
    // console.log('################');
    // console.log(orders.table_num);
    if(orders){
        if(orders.table_num > 0){
            orders.table_num = 1;
        }
        try{
            const analysis = await Analysis.create({
                store_code:store_code,
                menu_name: orders.menu_name,
                price: orders.Menu.price,
                menu_cnt:orders.menu_cnt,
                inout:orders.table_num,
                date:orders.date,
                time:orders.time,
    
            })
        }catch(err){
            console.error(err);
            return err;
        }
    }
    
}



//결제 시 결제 한 것을 analysis로 옮겨주는 함수, payall시에 사용
async function updateAnalysis(store_code,table_num){
    var cnt =0;
    try{
        var orders = await Order.findAll({
            include:{
                model: Menu,
                where:{store_code:store_code}
            },

            where:{store_code:store_code, table_num:table_num, cook:1, pay:1}

        })
        //console.log(orders[0]);
    }catch(err){
        console.error(err);
        return err;
    }
    
    while(cnt < orders.length){
        if(orders[cnt].table_num > 0){
            orders[cnt].table_num = 1;
        }
        try{
            const analysis = await Analysis.create({
                store_code:store_code,
                menu_name: orders[cnt].menu_name,
                price: orders[cnt].Menu.price,
                menu_cnt:orders[cnt].menu_cnt,
                inout:orders[cnt].table_num,
                date:orders[cnt].date,
                time:orders[cnt].time,

            })
        }catch(err){
            console.error(err);
            return err;
        }
        cnt = cnt +1;
    }
}

//조리가 다 됐고, 결제까지 완료한 모든 것들을 지우기 위한 함수다.
async function deletepay(store_code,table_num){
    updateAnalysis(store_code,table_num);
    try{
        var payall = await Order.destroy({
            where:{store_code:store_code,table_num:table_num, cook:1,pay:1}
        })
    }catch(err){
        console.error(err);
        next(err);
    }
}

//조리가 다 됐고, 결제까지 완료한 것 중 하나만 지우기 위한 것이다.
//부분결제 등을 위해서 만들어 놓은 것
async function payone(store_code,table_num,menu_name,date){
    
    try{
        updateOne(store_code,table_num,menu_name,date);
        var payone = await Order.destroy({
            where:{store_code:store_code, table_num:table_num ,
            menu_name:menu_name, date:date,cook:1,pay:1 }
        })
    }catch(err){
        console.error(err);
        next(err);
    }
}





module.exports = router;