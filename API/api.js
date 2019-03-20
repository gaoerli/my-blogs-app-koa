const query = require("../lib/mysql");

const api = {
  /***********用户API ***********/
  getUserByName: name => {
    // 查找用户
    let _sql = `select * from users where name="${name}"`;
    return query(_sql);
  },

  register: value => {
    console.log("value", value);
    // 注册
    let _sql = `insert into users set name=?,password=?,moment=?;`;
    return query(_sql, value);
  },

  updateUserTokenById: (id, token) => {
    let _sql = `UPDATE users SET token ='${token}' WHERE id = ${id}`;
    return query(_sql);
  },

  getAllProdect: () => {
    let _sql =
      "select p.id , p.`name` `name`,p.uId, p.zanNum, u.`name` `uName`, p.moment from products p left join users u on p.uId = u.id;";
    return query(_sql);
  },

  // 新增点赞状态
  insertZanType: value => {
    let _sql = `insert into zantype set zanPId=?, zanUId=?, type=?, moment=?;`;
    return query(_sql, value);
  },

  // 更新作品表
  updateProdect: (id, zanNum, moment) => {
    // console.log("moment", moment);
    let _sql = `UPDATE products SET zanNum ='${zanNum}', moment='${moment}'  WHERE id=${id}`;
    return query(_sql);
  },

  //删除作品
  removeProduct: id => {
    let _sql = `DELETE FROM products where id="${id}"`;
    return query(_sql);
  },

  // 删除点赞状态
  removeZanType: zanPId => {
    let _sql = `DELETE FROM zantype where zanPId="${zanPId}"`;
    return query(_sql);
  }
};

module.exports = api;

// let register =

// 获取用户基本信息
let getDataInfo = () => query(`select * from productionList`);

//修改用户点赞id
let modificationZanProductionId = newZanProductionId => {
  let _sql;
  if (newZanProductionId.zanProductionId != null) {
    _sql = `UPDATE users SET  zanProductionId = '${
      newZanProductionId.zanProductionId
    }' WHERE id = ${newZanProductionId.userId}`;
  } else {
    _sql = `UPDATE users SET  zanProductionId = ${
      newZanProductionId.zanProductionId
    } WHERE id = ${newZanProductionId.userId}`;
  }
  return query(_sql);
};

//更新用户点赞数量
let updateProduction = production => {
  let _sql;
  _sql = `UPDATE productionList SET  zan = '${production.zan}' WHERE id = ${
    production.id
  }`;
  return query(_sql);
};

//增加说说
let addProduction = production => {
  let _sql = `INSERT INTO productionList(userName,describeMsg,zan) VALUES('${
    production[0]
  }','${production[1]}','${production[2]}');`;
  return query(_sql);
};

//查找最后添加到数据库的id
let selectLastId = () => {
  return query(`SELECT LAST_INSERT_ID()`);
};

//更新用户数据（发送id）
let addSendProductionId = value => {
  let _sql;
  _sql = `UPDATE users SET  sendProductionId = '${value[0]}' WHERE id = ${
    value[1]
  }`;
  return query(_sql);
};

//查找用户发送的id
let selectSendId = id => {
  let _sql = `select sendProductionId from users where id="${id}";`;
  return query(_sql);
};

//根据id找用户
let tokenLogin = id => {
  let _sql = `select * from users where id="${id}";`;
  return query(_sql);
};

//更新发送说说
let updateSendProduction = production => {
  let _sql;
  _sql = `UPDATE users SET  sendProductionId = '${production[1]}' WHERE id = ${
    production[0]
  }`;
  return query(_sql);
};

//删除说说
let removeProduction = productionId => {
  let _sql = `DELETE FROM productionList where id="${productionId}"`;
  return query(_sql);
};

// //用户登录校验
// userLogin: function (username) {
//     return query(`SELECT * FROM user WHERE username = '${username}'`);
// },
// //用户ID全局化
// initUserId: function (userId) {
//     status.userId = userId;
// },
// //获取用户基本信息
// getUserInfo: function () {
//     return query(`SELECT * FROM userinfos WHERE userId = ${status.userId}`);
// },
// //获取用户订单信息
// getUserOrders: function (type) {
//     let sql;
//     if (type === '0') {
//         sql = `SELECT * FROM orders WHERE userId = ${status.userId} ORDER BY orderTime DESC`;
//     }
//     else {
//         sql = `SELECT * FROM orders WHERE orderType = ${type} AND userId = ${status.userId} ORDER BY orderTime DESC`;
//     }
//     return query(sql);
// }
