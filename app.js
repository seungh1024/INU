const express = require('express');
const path=require('path');
const morgan=require('morgan');
const nunjucks=require('nunjucks');

const {sequelize}=require('./models');
//./models 는 ./models/index.js와 같음 폴더내의 index.js파일은 require시 생략가능
//index.js 에 보면 db를 연동할 수 있게 모듈로 만들어 놓음
const indexRouter=require('./routes');
const usersRouter = require('./routes/users');
const storesRouter = require('./routes/stores');
const menuRouter = require('./routes/menus');
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

app.use('/',indexRouter);
app.use('/users',usersRouter);
app.use('/stores',storesRouter);
app.use('/menus',menuRouter);
//app.use('/comments',commentsRouter);

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
//-----------------------------------------------------3000포트//
const appexpress = require('express');
const apppath=require('path');
const appmorgan=require('morgan');
const appnunjucks=require('nunjucks');

const appindexRouter=require('./userroutes');
const appusersRouter = require('./userroutes/users');
const appstoresRouter = require('./userroutes/stores');

const appuser=appexpress();
appuser.set('port2',process.env.PORT || 4000);
appuser.set('view engine','html');
appnunjucks.configure('views',{
    express:appuser,
    watch:true,
});

    

appuser.use(appmorgan('dev'));
appuser.use(express.static(apppath.join(__dirname, 'public2')));
appuser.use(express.json());
appuser.use(express.urlencoded({extended:false}));


appuser.use('/',appindexRouter);
appuser.use('/users',appusersRouter);
appuser.use('/stores',appstoresRouter);
//app.use('/comments',commentsRouter);


appuser.use((req,res,next)=>{
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status=404;
    next(error);
});

appuser.use((err,req,res,next)=>{
    res.locals.message = err.message;
    res.locals.error=process.env.NODE_ENV !=='production'?err:{};
    res.status(err.status || 500);
    res.render('error');
});


app.listen(app.get('port'),()=>{
    console.log(app.get('port'),'번 포트에서 대기 중');
});

appuser.listen(appuser.get('port2'),()=>{
    console.log(appuser.get('port2'),'번 포트에서 대기 중');
});