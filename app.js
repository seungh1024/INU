const express = require('express');
const path=require('path');
const morgan=require('morgan');
const nunjucks=require('nunjucks');
const dotenv = require('dotenv');
dotenv.config();
const {sequelize}=require('./models');
//./models 는 ./models/index.js와 같음 폴더내의 index.js파일은 require시 생략가능
//index.js 에 보면 db를 연동할 수 있게 모듈로 만들어 놓음
const usersRouter = require('./routes/users');
const storesRouter = require('./routes/stores');
const menuRouter = require('./routes/menus');
const orderRouter = require('./routes/orders');
const analysisRouter = require('./routes/analysis');
const tablesRouter = require('./routes/tables');
const reserveRouter = require('./routes/reserve');

//const commentsRouter = require('./routes/comments');

const app=express();
app.set('port',process.env.PORT || 3000);
app.set('view engine','html');
nunjucks.configure('views',{
    express:app,
    watch:true,
});
sequelize.sync({force:false})
//index.js에서 db를 불러와서 sync메서드를 사용해 서버 실행 시 MYSQL과 연동되는 것
//force;false 옵션을 true로 설정하면 서버 실행 시마다 테이블을 재생성함
//테이블 잘못 만든 경우에 true로 설정함
    .then(()=>{
        console.log('데이터베이스 연결 성공');
    })
    .catch((err)=>{
        console.error(err);
    });
    

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/user',usersRouter);
app.use('/store',storesRouter);
app.use('/menu',menuRouter);
app.use('/order',orderRouter);
app.use('/analysis',analysisRouter);
app.use('/table',tablesRouter);
app.use('/reserve',reserveRouter);


app.use((req,res,next)=>{
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status=404;
    next(error);
});

app.use((err,req,res,next)=>{
    res.locals.message = err.message;
    res.locals.error=process.env.NODE_ENV !=='production'?err:{};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'),()=>{
    console.log(app.get('port'),'번 포트에서 대기 중');
});
