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
     console.log(req.body.gubun1);
     console.log(req.body.gubun2);
     console.log(req.body.gubun3);
     var code = req.body.store_code;
     var start = req.body.start;
     var end = req.body.end;
     var gubun1 = req.body.gubun1;
     //gubun1은 시간단위를 구분하기 위한 값 Year Month Day Clock
     var gubun2 = req.body.gubun2;
     //gubun2는 매출단위를 구분하기 위한 값 Money Menu
     var gubun3 = req.body.gubun3;
     //gubun3은 가게단위를 구분하기 위한 값 Total ->매장,포장, Store ->매장, TakeOut ->포장
     console.log(gubun1);
     
     var startDate = start.split('-');
     var startYear = parseInt(startDate[0]);
     var startMonth = parseInt(startDate[1]);
     var startDay = parseInt(startDate[2]);
     console.log(startYear);
     console.log(startMonth);
     console.log(startDay);
     var endDate = end.split('-');
     var endYear = parseInt(endDate[0]);
     var endMonth = parseInt(endDate[1]);
     var endDay = parseInt(endDate[2]);
     console.log(endYear);
     console.log(endMonth);
     console.log(endDay);

     
    //  try{
    //     const analysis = await Analysis.findAll({
    //     //     where:{
    //     //         time:{
    //     //             [Op.between]:[req.body.start,req.body.end],
    //     //         }
    //     //   }
    //       where:{
    //         store_code:req.body.store_code,
    //         time:{
    //             [Op.between]:[`${start}`,`${end}`],    
    //         },
    //     }
    //     });
    //     res.json(analysis);

    //  }catch(err){
    //      console.error(err);
    //      next(err);
    //  }

     //포장,매장 전체 
     if(gubun3 === 'Total'){
        if(gubun2 === 'Money'){//총 액수만 반환
            if(gubun1 === 'Year'){//연도별 예로 5/5일부터 시작해도 그 해 데이터를 다 추출함
                var Total = '';
                while(startYear<=endYear){
                    if(startYear != endYear){
                        var startTime = startYear +'-01-01T00:00:00.00Z';
                        var endTime = startYear+'-12-31T23:59:59.00Z';
                        //1년 단위로 잘랐음 23시 59분 59초까지
                        console.log(startTime);
                        console.log(endTime);
                        try{
                            var YearMoney = await Analysis.findAll({
                               where:{
                                   store_code:code,
                                   time:{
                                       [Op.between]:[startTime,endTime]
                                   }
                                },
                                attributes:[
                                    [Sequelize.literal('SUM(price*menu_cnt)'),'Money']
                                ]
                            
                                
                            })
    
                        }catch(err){
                            console.error(err);
                            next(err);
                        }
                    }else{
                        console.log(end);
                        startTime = startYear +'-01-01T00:00:00.00Z';
                        endTime = end+'T23:59:59.00Z'
                        try{
                            YearMoney = await Analysis.findAll({
                               where:{
                                   store_code:code,
                                   time:{
                                       [Op.between]:[startTime,endTime]
                                   },
                                
                                } ,
                                attributes:[
                                    [Sequelize.literal('SUM(price*menu_cnt)'),'Money']
                                ],
                                //group:'menu_name'
                            })
    
                        }catch(err){
                            console.error(err);
                            next(err);
                        }
                    }
                    
                    Total += JSON.stringify(YearMoney);
                    console.log(Total);
                    startYear +=1;
                    // code = '2';
                }
                res.send(Total);
            }
            else if(gubun1 === 'Month'){//월별

            }
            else if(gubun1 === 'Day'){//일별

            }
            else{//시간별

            }
        }
        else{//메뉴별로 반환
            if(gubun1 === 'Year'){//연도별
                var Total = '';
                while(startYear<=endYear){
                    if(startYear != endYear){
                        var startTime = startYear +'-01-01T00:00:00.00Z';
                        var endTime = startYear+'-12-31T23:59:59.00Z';
                        console.log(startTime);
                        console.log(endTime);
                        try{
                            var YearMoney = await Analysis.findAll({
                               where:{
                                   store_code:code,
                                   time:{
                                       [Op.between]:[startTime,endTime]
                                   }
                                },
                                attributes:[
                                    'menu_name',
                                    [Sequelize.literal('SUM(menu_cnt)'),'count']
                                ],
                                group:'menu_name',
                            
                                
                            })
    
                        }catch(err){
                            console.error(err);
                            next(err);
                        }
                    }else{
                        console.log(end);
                        startTime = startYear +'-01-01T00:00:00.00Z';
                        endTime = end+'T23:59:59.00Z'
                        try{
                            YearMoney = await Analysis.findAll({
                               where:{
                                   store_code:code,
                                   time:{
                                       [Op.between]:[startTime,endTime]
                                   },
                                
                                } ,
                                attributes:[
                                    'menu_name',
                                    [Sequelize.literal('SUM(menu_cnt)'),'count']
                                ],
                                group:'menu_name'
                            })
    
                        }catch(err){
                            console.error(err);
                            next(err);
                        }
                    }
                    
                    Total += JSON.stringify(YearMoney);
                    console.log(Total);
                    startYear +=1;
                    // code = '2';
                }
                res.send(Total);
            }
            else if(gubun1 === 'Month'){//월별

            }
            else if(gubun1 === 'Day'){//일별

            }
            else{//시간별

            }

        }
     }
     //매장만
     //inout값이 1인 것만
     else if(gubun3 === 'Store'){
        if(gubun2 === 'Money'){//토탈금액 반환
            if(gubun1 === 'Year'){//연도별
                var Total = '';
                while(startYear<=endYear){
                    if(startYear != endYear){
                        var startTime = startYear +'-01-01T00:00:00.00Z';
                        var endTime = startYear+'-12-31T23:59:59.00Z';
                        console.log(startTime);
                        console.log(endTime);
                        try{
                            var YearMoney = await Analysis.findAll({
                               where:{
                                   store_code:code,
                                   inout:1,
                                   time:{
                                       [Op.between]:[startTime,endTime]
                                   }
                                },
                                attributes:[
                                    [Sequelize.literal('SUM(price*menu_cnt)'),'Money']
                                ],
                            
                                
                            })
    
                        }catch(err){
                            console.error(err);
                            next(err);
                        }
                    }else{
                        console.log(end);
                        startTime = startYear +'-01-01T00:00:00.00Z';
                        endTime = end+'T23:59:59.00Z'
                        try{
                            YearMoney = await Analysis.findAll({
                               where:{
                                   store_code:code,
                                   inout:1,
                                   time:{
                                       [Op.between]:[startTime,endTime]
                                   },
                                
                                } ,
                                attributes:[
                                    [Sequelize.literal('SUM(price*menu_cnt)'),'Money']
                                ],
                            })
    
                        }catch(err){
                            console.error(err);
                            next(err);
                        }
                    }
                    
                    Total += JSON.stringify(YearMoney);
                    console.log(Total);
                    startYear +=1;
                    // code = '2';
                }
                res.send(Total);

            }
            else if(gubun1 === 'Month'){//월별

            }
            else if(gubun1 === 'Day'){//일별

            }
            else{//시간별

            }
        }
        else{//메뉴주문량 반환
            if(gubun1 === 'Year'){//연도별
                var Total = '';
                while(startYear<=endYear){
                    if(startYear != endYear){
                        var startTime = startYear +'-01-01T00:00:00.00Z';
                        var endTime = startYear+'-12-31T23:59:59.00Z';
                        console.log(startTime);
                        console.log(endTime);
                        try{
                            var YearMoney = await Analysis.findAll({
                               where:{
                                   store_code:code,
                                   inout:1,
                                   time:{
                                       [Op.between]:[startTime,endTime]
                                   }
                                },
                                attributes:[
                                    'menu_name',
                                    [Sequelize.literal('SUM(menu_cnt)'),'count']
                                ],
                                group:'menu_name',
                            
                                
                            })
    
                        }catch(err){
                            console.error(err);
                            next(err);
                        }
                    }else{
                        console.log(end);
                        startTime = startYear +'-01-01T00:00:00.00Z';
                        endTime = end+'T23:59:59.00Z'
                        try{
                            YearMoney = await Analysis.findAll({
                               where:{
                                   store_code:code,
                                   inout:1,
                                   time:{
                                       [Op.between]:[startTime,endTime]
                                   },
                                
                                } ,
                                attributes:[
                                    'menu_name',
                                    [Sequelize.literal('SUM(menu_cnt)'),'count']
                                ],
                                group:'menu_name'
                            })
    
                        }catch(err){
                            console.error(err);
                            next(err);
                        }
                    }
                    
                    Total += JSON.stringify(YearMoney);
                    console.log(Total);
                    startYear +=1;
                    // code = '2';
                }
                res.send(Total);
            }
            else if(gubun1 === 'Month'){//월별

            }
            else if(gubun1 === 'Day'){//일별

            }
            else{//시간별

            }
        }
     }
     //앱주문
     //inout = 0
     else{
        if(gubun2 === 'Money'){//토탈 금액 반환
            if(gubun1 === 'Year'){//연도별
                var Total = '';
                while(startYear<=endYear){
                    if(startYear != endYear){
                        var startTime = startYear +'-01-01T00:00:00.00Z';
                        var endTime = startYear+'-12-31T23:59:59.00Z';
                        console.log(startTime);
                        console.log(endTime);
                        try{
                            var YearMoney = await Analysis.findAll({
                               where:{
                                   store_code:code,
                                   inout:0,
                                   time:{
                                       [Op.between]:[startTime,endTime]
                                   }
                                },
                                attributes:[
                                    [Sequelize.literal('SUM(price*menu_cnt)'),'Money']
                                ],
                            
                                
                            })
    
                        }catch(err){
                            console.error(err);
                            next(err);
                        }
                    }else{
                        console.log(end);
                        startTime = startYear +'-01-01T00:00:00.00Z';
                        endTime = end+'T23:59:59.00Z'
                        try{
                            YearMoney = await Analysis.findAll({
                               where:{
                                   store_code:code,
                                   inout:0,
                                   time:{
                                       [Op.between]:[startTime,endTime]
                                   },
                                
                                } ,
                                attributes:[
                                    [Sequelize.literal('SUM(price*menu_cnt)'),'Money']
                                ],
                            })
    
                        }catch(err){
                            console.error(err);
                            next(err);
                        }
                    }
                    
                    Total += JSON.stringify(YearMoney);
                    console.log(Total);
                    startYear +=1;
                    // code = '2';
                }
                res.send(Total);

                
            }
            else if(gubun1 === 'Month'){//월별

            }
            else if(gubun1 === 'Day'){//일별

            }
            else{//시간별

            }
        }
        else{//메뉴당 주문량 반환
            if(gubun1 === 'Year'){//연도별
                var Total = '';
                while(startYear<=endYear){
                    if(startYear != endYear){
                        var startTime = startYear +'-01-01T00:00:00.00Z';
                        var endTime = startYear+'-12-31T23:59:59.00Z';
                        console.log(startTime);
                        console.log(endTime);
                        try{
                            var YearMoney = await Analysis.findAll({
                               where:{
                                   store_code:code,
                                   inout:0,
                                   time:{
                                       [Op.between]:[startTime,endTime]
                                   }
                                },
                                attributes:[
                                    'menu_name',
                                    [Sequelize.literal('SUM(menu_cnt)'),'count']
                                ],
                                group:'menu_name',
                            
                                
                            })
    
                        }catch(err){
                            console.error(err);
                            next(err);
                        }
                    }else{
                        console.log(end);
                        startTime = startYear +'-01-01T00:00:00.00Z';
                        endTime = end+'T23:59:59.00Z'
                        try{
                            YearMoney = await Analysis.findAll({
                               where:{
                                   store_code:code,
                                   inout:0,
                                   time:{
                                       [Op.between]:[startTime,endTime]
                                   },
                                
                                } ,
                                attributes:[
                                    'menu_name',
                                    [Sequelize.literal('SUM(menu_cnt)'),'count']
                                ],
                                group:'menu_name'
                            })
    
                        }catch(err){
                            console.error(err);
                            next(err);
                        }
                    }
                    
                    Total += JSON.stringify(YearMoney);
                    console.log(Total);
                    startYear +=1;
                    // code = '2';
                }
                res.send(Total);
            }
            else if(gubun1 === 'Month'){//월별

            }
            else if(gubun1 === 'Day'){//일별

            }
            else{//시간별

            }
        }
     }
 });

module.exports = router;