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

     //아래의 함수들은 각각 gubun1,2,3에 의해 구분된 함수들이고
     //각 함수들의 gubun1의 값인 Year,Month..등이 같으면 코드는 비슷하다
     //Money는 토탈 금액을 리턴하고 Menu는 메뉴별 주문량을 반환한다.
     //각 기간에 맞게 설정하기 위해 내부에서도 분기가 3종류정도로 나뉘며
     //첫 번째로 해당시작일 부터 그 해 말 까지의 데이터
     //두 번째로 마감일 전 년도 까지의 데이터들의 합
     //세 번째로 마감일에 해당하는 년도부터 마감일 까지의 데이터
     //이렇게 세개가 더해져서 각각 년도별로 대괄호로 구분되어 문자열로 반환된다.

//------------------연도별------------------------------
     //TotalMoneyYear일 때 해당 데이터 찾아서 반환하는 함수
    async function TotalMoneyYear(startYear,endYear,startMonth,endMonth,startDay,endDay,code){
        var Total = '[';
        if(startMonth<10){
            startMonth = '0'+startMonth
        }
        if(startDay<10){
            startDay = '0'+startDay
        }
        if(endMonth<10){
            endMonth = '0' +endMonth;
        }
        if(endDay<10){
            endDay = '0'+endDay;
        }
        var lastMonth ='12';
        var lastDay ='31';
        while(startYear<=endYear){
            if(startYear == endYear){
                lastMonth = endMonth;
                lastDay =endDay;
            }
            var startTime = startYear+'-'+ startMonth+'-'+ startDay +'T00:00:00.00Z';
            var endTime = startYear+'-'+lastMonth+ '-'+lastDay+ 'T23:59:59.00Z';
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
            //json형식으로 맞춰주기 위한 ',' 붙이기 작업 마지막은 ','가 들어가면 안되므로 제외
            if(startYear != endYear){
                Total += JSON.stringify(YearMoney)+',';
            }
            else{
                Total += JSON.stringify(YearMoney);
            }
            console.log(Total);
            startYear +=1;//1년단위니까 더해줌
            startMonth = '01';//첫 시작월을 읽어왔고 수행했으니 매년 첫 달인 01로 세팅
            startDay = '01';//마찬가지로 첫 시작일을 읽어왔고 수행했으니 매년 첫 일인 01로 세팅
        }   
        Total = Total +']';
        res.send(Total);
    }
    
    //TotalMenuYear 일 때 해당 데이터 찾아서 반환하는 함수
    async function TotalMenuYear(startYear,endYear,startMonth,endMonth,startDay,endDay,code){
        var Total = '[';
        if(startMonth<10){
            startMonth = '0'+startMonth
        }
        if(startDay<10){
            startDay = '0'+startDay
        }
        if(endMonth<10){
            endMonth = '0' +endMonth;
        }
        if(endDay<10){
            endDay = '0'+endDay;
        }
        var lastMonth ='12';
        var lastDay ='31';
        while(startYear<=endYear){
            if(startYear == endYear){
                lastMonth = endMonth;
                lastDay =endDay;
            }
            var startTime = startYear+'-'+ startMonth+'-'+ startDay +'T00:00:00.00Z';
            var endTime = startYear+'-'+lastMonth+ '-'+lastDay +'T23:59:59.00Z';
            //1년 단위로 잘랐음 23시 59분 59초까지
            console.log(startTime);
            console.log(endTime);
            try{
                var YearMoney = await Analysis.findAll({
                   where:{
                       store_code:code,
                       time:{
                           [Op.between]:[startTime,endTime],
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
            //json형식으로 맞춰주기 위한 ',' 붙이기 작업 마지막은 ','가 들어가면 안되므로 제외
            if(startYear != endYear){
                Total += JSON.stringify(YearMoney)+',';
            }
            else{
                Total += JSON.stringify(YearMoney);
            }
            console.log(Total);
            startYear +=1;//1년단위니까 더해줌
            startMonth = '01';//첫 시작월을 읽어왔고 수행했으니 매년 첫 달인 01로 세팅
            startDay = '01';//마찬가지로 첫 시작일을 읽어왔고 수행했으니 매년 첫 일인 01로 세팅    
        }     
        Total = Total +']'; 
        res.send(Total);
    }
    //inout 값이 있고 MoneyYear일 때 해당 데이터를 찾아서 변환하는 함수
    //other 값이 inout에 들어갈 값임
    async function OtherMoneyYear(startYear,endYear,startMonth,endMonth,startDay,endDay,code,other){
        var Total = '[';
        if(startMonth<10){
            startMonth = '0'+startMonth
        }
        if(startDay<10){
            startDay = '0'+startDay
        }
        if(endMonth<10){
            endMonth = '0' +endMonth;
        }
        if(endDay<10){
            endDay = '0'+endDay;
        }
        var lastMonth ='12';
        var lastDay ='31';
        while(startYear<=endYear){
            if(startYear == endYear){
                lastMonth = endMonth;
                lastDay =endDay;
            }
            var startTime = startYear+'-'+ startMonth+'-'+ startDay +'T00:00:00.00Z';
            var endTime = startYear+'-'+lastMonth+ '-'+lastDay +'T23:59:59.00Z';
            //1년 단위로 잘랐음 23시 59분 59초까지
            console.log(startTime);
            console.log(endTime);
            try{
                var YearMoney = await Analysis.findAll({
                   where:{
                       store_code:code,
                       inout:other,
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
            //json형식으로 맞춰주기 위한 ',' 붙이기 작업 마지막은 ','가 들어가면 안되므로 제외
            if(startYear != endYear){
                Total += JSON.stringify(YearMoney)+',';
            }
            else{
                Total += JSON.stringify(YearMoney);
            }
            console.log(Total);
            startYear +=1;//1년단위니까 더해줌
            startMonth = '01';//첫 시작월을 읽어왔고 수행했으니 매년 첫 달인 01로 세팅
            startDay = '01';//마찬가지로 첫 시작일을 읽어왔고 수행했으니 매년 첫 일인 01로 세팅     
        }
        Total = Total +']';
        res.send(Total);
        
    }
    //inout 값이 들어가고 MenuYear로 구분하여 처리해주는 함수
    async function OtherMenuYear(startYear,endYear,startMonth,endMonth,startDay,endDay,code,other){
        var Total = '[';
        if(startMonth<10){
            startMonth = '0'+startMonth
        }
        if(startDay<10){
            startDay = '0'+startDay
        }
        if(endMonth<10){
            endMonth = '0' +endMonth;
        }
        if(endDay<10){
            endDay = '0'+endDay;
        }
        var lastMonth ='12';
        var lastDay ='31';
        while(startYear<=endYear){
            if(startYear == endYear){
                lastMonth = endMonth;
                lastDay =endDay;
            }
            var startTime = startYear+'-'+ startMonth+'-'+ startDay +'T00:00:00.00Z';
            var endTime = startYear+'-'+lastMonth+ '-'+lastDay+'T23:59:59.00Z';
            //1년 단위로 잘랐음 23시 59분 59초까지
            console.log(startTime);
            console.log(endTime);
            try{
                var YearMoney = await Analysis.findAll({
                    where:{
                        store_code:code,
                        inout:other,
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

            //json형식으로 맞춰주기 위한 ',' 붙이기 작업 마지막은 ','가 들어가면 안되므로 제외
            if(startYear != endYear){
                Total += JSON.stringify(YearMoney)+',';
            }
            else{
                Total += JSON.stringify(YearMoney);
            }
            
            console.log(Total);
            startYear +=1;//1년단위니까 더해줌
            startMonth = '01';//첫 시작월을 읽어왔고 수행했으니 매년 첫 달인 01로 세팅
            startDay = '01';//마찬가지로 첫 시작일을 읽어왔고 수행했으니 매년 첫 일인 01로 세팅 
        }
        Total = Total +']';
        res.send(Total);
    }

//-----------월별-------------------------------------
    //매장주문,앱주문 토탈 월별 총금액을 반환하는 함수
    async function TotalMoneyMonth(startYear,endYear,startMonth,endMonth,startDay,endDay,code){
        var Total = '[';
        if(startDay<10){
            startDay = '0'+startDay
        }
        while(startYear<=endYear){
            var Day31 = '-31'
            while(startMonth<=12){
                if(startMonth<10){//10보다 작으면 앞에 0을 붙여줌
                    var Month ='0'+startMonth;//0을붙여 문자열로 만들어줌
                    
                }else{
                    var Month = startMonth.toString();
                }
                
                if(Month == endMonth && startYear == endYear){
                    if(endDay<10){
                        endDay = '0'+endDay
                    }
                    Day31 = '-'+endDay;
                }else{
                    switch(Month){
                        case '01':Day31 = '-31';
                        break;
                        case '02':Day31='-28';
                        break;
                        case '03':Day31 = '-31';
                        break;
                        case '04':Day31='-30';
                        break;
                        case '05':Day31='-31';
                        break;
                        case '06':Day31 = '-30';
                        break;
                        case '07':Day31='-31';
                        break;
                        case '08':Day31='-31';
                        break;
                        case '09':Day31='-30';
                        break;
                        case '10':Day31='-31';
                        break;
                        case '11':Day31='-30';
                        break;
                        case '12':Day31='-31';
                        break;
                    }
                }
                
                var startTime = startYear+'-'+ Month+'-'+startDay+'T00:00:00.00Z';
                var endTime = startYear+'-'+ Month + Day31 +'T23:59:59.00Z';
                //1개월 단위로 잘랐음
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
                
                if(startYear == endYear && startMonth == endMonth){
                    
                    Total += JSON.stringify(YearMoney);
                    break;
                }else{
                    Total += JSON.stringify(YearMoney)+',';
                }
                
                startDay='01';
                startMonth +=1;//1을 더해서 개월을 올림
                
            }
            // first =1; 
            startYear += 1;
            startMonth = 1;  
            console.log(Total);
        }
        Total = Total +']';
        res.send(Total);            
    }
    //매장주문,앱주문 토탈 월별 메뉴별주문량을 반환하는 함수
    async function TotalMenuMonth(startYear,endYear,startMonth,endMonth,startDay,endDay,code){
        var Total = '[';
        if(startDay<10){
            startDay = '0'+startDay
        }
        while(startYear<=endYear){
            var Day31 = '-31'
            while(startMonth<=12){
                if(startMonth<10){//10보다 작으면 앞에 0을 붙여줌
                    var Month ='0'+startMonth;//0을붙여 문자열로 만들어줌
                    
                }else{
                    var Month = startMonth.toString();
                }
                
                if(Month == endMonth && startYear == endYear){
                    if(endDay<10){
                        endDay = '0'+endDay
                    }
                    Day31 = '-'+endDay;
                }else{
                    switch(Month){
                        case '01':Day31 = '-31';
                        break;
                        case '02':Day31='-28';
                        break;
                        case '03':Day31 = '-31';
                        break;
                        case '04':Day31='-30';
                        break;
                        case '05':Day31='-31';
                        break;
                        case '06':Day31 = '-30';
                        break;
                        case '07':Day31='-31';
                        break;
                        case '08':Day31='-31';
                        break;
                        case '09':Day31='-30';
                        break;
                        case '10':Day31='-31';
                        break;
                        case '11':Day31='-30';
                        break;
                        case '12':Day31='-31';
                        break;
                    }
                }
                var startTime = startYear+'-'+ Month+'-'+startDay+'T00:00:00.00Z';
                var endTime = startYear+'-'+ Month + Day31 +'T23:59:59.00Z';
                //1개월 단위로 잘랐음
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
                
                if(startYear == endYear && startMonth == endMonth){
                    
                    Total += JSON.stringify(YearMoney);
                    break;
                }else{
                    Total += JSON.stringify(YearMoney)+',';
                }
                
                startDay='01';
                startMonth +=1;//1을 더해서 개월을 올림
                
            }
            // first =1; 
            startYear += 1;
            startMonth = 1;  
            console.log(Total);
        }
        Total = Total +']';
        res.send(Total);
    }
    //매장주문,앱주문별 월별 총 금액을 반환하는 함수
    //other 값이 analysis테이블에서 inout 값이며 1이면 매장, 0이면 앱주문으로 사용
    async function OtherMoneyMonth(startYear,endYear,startMonth,endMonth,startDay,endDay,code,other){
        var Total = '[';
        if(startDay<10){
            startDay = '0'+startDay
        }
        while(startYear<=endYear){
            var Day31 = '-31'
            while(startMonth<=12){
                if(startMonth<10){//10보다 작으면 앞에 0을 붙여줌
                    var Month ='0'+startMonth;//0을붙여 문자열로 만들어줌
                    
                }else{
                    var Month = startMonth.toString();
                }
                
                if(Month == endMonth && startYear == endYear){
                    if(endDay<10){
                        endDay = '0'+endDay
                    }
                    Day31 = '-'+endDay;
                }else{
                    switch(Month){
                        case '01':Day31 = '-31';
                        break;
                        case '02':Day31='-28';
                        break;
                        case '03':Day31 = '-31';
                        break;
                        case '04':Day31='-30';
                        break;
                        case '05':Day31='-31';
                        break;
                        case '06':Day31 = '-30';
                        break;
                        case '07':Day31='-31';
                        break;
                        case '08':Day31='-31';
                        break;
                        case '09':Day31='-30';
                        break;
                        case '10':Day31='-31';
                        break;
                        case '11':Day31='-30';
                        break;
                        case '12':Day31='-31';
                        break;
                    }
                }
                var startTime = startYear+'-'+ Month+'-'+startDay+'T00:00:00.00Z';
                var endTime = startYear+'-'+ Month + Day31 +'T23:59:59.00Z';
                //1개월 단위로 잘랐음
                console.log(startTime);
                console.log(endTime);
                try{
                    var YearMoney = await Analysis.findAll({
                        where:{
                            store_code:code,
                            inout:other,
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
                
                if(startYear == endYear && startMonth == endMonth){
                    
                    Total += JSON.stringify(YearMoney);
                    break;
                }else{
                    Total += JSON.stringify(YearMoney)+',';
                }
                
                startDay='01';
                startMonth +=1;//1을 더해서 개월을 올림
                
            }
            // first =1; 
            startYear += 1;
            startMonth = 1;  
            console.log(Total);
        }
        Total =Total +']';
        res.send(Total);
    }
    //매장주문,앱주문별 월별 메뉴별 총 주문량을 반환하는 함수
    //other 값이 analysis테이블에서 inout 값이며 1이면 매장, 0이면 앱주문으로 사용
    async function OtherMenuMonth(startYear,endYear,startMonth,endMonth,startDay,endDay,code,other){
        var Total = '[';
        if(startDay<10){
            startDay = '0'+startDay
        }
        while(startYear<=endYear){
            var Day31 = '-31'
            while(startMonth<=12){
                if(startMonth<10){//10보다 작으면 앞에 0을 붙여줌
                    var Month ='0'+startMonth;//0을붙여 문자열로 만들어줌
                    
                }else{
                    var Month = startMonth.toString();
                }
                
                if(Month == endMonth && startYear == endYear){
                    if(endDay<10){
                        endDay = '0'+endDay
                    }
                    Day31 = '-'+endDay;
                }else{
                    switch(Month){
                        case '01':Day31 = '-31';
                        break;
                        case '02':Day31='-28';
                        break;
                        case '03':Day31 = '-31';
                        break;
                        case '04':Day31='-30';
                        break;
                        case '05':Day31='-31';
                        break;
                        case '06':Day31 = '-30';
                        break;
                        case '07':Day31='-31';
                        break;
                        case '08':Day31='-31';
                        break;
                        case '09':Day31='-30';
                        break;
                        case '10':Day31='-31';
                        break;
                        case '11':Day31='-30';
                        break;
                        case '12':Day31='-31';
                        break;
                    }
                }
                
                var startTime = startYear+'-'+ Month+'-'+startDay+'T00:00:00.00Z';
                var endTime = startYear+'-'+ Month + Day31 +'T23:59:59.00Z';
                //1개월 단위로 잘랐음
                console.log(startTime);
                console.log(endTime);
                try{
                    var YearMoney = await Analysis.findAll({
                        where:{
                            store_code:code,
                            inout:other,
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
                
                if(startYear == endYear && startMonth == endMonth){
                    
                    Total += JSON.stringify(YearMoney);
                    break;
                }else{
                    Total += JSON.stringify(YearMoney)+',';
                }
                
                startDay='01';
                startMonth +=1;//1을 더해서 개월을 올림
                
            }
            // first =1; 
            startYear += 1;
            startMonth = 1;  
            console.log(Total);
        }
        Total = Total +']';
        res.send(Total);
    }

//---------------일별-----------------------------------
    //모든주문 일별 총금액을 반환하는 함수
    async function TotalMoneyDay(startYear,endYear,startMonth,endMonth,startDay,endDay,code){
    var Total = '[';
    var firstDay = '';//날짜 쿼리에 들어갈 변수
    var firstYear = startYear;
    while(startYear<=endYear){
        var Day31 = '-31'
        while(startMonth<=12){
            if(startMonth<10){//10보다 작으면 앞에 0을 붙여줌
                var Month ='0'+startMonth;//0을붙여 문자열로 만들어줌
                
            }else{
                var Month = startMonth.toString();//두자리수는 그대로
            }
            
            if(Month == endMonth && startYear == endYear){//마지막해의 마지막달이면
                Day31 = endDay;
            }else{
                switch(Month){
                    case '01':Day31 = 31;
                    break;
                    case '02':Day31=28;
                    break;
                    case '03':Day31 = 31;
                    break;
                    case '04':Day31=30;
                    break;
                    case '05':Day31=31;
                    break;
                    case '06':Day31 = 30;
                    break;
                    case '07':Day31=31;
                    break;
                    case '08':Day31=31;
                    break;
                    case '09':Day31=30;
                    break;
                    case '10':Day31=31;
                    break;
                    case '11':Day31=30;
                    break;
                    case '12':Day31=31;
                    break;
                }
            }
            while(startDay<=Day31){//한달동안 매일 반복하는 것
                if(startDay<10){//한자리 수면 2자리로 맞춰줌
                    firstDay = '0'+startDay;
                    //시작일
                }else{
                    firstDay = startDay;
                }
                var startTime = startYear+'-'+ Month+'-'+firstDay+'T00:00:00.00Z';
                var endTime = startYear+'-'+ Month + '-'+firstDay +'T23:59:59.00Z';
                //1개월 단위로 잘랐음
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
                    if(startDay == Day31 && startMonth == endMonth &&startYear == endYear){
                        Total += JSON.stringify(YearMoney);
                    }else{
                        Total += JSON.stringify(YearMoney)+',';
                    }

                }catch(err){
                    console.error(err);
                    next(err);
                }
                
                startDay +=1;//여기선 비교를 위해 숫자로 시작일로 세팅해줌
            }
            if(startYear == endYear && startMonth == endMonth){
                break;
            }
            startMonth +=1;//1을 더해서 개월을 올림
            startDay=1;//첫날을 다시 초기화 해줌
            
        }
        startYear += 1;
        startMonth = 1;  
        //년을 올리고 월은 첫달로 세팅
        Total = Total + ']';
        console.log(Total);
    }

    res.send(Total);            
    }
    async function TotalMenuDay(startYear,endYear,startMonth,endMonth,startDay,endDay,code){
        var Total = '[';
        var firstDay = '';//날짜 쿼리에 들어갈 변수
        var firstYear = startYear;
        while(startYear<=endYear){
            var Day31 = '-31'
            while(startMonth<=12){
                if(startMonth<10){//10보다 작으면 앞에 0을 붙여줌
                    var Month ='0'+startMonth;//0을붙여 문자열로 만들어줌
                    
                }else{
                    var Month = startMonth.toString();//두자리수는 그대로
                }
                
                if(Month == endMonth && startYear == endYear){//마지막해의 마지막달이면
                    Day31 = endDay;
                }else{
                    switch(Month){
                        case '01':Day31 = 31;
                        break;
                        case '02':Day31=28;
                        break;
                        case '03':Day31 = 31;
                        break;
                        case '04':Day31=30;
                        break;
                        case '05':Day31=31;
                        break;
                        case '06':Day31 = 30;
                        break;
                        case '07':Day31=31;
                        break;
                        case '08':Day31=31;
                        break;
                        case '09':Day31=30;
                        break;
                        case '10':Day31=31;
                        break;
                        case '11':Day31=30;
                        break;
                        case '12':Day31=31;
                        break;
                    }
                }
                while(startDay<=Day31){//한달동안 매일 반복하는 것
                    if(startDay<10){//한자리 수면 2자리로 맞춰줌
                        firstDay = '0'+startDay;
                        //시작일
                    }else{
                        firstDay = startDay;
                    }
                    var startTime = startYear+'-'+ Month+'-'+firstDay+'T00:00:00.00Z';
                    var endTime = startYear+'-'+ Month + '-'+firstDay +'T23:59:59.00Z';
                    //1개월 단위로 잘랐음
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
                        if(startDay == Day31 && startMonth == endMonth &&startYear == endYear){
                            Total += JSON.stringify(YearMoney);
                        }else{
                            Total += JSON.stringify(YearMoney)+',';
                        }
    
                    }catch(err){
                        console.error(err);
                        next(err);
                    }
                    
                    startDay +=1;//여기선 비교를 위해 숫자로 시작일로 세팅해줌
                }
                if(startYear == endYear && startMonth == endMonth){
                    break;
                }
                startMonth +=1;//1을 더해서 개월을 올림
                startDay=1;//첫날을 다시 초기화 해줌
                
            }
            startYear += 1;
            startMonth = 1;  
            //년을 올리고 월은 첫달로 세팅
            console.log(Total);
        }
        Total = Total + ']';
        res.send(Total);
    }
    async function OtherMoneyDay(startYear,endYear,startMonth,endMonth,startDay,endDay,code,other){
        var Total = '[';
        var firstDay = '';//날짜 쿼리에 들어갈 변수
        var firstYear = startYear;
        while(startYear<=endYear){
            var Day31 = '-31'
            while(startMonth<=12){
                if(startMonth<10){//10보다 작으면 앞에 0을 붙여줌
                    var Month ='0'+startMonth;//0을붙여 문자열로 만들어줌
                    
                }else{
                    var Month = startMonth.toString();//두자리수는 그대로
                }
                
                if(Month == endMonth && startYear == endYear){//마지막해의 마지막달이면
                    Day31 = endDay;
                }else{
                    switch(Month){
                        case '01':Day31 = 31;
                        break;
                        case '02':Day31=28;
                        break;
                        case '03':Day31 = 31;
                        break;
                        case '04':Day31=30;
                        break;
                        case '05':Day31=31;
                        break;
                        case '06':Day31 = 30;
                        break;
                        case '07':Day31=31;
                        break;
                        case '08':Day31=31;
                        break;
                        case '09':Day31=30;
                        break;
                        case '10':Day31=31;
                        break;
                        case '11':Day31=30;
                        break;
                        case '12':Day31=31;
                        break;
                    }
                }
                while(startDay<=Day31){//한달동안 매일 반복하는 것
                    if(startDay<10){//한자리 수면 2자리로 맞춰줌
                        firstDay = '0'+startDay;
                        //시작일
                    }else{
                        firstDay = startDay;
                    }
                    var startTime = startYear+'-'+ Month+'-'+firstDay+'T00:00:00.00Z';
                    var endTime = startYear+'-'+ Month + '-'+firstDay +'T23:59:59.00Z';
                    //1개월 단위로 잘랐음
                    console.log(startTime);
                    console.log(endTime);
                    try{
                        var YearMoney = await Analysis.findAll({
                            where:{
                                store_code:code,
                                inout:other,
                                time:{
                                    [Op.between]:[startTime,endTime]
                                }
                             },
                             attributes:[
                                [Sequelize.literal('SUM(price*menu_cnt)'),'Money']
                            ]
                             
                         })
                        if(startDay == Day31 && startMonth == endMonth &&startYear == endYear){
                            Total += JSON.stringify(YearMoney);
                        }else{
                            Total += JSON.stringify(YearMoney)+',';
                        }
    
                    }catch(err){
                        console.error(err);
                        next(err);
                    }
                    
                    startDay +=1;//여기선 비교를 위해 숫자로 시작일로 세팅해줌
                }
                if(startYear == endYear && startMonth == endMonth){
                    break;
                }
                startMonth +=1;//1을 더해서 개월을 올림
                startDay=1;//첫날을 다시 초기화 해줌
                
            }
            startYear += 1;
            startMonth = 1;  
            //년을 올리고 월은 첫달로 세팅
            console.log(Total);
        }
        Total = Total +']';
        res.send(Total);
    }
    async function OtherMenuDay(startYear,endYear,startMonth,endMonth,startDay,endDay,code,other){
        var Total = '[';
        var firstDay = '';//날짜 쿼리에 들어갈 변수
        var firstYear = startYear;
        while(startYear<=endYear){
            var Day31 = '-31'
            while(startMonth<=12){
                if(startMonth<10){//10보다 작으면 앞에 0을 붙여줌
                    var Month ='0'+startMonth;//0을붙여 문자열로 만들어줌
                    
                }else{
                    var Month = startMonth.toString();//두자리수는 그대로
                }
                
                if(Month == endMonth && startYear == endYear){//마지막해의 마지막달이면
                    Day31 = endDay;
                }else{
                    switch(Month){
                        case '01':Day31 = 31;
                        break;
                        case '02':Day31=28;
                        break;
                        case '03':Day31 = 31;
                        break;
                        case '04':Day31=30;
                        break;
                        case '05':Day31=31;
                        break;
                        case '06':Day31 = 30;
                        break;
                        case '07':Day31=31;
                        break;
                        case '08':Day31=31;
                        break;
                        case '09':Day31=30;
                        break;
                        case '10':Day31=31;
                        break;
                        case '11':Day31=30;
                        break;
                        case '12':Day31=31;
                        break;
                    }
                }
                while(startDay<=Day31){//한달동안 매일 반복하는 것
                    if(startDay<10){//한자리 수면 2자리로 맞춰줌
                        firstDay = '0'+startDay;
                        //시작일
                    }else{
                        firstDay = startDay;
                    }
                    var startTime = startYear+'-'+ Month+'-'+firstDay+'T00:00:00.00Z';
                    var endTime = startYear+'-'+ Month + '-'+firstDay +'T23:59:59.00Z';
                    //1개월 단위로 잘랐음
                    console.log(startTime);
                    console.log(endTime);
                    try{
                        var YearMoney = await Analysis.findAll({
                            where:{
                                store_code:code,
                                inout:other,
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
                         if(startDay == Day31 && startMonth == endMonth &&startYear == endYear){
                             Total += JSON.stringify(YearMoney);
                         }else{
                             Total += JSON.stringify(YearMoney)+',';
                         }
                         
    
                    }catch(err){
                        console.error(err);
                        next(err);
                    }
                    
                    startDay +=1;//여기선 비교를 위해 숫자로 시작일로 세팅해줌
                }
                if(startYear == endYear && startMonth == endMonth){
                    break;
                }
                startMonth +=1;//1을 더해서 개월을 올림
                startDay=1;//첫날을 다시 초기화 해줌
                
            }
            startYear += 1;
            startMonth = 1;  
            //년을 올리고 월은 첫달로 세팅
            console.log(Total);
        }
        Total = Total + ']';
        res.send(Total);
    }

//-----------------시간별--------------------------------    

    async function TotalMoneyClock(startYear,endYear,startMonth,endMonth,startDay,endDay,code){
        var Total = '[';
        var firstDay = '';//날짜 쿼리에 들어갈 변수
        var firstYear = startYear;
        while(startYear<=endYear){
            var Day31 = '-31'
            while(startMonth<=12){
                if(startMonth<10){//10보다 작으면 앞에 0을 붙여줌
                    var Month ='0'+startMonth;//0을붙여 문자열로 만들어줌
                    
                }else{
                    var Month = startMonth.toString();//두자리수는 그대로
                }
                
                if(Month == endMonth && startYear == endYear){//마지막해의 마지막달이면
                    Day31 = endDay;
                }else{
                    switch(Month){
                        case '01':Day31 = 31;
                        break;
                        case '02':Day31=28;
                        break;
                        case '03':Day31 = 31;
                        break;
                        case '04':Day31=30;
                        break;
                        case '05':Day31=31;
                        break;
                        case '06':Day31 = 30;
                        break;
                        case '07':Day31=31;
                        break;
                        case '08':Day31=31;
                        break;
                        case '09':Day31=30;
                        break;
                        case '10':Day31=31;
                        break;
                        case '11':Day31=30;
                        break;
                        case '12':Day31=31;
                        break;
                    }
                }
                while(startDay<=Day31){//한달동안 매일 반복하는 것
                    if(startDay<10){//한자리 수면 2자리로 맞춰줌
                        firstDay = '0'+startDay;
                        //시작일
                    }else{
                        firstDay = startDay;
                    }
                    var startClock = 0;
                    while(startClock < 24){//24시간
                        //24번반복하는 것 0시부터 23시까지
                        if(startClock < 10){
                            var firstClock = '0'+startClock;
                        }else{
                            var firstClock = startClock;
                        }
                        var startTime = startYear+'-'+ Month+'-'+firstDay+'T'+firstClock +':00:00.00Z';
                        var endTime = startYear+'-'+ Month + '-'+firstDay +'T'+firstClock +':59:59.00Z';
                        //1개월 단위로 잘랐음
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
                            if(startClock ==23){
                                Total += JSON.stringify(YearMoney);
                            }else{
                                Total += JSON.stringify(YearMoney)+',';
                            } 
        
                        }catch(err){
                            console.error(err);
                            next(err);
                        }
                        startClock +=1;
                    }
                    
                    
                    startDay +=1;//여기선 비교를 위해 숫자로 시작일로 세팅해줌
                }
                if(startYear == endYear && startMonth == endMonth){
                    break;
                }
                startMonth +=1;//1을 더해서 개월을 올림
                startDay=1;//첫날을 다시 초기화 해줌
                
            }
            startYear += 1;
            startMonth = 1;  
            //년을 올리고 월은 첫달로 세팅
            console.log(Total);
        }
        Total = Total + ']';
        res.send(Total);    
    }
    async function TotalMenuClock(startYear,endYear,startMonth,endMonth,startDay,endDay,code){
        var Total = '[';
        var firstDay = '';//날짜 쿼리에 들어갈 변수
        var firstYear = startYear;
        while(startYear<=endYear){
            var Day31 = '-31'
            while(startMonth<=12){
                if(startMonth<10){//10보다 작으면 앞에 0을 붙여줌
                    var Month ='0'+startMonth;//0을붙여 문자열로 만들어줌
                    
                }else{
                    var Month = startMonth.toString();//두자리수는 그대로
                }
                
                if(Month == endMonth && startYear == endYear){//마지막해의 마지막달이면
                    Day31 = endDay;
                }else{
                    switch(Month){
                        case '01':Day31 = 31;
                        break;
                        case '02':Day31=28;
                        break;
                        case '03':Day31 = 31;
                        break;
                        case '04':Day31=30;
                        break;
                        case '05':Day31=31;
                        break;
                        case '06':Day31 = 30;
                        break;
                        case '07':Day31=31;
                        break;
                        case '08':Day31=31;
                        break;
                        case '09':Day31=30;
                        break;
                        case '10':Day31=31;
                        break;
                        case '11':Day31=30;
                        break;
                        case '12':Day31=31;
                        break;
                    }
                }
                while(startDay<=Day31){//한달동안 매일 반복하는 것
                    if(startDay<10){//한자리 수면 2자리로 맞춰줌
                        firstDay = '0'+startDay;
                        //시작일
                    }else{
                        firstDay = startDay;
                    }
                    var startClock = 0;
                    while(startClock < 24){//24시간
                        //24번반복하는 것 0시부터 23시까지
                        if(startClock < 10){
                            var firstClock = '0'+startClock;
                        }else{
                            var firstClock = startClock;
                        }
                        var startTime = startYear+'-'+ Month+'-'+firstDay+'T'+firstClock +':00:00.00Z';
                        var endTime = startYear+'-'+ Month + '-'+firstDay +'T'+firstClock +':59:59.00Z';
                        //1개월 단위로 잘랐음
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
                            if(startClock ==23){
                                Total += JSON.stringify(YearMoney);
                            }else{
                                Total += JSON.stringify(YearMoney)+',';
                            }
        
                        }catch(err){
                            console.error(err);
                            next(err);
                        }
                        startClock +=1;
                    }
                    
                    
                    startDay +=1;//여기선 비교를 위해 숫자로 시작일로 세팅해줌
                }
                if(startYear == endYear && startMonth == endMonth){
                    break;
                }
                startMonth +=1;//1을 더해서 개월을 올림
                startDay=1;//첫날을 다시 초기화 해줌
                
            }
            startYear += 1;
            startMonth = 1;  
            //년을 올리고 월은 첫달로 세팅
            console.log(Total);
        }
        Total = Total +']';
        res.send(Total);    
    }
    async function OtherMoneyClock(startYear,endYear,startMonth,endMonth,startDay,endDay,code,other){
        var Total = '[';
        var firstDay = '';//날짜 쿼리에 들어갈 변수
        var firstYear = startYear;
        while(startYear<=endYear){
            var Day31 = '-31'
            while(startMonth<=12){
                if(startMonth<10){//10보다 작으면 앞에 0을 붙여줌
                    var Month ='0'+startMonth;//0을붙여 문자열로 만들어줌
                    
                }else{
                    var Month = startMonth.toString();//두자리수는 그대로
                }
                
                if(Month == endMonth && startYear == endYear){//마지막해의 마지막달이면
                    Day31 = endDay;
                }else{
                    switch(Month){
                        case '01':Day31 = 31;
                        break;
                        case '02':Day31=28;
                        break;
                        case '03':Day31 = 31;
                        break;
                        case '04':Day31=30;
                        break;
                        case '05':Day31=31;
                        break;
                        case '06':Day31 = 30;
                        break;
                        case '07':Day31=31;
                        break;
                        case '08':Day31=31;
                        break;
                        case '09':Day31=30;
                        break;
                        case '10':Day31=31;
                        break;
                        case '11':Day31=30;
                        break;
                        case '12':Day31=31;
                        break;
                    }
                }
                while(startDay<=Day31){//한달동안 매일 반복하는 것
                    if(startDay<10){//한자리 수면 2자리로 맞춰줌
                        firstDay = '0'+startDay;
                        //시작일
                    }else{
                        firstDay = startDay;
                    }
                    var startClock = 0;
                    while(startClock < 24){//24시간
                        //24번반복하는 것 0시부터 23시까지
                        if(startClock < 10){
                            var firstClock = '0'+startClock;
                        }else{
                            var firstClock = startClock;
                        }
                        var startTime = startYear+'-'+ Month+'-'+firstDay+'T'+firstClock +':00:00.00Z';
                        var endTime = startYear+'-'+ Month + '-'+firstDay +'T'+firstClock +':59:59.00Z';
                        //1개월 단위로 잘랐음
                        console.log(startTime);
                        console.log(endTime);
                        try{
                            var YearMoney = await Analysis.findAll({
                                where:{
                                    store_code:code,
                                    inout:other,
                                    time:{
                                        [Op.between]:[startTime,endTime]
                                    }
                                 },
                                attributes:[
                                    [Sequelize.literal('SUM(price*menu_cnt)'),'Money']
                                ]  
                                 
                             })
                            if(startClock ==23){
                                Total += JSON.stringify(YearMoney);
                            }else{
                                Total += JSON.stringify(YearMoney)+',';
                            } 
        
                        }catch(err){
                            console.error(err);
                            next(err);
                        }
                        startClock +=1;
                    }
                    
                    
                    startDay +=1;//여기선 비교를 위해 숫자로 시작일로 세팅해줌
                }
                if(startYear == endYear && startMonth == endMonth){
                    break;
                }
                startMonth +=1;//1을 더해서 개월을 올림
                startDay=1;//첫날을 다시 초기화 해줌
                
            }
            startYear += 1;
            startMonth = 1;  
            //년을 올리고 월은 첫달로 세팅
            console.log(Total);
        }
        
        Total = Total + ']';
        res.send(Total);
    }
    async function OtherMenuClock(startYear,endYear,startMonth,endMonth,startDay,endDay,code,other){
        var Total = '[';
        var firstDay = '';//날짜 쿼리에 들어갈 변수
        var firstYear = startYear;
        while(startYear<=endYear){
            var Day31 = '-31'
            while(startMonth<=12){
                if(startMonth<10){//10보다 작으면 앞에 0을 붙여줌
                    var Month ='0'+startMonth;//0을붙여 문자열로 만들어줌
                    
                }else{
                    var Month = startMonth.toString();//두자리수는 그대로
                }
                
                if(Month == endMonth && startYear == endYear){//마지막해의 마지막달이면
                    Day31 = endDay;
                }else{
                    switch(Month){
                        case '01':Day31 = 31;
                        break;
                        case '02':Day31=28;
                        break;
                        case '03':Day31 = 31;
                        break;
                        case '04':Day31=30;
                        break;
                        case '05':Day31=31;
                        break;
                        case '06':Day31 = 30;
                        break;
                        case '07':Day31=31;
                        break;
                        case '08':Day31=31;
                        break;
                        case '09':Day31=30;
                        break;
                        case '10':Day31=31;
                        break;
                        case '11':Day31=30;
                        break;
                        case '12':Day31=31;
                        break;
                    }
                }
                while(startDay<=Day31){//한달동안 매일 반복하는 것
                    if(startDay<10){//한자리 수면 2자리로 맞춰줌
                        firstDay = '0'+startDay;
                        //시작일
                    }else{
                        firstDay = startDay;
                    }
                    var startClock = 0;
                    while(startClock < 24){//24시간
                        //24번반복하는 것 0시부터 23시까지
                        if(startClock < 10){
                            var firstClock = '0'+startClock;
                        }else{
                            var firstClock = startClock;
                        }
                        var startTime = startYear+'-'+ Month+'-'+firstDay+'T'+firstClock +':00:00.00Z';
                        var endTime = startYear+'-'+ Month + '-'+firstDay +'T'+firstClock +':59:59.00Z';
                        //1개월 단위로 잘랐음
                        console.log(startTime);
                        console.log(endTime);
                        try{
                            var YearMoney = await Analysis.findAll({
                                where:{
                                    store_code:code,
                                    inout:other,
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
                             if(startClock ==23){
                                 Total += JSON.stringify(YearMoney);
                             }else{
                                 Total += JSON.stringify(YearMoney)+',';
                             }
                             
        
                        }catch(err){
                            console.error(err);
                            next(err);
                        }
                        startClock +=1;
                    }
                    
                    
                    startDay +=1;//여기선 비교를 위해 숫자로 시작일로 세팅해줌
                }
                if(startYear == endYear && startMonth == endMonth){
                    break;
                }
                startMonth +=1;//1을 더해서 개월을 올림
                startDay=1;//첫날을 다시 초기화 해줌
                
            }
            startYear += 1;
            startMonth = 1;  
            //년을 올리고 월은 첫달로 세팅
            console.log(Total);
        }
        Total = Total +']';
        res.send(Total);    
    }

     //포장,매장 전체 
     if(gubun3 === 'Total'){
        if(gubun2 === 'Money'){//총 액수만 반환
            if(gubun1 === 'Year'){//연도별 예로 5/5일부터 시작해도 그 해 데이터를 다 추출함
                TotalMoneyYear(startYear,endYear,startMonth,endMonth,startDay,endDay,code);
            }
            else if(gubun1 === 'Month'){//월별
                TotalMoneyMonth(startYear,endYear,startMonth,endMonth,startDay,endDay,code);
            }
            else if(gubun1 === 'Day'){//일별
                TotalMoneyDay(startYear,endYear,startMonth,endMonth,startDay,endDay,code);
            }
            else{//시간별
                TotalMoneyClock(startYear,endYear,startMonth,endMonth,startDay,endDay,code);
            }
        }
        else{//메뉴별로 반환
            if(gubun1 === 'Year'){//연도별
                TotalMenuYear(startYear,endYear,startMonth,endMonth,startDay,endDay,code);
            }
            else if(gubun1 === 'Month'){//월별
                TotalMenuMonth(startYear,endYear,startMonth,endMonth,startDay,endDay,code);
            }
            else if(gubun1 === 'Day'){//일별
                TotalMenuDay(startYear,endYear,startMonth,endMonth,startDay,endDay,code)
            }
            else{//시간별
                TotalMenuClock(startYear,endYear,startMonth,endMonth,startDay,endDay,code);
            }

        }
     }
     //매장만
     //inout값이 1인 것만
     else if(gubun3 === 'Store'){
        if(gubun2 === 'Money'){//토탈금액 반환
            if(gubun1 === 'Year'){//연도별
                OtherMoneyYear(startYear,endYear,startMonth,endMonth,startDay,endDay,code,1);

            }
            else if(gubun1 === 'Month'){//월별
                //gubun3이 store이므로 other 값을 1로 세팅
                OtherMoneyMonth(startYear,endYear,startMonth,endMonth,startDay,endDay,code,1);
            }
            else if(gubun1 === 'Day'){//일별
                OtherMoneyDay(startYear,endYear,startMonth,endMonth,startDay,endDay,code,1);
            }
            else{//시간별
                OtherMoneyClock(startYear,endYear,startMonth,endMonth,startDay,endDay,code,1);
            }
        }
        else{//메뉴주문량 반환
            if(gubun1 === 'Year'){//연도별
                OtherMenuYear(startYear,endYear,startMonth,endMonth,startDay,endDay,code,1);
            }
            else if(gubun1 === 'Month'){//월별
                //gubun3이 store이므로 other 값을 1로 세팅
                OtherMenuMonth(startYear,endYear,startMonth,endMonth,startDay,endDay,code,1);
            }
            else if(gubun1 === 'Day'){//일별
                OtherMenuDay(startYear,endYear,startMonth,endMonth,startDay,endDay,code,1);
            }
            else{//시간별
                OtherMenuClock(startYear,endYear,startMonth,endMonth,startDay,endDay,code,1)
            }
        }
     }
     //앱주문
     //inout = 0
     else{
        if(gubun2 === 'Money'){//토탈 금액 반환
            if(gubun1 === 'Year'){//연도별
                OtherMoneyYear(startYear,endYear,startMonth,endMonth,startDay,endDay,code,0);
            }
            else if(gubun1 === 'Month'){//월별
                //gubun3이 total이나 store가 아니므로 other 값을 0으로 세팅
                OtherMoneyMonth(startYear,endYear,startMonth,endMonth,startDay,endDay,code,0);
            }
            else if(gubun1 === 'Day'){//일별
                OtherMoneyDay(startYear,endYear,startMonth,endMonth,startDay,endDay,code,0);
            }
            else{//시간별
                OtherMoneyClock(startYear,endYear,startMonth,endMonth,startDay,endDay,code,0);
            }
        }
        else{//메뉴당 주문량 반환
            if(gubun1 === 'Year'){//연도별
                OtherMenuYear(startYear,endYear,startMonth,endMonth,startDay,endDay,code,0);
            }
            else if(gubun1 === 'Month'){//월별
                //gubun3이 total이나 store가 아니므로 other 값을 0으로 세팅
                OtherMenuMonth(startYear,endYear,startMonth,endMonth,startDay,endDay,code,0);
            }
            else if(gubun1 === 'Day'){//일별
                OtherMenuDay(startYear,endYear,startMonth,endMonth,startDay,endDay,code,0);
            }
            else{//시간별
                OtherMenuClock(startYear,endYear,startMonth,endMonth,startDay,endDay,code,0);
            }
        }
     }
 });

module.exports = router;