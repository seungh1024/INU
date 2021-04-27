const express = require('express');
const Analysis = require('../models/analysis');
const Store = require('../models/store');
const Menu  = require('../models/menu');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const router = express.Router();

function addDay(str, days){
    var date = new Date(str);
    date.setDate(date.getDate() + days);
    var year = date.getFullYear();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    return year + "-" + month + "-" + day;
}

function addMonth(str, months){
    var date = new Date(str);
    date.setMonth(date.getMonth() + months);
    var year = date.getFullYear();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    return year + "-" + month + "-" + day;
}

router.post('/', async(req,res,next)=>{
    console.log(req.body);
    if(req.body.Method == "Analysis"){

        var start_list = []
        var end_list = []

        var startTime = req.body.start
        var endTime = req.body.end
        if(req.body.Gubun1 == "년") {
            var startDate = startTime.split('-');
            var startYear = parseInt(startDate[0]);

            var endDate = endTime.split('-');
            var endYear = parseInt(endDate[0]);

            for(step = startYear; step <= endYear; step++) {
                start_list.push(step+"-01-01")
                end_list.push((step+1)+"-01-01")
            }
        }
        else if(req.body.Gubun1 == "월") {
            var midTime = startTime;
            while (midTime != addDay(endTime, 1)) {
                start_list.push(midTime)
                midTime = addMonth(midTime, 1)
                end_list.push(midTime)
            }
        }
        else if(req.body.Gubun1 == "일") {
            var midTime = startTime;
            while (midTime != addDay(endTime, 1)) {
                start_list.push(midTime)
                midTime = addDay(midTime, 1)
                end_list.push(midTime)
            }
        }
        else if(req.body.Gubun1 == "시") {
            var clock = ["T00:00:00.00Z", 'T01:00:00.00Z', 'T02:00:00.00Z', 'T03:00:00.00Z', 'T04:00:00.00Z', 'T05:00:00.00Z', 'T06:00:00.00Z', 'T07:00:00.00Z', 'T08:00:00.00Z', 'T09:00:00.00Z', 'T10:00:00.00Z', 'T11:00:00.00Z', 'T12:00:00.00Z', 'T13:00:00.00Z', 'T14:00:00.00Z', 'T15:00:00.00Z', 'T16:00:00.00Z', 'T17:00:00.00Z', 'T18:00:00.00Z', 'T19:00:00.00Z', 'T20:00:00.00Z', 'T21:00:00.00Z', 'T22:00:00.00Z', 'T23:00:00.00Z']
            
            for (idx = 0; idx < clock.length - 1; idx++) {
                start_list.push(startTime+clock[idx])
                end_list.push(startTime+clock[idx+1])
            }
            start_list.push(startTime+clock[23])
            end_list.push(addDay(endTime, 1)+clock[0])
        }

        console.log(start_list)
        console.log(end_list)

        var total_money = []
        var total_menu = "["
        for(idx = 0; idx < start_list.length; idx++) {

            if (req.body.Gubun2 == "금액") {
                if (req.body.Gubun3 == "전체") {
                    try{
                        var each = await Analysis.findAll({
                            where:{
                                Store_code:req.body.Store_code,
                                Time:{
                                    [Op.between]:[start_list[idx], end_list[idx]]
                                }
                            }
                        })
                        console.log(each);
                    }catch(err){
                        console.error(err);
                        next(err);
                    }
                }
                else {
                    try{
                        var nick = await Store.findOne({
                            attributes:[
                                'Nick',
                            ],
                            where:{Store_code:req.body.Store_code}
                        })
                    }catch(err){
                        console.error(err);
                        next(err);
                    }
                    
                    if(req.body.Gubun3 == "매장") {
                        try{
                            var each = await Analysis.findAll({
                                where:{
                                    Store_code:req.body.Store_code,
                                    Nick:nick.Nick,
                                    Time:{
                                        [Op.between]:[start_list[idx], end_list[idx]]
                                    }
                                }
                            })
                            console.log(each);
                        }catch(err){
                            console.error(err);
                            next(err);
                        }
                    }
                    else {
                        try{
                            var each = await Analysis.findAll({
                                where:{
                                    Store_code:req.body.Store_code,
                                    Nick:{ [Op.ne]: nick.Nick },
                                    Time:{
                                        [Op.between]:[start_list[idx], end_list[idx]]
                                    }
                                }
                            })
                            console.log(each);
                        }catch(err){
                            console.error(err);
                            next(err);
                        }
                    }
                }

                var money = 0
                for(step = 0; step < each.length; step++) {
                    money = money + (each[step].Menu_price * each[step].Cnt)
                }
                total_money.push(money)
            }
            else {
                if (req.body.Gubun3 == "전체") {
                    try{
                        var each = await Analysis.findAll({
                            attributes:[
                                'Menu_name',
                                [Sequelize.literal('SUM(Cnt)'),'count']
                            ],
                            where:{
                                Store_code:req.body.Store_code,
                                Time:{
                                    [Op.between]:[start_list[idx], end_list[idx]]
                                }
                            },
                            group:'Menu_name',
                        })
                        console.log(each);
                    }catch(err){
                        console.error(err);
                        next(err);
                    }
                }
                else {
                    try{
                        var nick = await Store.findOne({
                            attributes:[
                                'Nick',
                            ],
                            where:{Store_code:req.body.Store_code}
                        })
                    }catch(err){
                        console.error(err);
                        next(err);
                    }
                    
                    if(req.body.Gubun3 == "매장") {
                        try{
                            var each = await Analysis.findAll({
                                attributes:[
                                    'Menu_name',
                                    [Sequelize.literal('SUM(Cnt)'),'count']
                                ],
                                where:{
                                    Store_code:req.body.Store_code,
                                    Nick:nick.Nick,
                                    Time:{
                                        [Op.between]:[start_list[idx], end_list[idx]]
                                    }
                                },
                                group:'Menu_name',
                            })
                            console.log(each);
                        }catch(err){
                            console.error(err);
                            next(err);
                        }
                    }
                    else {
                        try{
                            var each = await Analysis.findAll({
                                attributes:[
                                    'Menu_name',
                                    [Sequelize.literal('SUM(Cnt)'),'count']
                                ],
                                where:{
                                    Store_code:req.body.Store_code,
                                    Nick:{ [Op.ne]: nick.Nick },
                                    Time:{
                                        [Op.between]:[start_list[idx], end_list[idx]]
                                    }
                                },
                                group:'Menu_name',
                            })
                            console.log(each);
                        }catch(err){
                            console.error(err);
                            next(err);
                        }
                    }
                }

                total_menu = total_menu + JSON.stringify(each) + ","
            }
        }

        if (req.body.Gubun2 == "금액") {
            res.send(start_list.toString() + "&" + total_money.toString())
        }
        else {
            try{
                var menu = await Menu.findAll({
                    attributes:[
                        'Menu_name',
                    ],
                    where:{
                        Store_code:req.body.Store_code,
                    },
                })
            }catch(err){
                console.error(err);
                next(err);
            }

            total_menu = total_menu.substring(0, total_menu.length-1) + "]"
            res.send(start_list.toString() + "&" + JSON.stringify(menu) + "&" + total_menu)
        }
    }
});

    
     

module.exports = router;