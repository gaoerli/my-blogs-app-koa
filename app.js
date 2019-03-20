const Koa = require("koa");

const bodyparser = require("koa-bodyparser"); //koa-bodyParser 解析body中间件,通过post来传递表单数据,通过koa中this.body获取数据
const cors = require("koa2-cors"); //允许跨域;
const path = require("path"); //使用path模块连接路径;
const Static = require("koa-static"); // koa-static 静态资源请求中间件,静态资源css,html, pug;
const config = require("./config/default");

const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const logger = require("koa-logger");
// 路由
const app = new Koa();

const index = require("./routes/index");
const users = require("./routes/users");
const register = require("./routes/register");

//跨域(配置响应头)
app.use(cors());
app.use(
  cors({
    origin: function(ctx) {
      return "*"; // 允许来自所有域名请求
    },
    //Access-Control-Allow-Origin
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization"],
    //Access-Control-Expose-Headers
    maxAge: 5,
    //Access-Control-Max-Age
    credentials: true,
    //Access-Control-Allow-Credentials
    allowMethods: ["GET", "POST", "DELETE"],
    //Access-Control-Allow-Methods
    allowHeaders: ["Content-Type", "Authorization", "Accept"],
    //Access-Control-Allow-Headers
    xsrfHeaderName: "X-XSRF-TOKEN" // 默认的
    // `xsrfHeaderName` 是承载 xsrf token 的值的 HTTP 头的名称
    // httpAgent: new http.Agent({ keepAlive: true })
    // `keepAlive` 默认没有启用
  })
);

//post解析
app.use(bodyparser());

//路由配置
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(register.routes(), register.allowedMethods());

// 在端口70监听:
app.listen(config.port);
console.log(`server listen at ${config.port}`);

// error handler
onerror(app);

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"]
  })
);

app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

app.use(
  views(__dirname + "/views", {
    extension: "pug"
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
