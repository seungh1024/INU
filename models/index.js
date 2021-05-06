const Sequelize =require('sequelize');
const User=require('./user');

const Store = require('./store');
const Menu = require('./menu');
const Order = require('./order');//주문테이블
const Analysis = require('./analysis');
const Reserve = require('./reserve');

const env=process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db= {};

const sequelize=new Sequelize(config.database, config.username, config.password, config);
db.sequelize=sequelize;

db.User=User;
db.Store=Store;
db.Menu=Menu;
db.Order = Order;
db.Analysis = Analysis;
db.Reserve = Reserve;

User.init(sequelize);
Store.init(sequelize);
Menu.init(sequelize);
Order.init(sequelize);
Analysis.init(sequelize);
Reserve.init(sequelize);

User.associate(db);
Store.associate(db);
Menu.associate(db);
Order.associate(db);
Analysis.associate(db);
Reserve.associate(db);

module.exports=db;


