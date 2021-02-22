const Sequelize =require('sequelize');
const User=require('./user');
//const Comment=require('./comment');

const Store = require('./store');
const Menu = require('./menu');

const env=process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db= {};

const sequelize=new Sequelize(config.database, config.username, config.password, config);
db.sequelize=sequelize;

db.User=User;
db.Store=Store;
db.Menu=Menu;
//db.Comment=Comment;
//db객체에 User와 Commetn모델을 담았음
//db객체를 require하여 두 모델에 접근할 수 있음
User.init(sequelize);
Store.init(sequelize);
Menu.init(sequelize);
//Comment.init(sequelize);
//User.init  Comment.init은 각각의 모델의 static.init메서드를 호출하는 것
//init이 실행되어야 테이블이 모델로 연결됨
User.associate(db);
Store.associate(db);
Menu.associate(db);
//Comment.associate(db);
//다른 테이블과의 관계를 연결하는 associate

module.exports=db;


