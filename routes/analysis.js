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
  });

module.exports = router;