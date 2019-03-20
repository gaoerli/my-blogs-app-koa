const router = require("koa-router")();

// router.get("/", async (ctx, next) => {
//   await ctx.render("index", {
//     title: "Hello Koa 2!"
//   });
// });

router.get("/string", async (ctx, next) => {
  ctx.body = "koa2 string";
});

router.get("/json", async (ctx, next) => {
  ctx.body = {
    title: "koa2 json"
  };
});

router.get("/register", async (ctx, next) => {
  ctx.body = "get 123456";
});

module.exports = router;
