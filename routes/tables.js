const express = require('express');
const Order = require('../models/order');
const Menu = require('../models/menu');
const Analysis = require('../models/analysis');
const Store = require('../models/store');
const Sequelize = require('sequelize');
const models = require('../models');

const router = express.Router();

//잔여 테이블 갯수를 알려주는 라우터
router.get('/:store_code',async(req,res,next)=>{
    //해당가게의 주문들을 모두 가져옴
    console.log(req.body);
    try{
        const orders = await Order.findAll({
            include:[{
                model:Store,
                attributes:["table_cnt"],
                //join한 Store 에서 table_cnt를 읽어옴
            }],
           
            attributes:["store_code",[Sequelize.literal("table_cnt-count(distinct table_num)"),"count"]],
            //그룹화 시키기 위해 store_code를 select하고
            //쿼리문을 그대로 가져온 저 문자열로 위에서 읽은 store.table_cnt에서 
            //order의 table_num을 중복되는건 제거하고 갯수를 세어서 뺀다
            //결과값은 현재 남은 테이블의 수가 된다.
            where:{store_code:req.params.store_code},
            group:"store_code",
            //가게별로 그룹화 시킴
        })
        if(orders.store_code == null){
            try{
                const stores = await Store.findOne({
                    attributes:["table_cnt"],
                    where:{store_code:req.params.store_code},
                })
                res.json(stores);
            }catch(err){
                console.error(err);
                next(err);
            }
            
        }else{
            res.json(orders);
            console.log(orders);
        }
        
    }catch(err){
        console.error(err);
        next(err);
    }
});

module.exports = router;