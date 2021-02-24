const express = require('express');
const AppUser = require('../models/appuser');
//const Store  = require('../models/store');

const userrouter = express.Router();

userrouter.get('/',async(req,res,next)=>{
    try{
        const appusers = await AppUser.findAll();
        //모든 사용자를 찾은 후 users에 넣고
        res.render('appuser',{appusers});
        //객체 두 개 넣어서도 됨
        
        //sequelize.html을 렌더링 할 때 결괏값인 users를 넣음
        //렌더링->우리가 알아볼 수 있게 바꿔주는?
    }catch(err){
        console.error(err);
        next(err);
    }
});


module.exports=userrouter;