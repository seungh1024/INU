const express = require('express');
const Analysis = require('../models/analysis');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const router = express.Router();

router.route('/')// orders/로 get방식일 때
 .get(async (req, res, next) => {
    try{
        //const sql = 'select *from analysis where (substr(time,9,2)>16)'
        var result = await Analysis.findAll({
            // attributes:[
            //     [Sequelize.literal('(substr(time+interval 20 day + interval 9 hour,9,5))'),'analysis']
            // ],
            // where:Sequelize.where(Sequelize.fn('substr',Sequelize.col('time'),9,2),16),
            
            
        })
        res.json(result);
    }catch(err){
        console.error(err);
        next(err);
    }
    // try {
    //   var analysis = await Analysis.findAll({
    //     //Sequelize.query('SELECT * FROM analysis');
    //   });
     
    //   res.json(orders);
    // } catch (err) {
    //   console.error(err);
    //   next(err);
    // }
  })
 .post(async(req,res,next)=>{
     console.log(req.body.start);
     console.log(req.body.end);
     const time = "T18:51:44.000Z"
     console.log(req.body.start+time);
     var start = req.body.start;
     var end = req.body.end;
     if("2021-03-25T18:51:44.000Z" ==(start+time).toString){
         console.log('hello');
     }
     try{
        const analysis = await Analysis.findAll({
        //     where:{
        //         time:{
        //             [Op.between]:[req.body.start,req.body.end],
        //         }
        //   }
          where:{
            time:{
                [Op.between]:[`${start}`,`${end}`],    
                // [Op.between]:[start,end],
            }
      }
            //where:Sequelize.literal(`(time between '${end}' AND '${start}')`),

    //"time": "2021-03-25T18:51:44.000Z"
        
        });
        res.json(analysis);

     }catch(err){
         console.error(err);
         next(err);
     }
 });

module.exports = router;