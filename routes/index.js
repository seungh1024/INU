const express = require('express');
const User = require('../models/user');
const  Store  = require('../models/store');
//const Store  = require('../models/store');

const router = express.Router();

router.get('/',async(req,res,next)=>{
    try{
        const users = await User.findAll();
        const stores = await Store.findAll();
        //모든 사용자를 찾은 후 users에 넣고
        res.render('sequelize',{users,stores});
        //객체 두 개 넣어서도 됨
        
        //sequelize.html을 렌더링 할 때 결괏값인 users를 넣음
        //렌더링->우리가 알아볼 수 있게 바꿔주는?
    }catch(err){
        console.error(err);
        next(err);
    }
});


module.exports=router;