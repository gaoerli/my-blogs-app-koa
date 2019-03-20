const mysql = require("mysql");
const config = require("../config/default");

// 连接数据库
let pool = mysql.createPool({
  host: config.database.HOST,
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE
});

//sql查询
let query = function(sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        resolve(err);
      } else {
        connection.query(sql, values, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
          connection.release();
        });
      }
    });
  });
};

// sql
let users = `create table if not exists users(
     id INT NOT NULL AUTO_INCREMENT COMMENT "用户Id",
     name VARCHAR(100) NOT NULL COMMENT "用户名",
     password VARCHAR(100) NOT NULL COMMENT "密码",
     moment VARCHAR(100) NOT NULL COMMENT "时间",
     token VARCHAR(100) COMMENT "秘钥",
     PRIMARY KEY ( id )
    );`;

let products = `create table if not exists products(
     id INT NOT NULL AUTO_INCREMENT COMMENT "作品id",
     name VARCHAR(100) NOT NULL COMMENT "作品名称",
     uId INT NOT NULL COMMENT "用户Id",
     zanNum double NOT NULL DEFAULT '0' COMMENT "点赞数量",
     moment VARCHAR(100) NOT NULL COMMENT "创建时间",
     PRIMARY KEY ( id )
    );`;

let zanType = `create table if not exists zanType(
     id INT NOT NULL AUTO_INCREMENT,
     pId INT NOT NULL COMMENT "作品Id",
     uId INT NOT NULL COMMENT "用户Id",
     type VARCHAR(100) NOT NULL DEFAULT 'false' COMMENT "点赞状态",
     moment VARCHAR(100) NOT NULL COMMENT "创建时间",
     PRIMARY KEY ( id )
    );`;

let createTable = function(sql) {
  return query(sql, []);
};

createTable(users); // 创建用户表
createTable(products); // 创建作品表
createTable(zanType); // 创建点赞状态表

module.exports = query;
