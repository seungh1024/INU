const express = require('express');
const Analysis = require('../models/analysis');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const router = express.Router();

router.route('/')// orders/로 get방식일 때
 .get(async (req, res, next) => {
    try{
        //const sql = 'select *from analysis where (substr(time,9,2)>16)'
        var first = await Analysis.findAll({
            // attributes:[
            //     [Sequelize.literal('(substr(time+interval 20 day + interval 9 hour,9,5))'),'analysis']
            // ],
            // where:Sequelize.where(Sequelize.fn('substr',Sequelize.col('time'),9,2),16),
            where:{store_code:'2'}
        })
        //res.json(result);
    }catch(err){
        console.error(err);
        next(err);
    }
    try{
        var  second = await Analysis.findAll({
            where:{store_code:'1'}
        })
        //res.json(result);
    }catch(err){
        console.error(err);
        next(err);
    }
    
    //total = total.valueOf();
    first = JSON.stringify(first);
    second = JSON.stringify(second);
    //json형태로 string 형식으로 바꿔주는 것 같음
    var total = first+second;
    //그래서 합쳐짐
    console.log(total);
    console.log('##########');
    res.send(total);
    //합친걸 json으로 응답가능

    
  })
 .post(async(req,res,next)=>{
     console.log(req.body.start);
     console.log(req.body.end);
     console.log(req.body.store_code);
     const time = "T18:51:44.000Z"
     console.log(req.body.start+time);
     var start = req.body.start;
     var end = req.body.end;
     try{
        const analysis = await Analysis.findAll({
        //     where:{
        //         time:{
        //             [Op.between]:[req.body.start,req.body.end],
        //         }
        //   }
          where:
            //store_code:req.body.store_code,
            // time:{
            //     [Op.between]:[`${start}`,`${end}`],    
            // },
            
                //between:[`${start}`,`${end}`],
            Sequelize.where(Sequelize.literal(`store_code ='${req.body.store_code}' and time between '${start}' and '${end}'`)),
        });
        res.json(analysis);

     }catch(err){
         console.error(err);
         next(err);
     }
 });

module.exports = router;