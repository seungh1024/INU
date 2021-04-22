require('dotenv').config();

module.exports ={
  "development": {
    "username": "nodejs",
    "password": process.env.SEQUELIZE_PASSWORD,
    "database": "project",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "dialectOptions":{
      useUTC:false,
    },
    "timezone":"+09:00"
  },
  "test": {
    "username": "root",
    "password": process.env.SEQUELIZE_PASSWORD,
    "database": "project_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": process.env.SEQUELIZE_PASSWORD,
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
