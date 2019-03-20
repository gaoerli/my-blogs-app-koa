const router = require("koa-router")();
const md5 = require("md5");
const api = require("../API/api");

// 失败信息
const returnMsg = (ctx, code, res, massage) => {
  ctx.response.status = code;
  ctx.response.body = res;
  console.log("errormsg :", massage);
};

// 注册
router.post("/register", async (ctx, next) => {
  const user = {
    name: ctx.request.body.name,
    password: ctx.request.body.password,
    moment: new Date().getTime()
  };

  await api.getUserByName(user.name).then(async res => {
    switch (res.length) {
      case 0:
        returnMsg(ctx, 500, { message: "用户名已存在" }, "用户名已存在");
        break;

      default:
        await api
          .register([user.name, md5(user.password), user.moment])
          .then(res => {
            returnMsg(ctx, 200, { message: "注册成功" }, "注册成功");
          })
          .catch(error => {
            returnMsg(ctx, 500, { message: error }, "注册失败");
          });
        break;
    }
  });
});

// 登陆
router.post("/login", async (ctx, next) => {
  const user = {
    name: ctx.request.body.name,
    password: ctx.request.body.password
  };

  await api.getUserByName(user.name).then(async res => {
    switch (res.length) {
      case 0:
        returnMsg(ctx, 500, { message: "用户名不存在" }, "用户名不存在");
        break;

      default:
        switch (md5(user.password)) {
          case res[0].password:
            const token = md5(res[0].name + res[0].password);
            await api
              .updateUserTokenById(res[0].id, token)
              .then(res => {
                returnMsg(ctx, 200, { message: "登录成功" }, "登录成功");
              })
              .catch(error => {
                returnMsg(ctx, 500, { message: error }, "登陆失败");
              });
            break;

          default:
            returnMsg(ctx, 500, { message: "登陆失败" }, "登陆失败");
            break;
        }
        break;
    }
  });
});

// 获取作品列表
router.get("/products", async (ctx, next) => {
  console.log("object");
  await api.getAllProdect().then(
    async res => {
      res.length > 0 && returnMsg(ctx, 200, { data: res }, "获取作品成功");
    },
    error => returnMsg(ctx, 500, { message: error }, "获取作品失败")
  );
});

// 更新作品列表
router.post("/updateProduct", async (ctx, next) => {
  const parma = {
    zanPId: ctx.request.body.id,
    zanUId: ctx.request.body.zanUser,
    type: ctx.request.body.type,
    zanNum: ctx.request.body.zanNum,
    moment: new Date().getTime()
  };
  // console.log("ctx.request.body :", ctx.request.body);

  // 1.点赞
  await api
    .insertZanType([parma.zanPId, parma.zanUId, parma.type, parma.moment])
    .then(
      async res => {
        // 2.更新作品
        await api
          .updateProdect(Number(parma.zanPId), parma.zanNum, parma.moment)
          .then(
            // 3.获取所有列表
            async res => {
              await api.getAllProdect().then(async res => {
                returnMsg(ctx, 200, { data: res }, "获取作品成功");
              });
            },
            error => {
              returnMsg(ctx, 500, { message: error }, "获取作品失败");
            }
          );
      },
      error => {
        returnMsg(ctx, 500, { message: error }, "点赞失败");
      }
    );
});

// 删除作品
router.post("/removeProduct", async (ctx, next) => {
  console.group("label");
  const parma = {
    id: ctx.request.body.id
  };

  // 1. 删除作品表
  await api.removeProduct(parma.id).then(
    async res => {
      // 2.删除点赞状态表

      await api.removeZanType(parma.id).then(
        async res => {
          // 3.获取作品列表

          await api.getAllProdect().then(res => {
            returnMsg(ctx, 200, { data: res }, "获取作品成功");
          });
        },
        error => {
          returnMsg(ctx, 500, { message: error }, "获取作品失败");
        }
      );
    },
    error => {
      returnMsg(ctx, 500, { message: error }, "删除作品失败");
    }
  );
});

// .post("/tokenLogin", checkToken, async (ctx, next) => {
//   //查看有没有token有没有过期，没过期就登录
//   await api.tokenLogin(ctx.body).then(async res => {
//     const token = createToken(ctx.body);
//     ctx.body = {
//       userData: res[0],
//       token
//     };
//     ctx.response.status = 200;
//   });
// });

router.get("/", async (ctx, next) => {
  ctx.body = "get 测试连接成功";
});

module.exports = router;
