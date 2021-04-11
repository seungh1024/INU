const express = require('express');
const Reserve =require('../models/reserve');

const router = express.Router();

router.post('/',async(req,res,next)=>{
    if(req.body.Method == "Add"){
        try{
            const reserve = await Reserve.create({
            Store_code:req.body.Store_code,
            Nick:req.body.Nick,
            Wait:req.body.Wait,
        })
        console.log(req.body.Wait);
        res.json(reserve);
        }catch(err){
            console.error(err);
            next(err);
        }
        
    }
    if(req.body.Method == "Delete"){
        try{
            console.log(req.body.Wait);
            const reserve = await Reserve.destroy({
                where:{
                    Store_code:req.body.Store_code,
                    Nick:req.body.Nick,
                    Wait:req.body.Wait,
                }
            })
            res.json(reserve);
        }catch(err){
            console.error(err);
            next(err);
        }
    }
})


module.exports = router;