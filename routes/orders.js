const express = require('express');
const Order = require('../models/order');
const Menu = require('../models/menu');
const Analysis = require('../models/analysis');
const Sequelize = require('sequelize');
const Store= require('../models/store');

const router = express.Router();

// router.route('/')// orders/로 get방식일 때
//  .get(async (req, res, next) => {
//     try {
//       var orders = await Order.findAll({
//         //   include:{
//         //       model: Menu,
//         //   },
//         //   where:{store_code:1},
//       });
//       //console.log(orders.store_code);
//       //하나만 찾을 땐 orders 이용
//       //console.log(orders.length);
//       //배열 형태일 땐 orders[0]이런식으로 이용하고 길이는 orders.lengtrh
//     //   console.log(orders[0].Menu.price);
//     //조인한 것으로 부터 데이터 추출하는 것을 확인함
//       //console.log(orders[0].menu_name);
//       //데이터베이스가 배열 형태로 저장된 것을 확인함
//       //console.log(orders.length);
//       //길이 추출 확인함
//       //if(orders[0].time < orders[1].time)console.log('0이 더 빨리 생성 됨');
//       //날짜끼리 비교 가능 확인
//       res.json(orders);
//     } catch (err) {
//       console.error(err);
//       next(err);
//     }
//   })
//   .post(async (req, res, next) => {//post방식일 때
//     console.log(req.body);
//     // const neworder = await Order.findOne({
//     //     where:{store_code:req.body.store_code, menu_name:req.body.menu_name, table_num:req.body.table_num}
//     //     //사업자번호,메뉴명,테이블번호를 이용하여 해당 가게의 테이블의 어떤메뉴를 추가하는지 확인
//     // })

//     // //console.log(new Date());
//     // var nowdate = new Date();
//     // nowdate = nowdate.toLocaleString();
//     // //toLocalString()을 하면 2021.3.4. 오후 몇시 이렇게 나옴
//     // console.log(nowdate);
//     var realTime = new Date(new Date().setHours(new Date().getHours()+9));
//     var newdate = new Date();
//     console.log(newdate);
//     var year = newdate.getFullYear();
//     var month = newdate.getMonth()+1;
//     var day = newdate.getDate();
//     var hour = newdate.getHours() + 9;
//     if(hour < 0){
//         hour = hour +24;
//     }
//     if(hour >24){
//         hour = hour - 24;
//     }
//     var min = newdate.getMinutes();
//     var sec = newdate.getSeconds();
//     var now =year+'-'+month+'-'+day+'@'+hour+':'+min+':'+sec;
//     console.log(hour);
//     now = now.toString();
//     // if(year.toString() > month.toString()){
//     //     console.log('#################');
//     // }
//     try {
//         const orders = await Order.create({//사용자 추가를 하는 것
//           store_code: req.body.store_code,
//           menu_name: req.body.menu_name,
//           menu_cnt: req.body.menu_cnt,
//           table_num: req.body.table_num,
//           cook:req.body.cook,
//           pay:req.body.pay,
//           date:now,
//           time:realTime,  
//         });
        
//       //post 요청의 body(html 파일 보면 있음)의 값을 파싱(가져올 때) 사용함
//       //.body.name 이렇게 이름이 붙은 이유는 <body>에 있는 값을 
//       //sequelize.js에서 받아서 name,age,married로 user.js로 넘겨줬기 때문
//         console.log(orders);
//         res.status(201).json(orders);
//       } catch (err) {
//         console.error(err);
//         next(err);
//       }
    
//   });


//db를 개편함
//post요청으로 대부분 처리하도록 바꾸고 메소드를 바디에 넣어서 쏴줌
//해당하는 값들마다 서버에서 따로 처리함
router.post('/',async(req,res,next)=>{
    //새로운 주문을 등록해줌
    if(req.body.Method == "Insert"){
        try{
            const orders = await Order.create({
                Store_code:req.body.Store_code,
                Menu_name:req.body.Menu_name,
                Cnt:req.body.Cnt,
                Table_num:req.body.Table_num,
                Cook:req.body.Cook,
                Pay:req.body.Pay,
                Nick:req.body.Nick,
            });
            res.json(orders);
        }catch(err){
            console.error(err);
            next(err);
        }
    }
    //가게 남은 테이블을 로딩해줌
    else if(req.body.Method == "remain_table"){
        var nick = req.body.Nick;
        try{
            var table = await Order.findAll({
                include:{
                    model:Store,
                    //required:false,
                    //subQuery:false,
                    attributes:[
                    ],//어떤 컬럼도 넣지 않으면 스토어의 값은 불러오지 않고 조인하여 활용만 할 수 있음
                    //include,exclude 옵션을 사용할 수도 있지만 컬럼이 많아서 사용안함
                },
                
                attributes:[
                    [Sequelize.literal('distinct(Table_num)'),"Table_num"],
                    //"id"
                    //"Table_num",
                    "Store_code",
                ],
                
                // where:Sequelize.where[Sequelize.literal(`(Store.Nick = '${nick}')`)],
                where:{Nick:req.body.Nick},
                //group:"Store_code",
                
                
            })
               
            res.json(table);
        }catch(err){
            console.error(err);
            next(err);
        }
    }
    else if(req.body.Method == "remain_table_cnt"){
        try{
            const table =await Order.findAll({
                include:{
                    model:Store,
                    attributes:[
                    ]//아무것도 포함시키지 않으면 스토어의 값이 나오지 않고
                    //아래에서 내가 조인시킨 스토어 값을 활용가능함
                },
                attributes:[
                    "Store_code",//그룹화 시키기 위해 필요함
                    [Sequelize.literal('Table_cnt-count(distinct Table_num)'),"count"],
                    //가게의 테이블 수에서 주문한 테이블을 중복하지않게 하여 그 갯수를 빼면
                    //잔여 테이블 수가 나옴
                ],
                wehre:{Nick:req.body.Nick},
                group:"Store_code",
                //조인시켜서 계산을 했기 때문에 그룹화 시켜야 함
            })
            res.json(table);
        }catch(err){
            console.error(err);
            next(err);
        }
    }
    
})

//delete도 url로 값을 받아오지 않고 바디에 받아오게 수정함
router.delete('/',async(req,res,next)=>{
    if(req.body.Method == "Delete"){
        try{
            const orders = await Order.destroy({
              where:{
                Store_code:req.body.Store_code,
                Menu_name:req.body.Menu_name,
                Table_num:req.body.Table_num,
                Time:req.body.Time}
            });
            res.json(orders);
          }catch(err){
            console.error(err);
            next(err);
          }
    };
    
});

//db를 개편함
//post요청으로 대부분 처리하도록 바꾸고 메소드를 바디에 넣어서 쏴줌
//해당하는 값들마다 서버에서 따로 처리함
router.patch('/',async(req,res,next)=>{
    if(req.body.Method=="Cook_Patch"){
        var cnt = 0;
        try{
            var order = await Order.findOne({
                where:{
                    Store_code:req.body.Store_code,
                    Menu_name:req.body.Menu_name,
                    Cnt:req.body.Cnt,
                    Table_num:req.body.Table_num,
                    Time:req.body.Time,
                }
            });
            if(order.Cook == 1){
                cnt = 0;
                CookPatch(req.body.Store_code,req.body.Menu_name,req.body.Cnt,req.body.Table_num,req.body.Time,cnt);
            }else{
                cnt = 1;
                CookPatch(req.body.Store_code,req.body.Menu_name,req.body.Cnt,req.body.Table_num,req.body.Time,cnt);
                DeleteOrder(req.body.Store_code,req.body.Table_num);
            }
            
            res.json("Cook_Patch_Ok -> "+cnt);
        }catch(err){
            console.error(err);
            next(err);
        }
    }
    if(req.body.Method == "Pay_Patch"){
        var cnt = 0;
        try{
            var order = await Order.findOne({
                where:{
                    Store_code:req.body.Store_code,
                    Table_num:req.body.Table_num,
                }
            })
            if(order.Pay == 1){
                cnt = 0;
                PayPatch(req.body.Store_code,req.body.Table_num,cnt);
                
            }else{
                cnt = 1;
                PayPatch(req.body.Store_code,req.body.Table_num,cnt);
                    
            }
            
            res.json("Pay_Patch_Ok -> "+cnt);
        }catch(err){
            console.error(err);
            next(err);
        }
        
    }
});

//Cook 값을 1이나 0으로 바꿔주는 async 함수
//함수에서 값을 읽어서 Cook값을 업데이트 해줌
async function CookPatch(Store_code,Menu_name,Cnt,Table_num,Time,cnt){
    console.log(Store_code);
    try{
        var order = await Order.update({
            Cook:cnt,
        },
        {
            where:{
                Store_code:Store_code,
                Menu_name:Menu_name,
                Cnt:Cnt,
                Table_num:Table_num,
                Time:Time,
            }
        
        })
    }catch(err){
        console.error(err);
        next(err);
    }
    DeleteOrder(Store_code,Table_num);
}

//Pay 값을 1이나 0으로 바꿔주는 async 함수
//함수에서 값을 읽어서 Pay값을 업데이트 해줌
async function PayPatch(Store_code,Table_num,cnt){
    try{
        var order = await Order.update({
            Pay:cnt,
        },
        {
            where:{
                Store_code:Store_code,
                Table_num:Table_num,
            }
        })
    }catch(err){
        console.error(err);
        next(err);
    }
    DeleteOrder(Store_code,Table_num);
}

async function DeleteOrder(Store_code,Table_num){
    try{
        await updateAnalysis(Store_code,Table_num);
    }catch(err){
        console.error(err);
        next(err);
    }
    
    try{
        const order = await Order.destroy({
            where:{
                Store_code:Store_code,
                Table_num:Table_num,
                Cook:1,
                Pay:1}
        })
    }catch(err){
        console.error(err);
        next(err);
    }
}


//결제 시 결제 한 것을 analysis로 옮겨주는 함수, payall시에 사용
async function updateAnalysis(Store_code,Table_num){
    var cnt =0;
    try{
        var orders = await Order.findAll({
            include:{
                model: Menu,
                where:{Store_code:Store_code}
            },
            
            where:{
                Store_code:Store_code,
                Table_num:Table_num,
                cook:1,
                pay:1}

        })
        console.log(orders);
    }catch(err){
        console.error(err);
        return err;
    }
    
    while(cnt < orders.length){
        
        try{
            const analysis = await Analysis.create({
                Store_code:Store_code,
                Menu_name: orders[cnt].Menu_name,
                Menu_price: orders[cnt].Menu.Menu_price,
                Cnt:orders[cnt].Cnt,
                Time:orders[cnt].Time,
                Nick:orders[cnt].Nick,

            })
        }catch(err){
            console.error(err);
            return err;
        }
        cnt = cnt +1;
    }
}








module.exports = router;