//导入express
const express = require('express');
//创建服务器实例对象
const app = express();

//导入定义规则的包
const joi = require('joi');

//导入并配置cors跨域中间件
const cors = require('cors');
app.use(cors());

//handle request entity too large
var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//配置解析表单数据中间件，(只能解析x-www-form-urlencoded格式的表单数据)
app.use(express.urlencoded({ extended: false }));

//一定要在路由之前配置 Token 的中间件
const expressJWT = require('express-jwt');
const config = require('./schema/config');
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({
    path: [/^\/api/,
        "/", "/index.html", "/bookDescription.html",
        "/bookStore.html", "/borrow_records.html",
        "/change.html", "/login.html",
        "/message.html", "/my_pic.html",
        "/myStore.html", "/nickname.html",
        "/register.html", "/search.html",
        /^\/pages/,
        /^\/css/,
        /^\/fonts/,
        /^\/images/,
        /^\/js/,
        /^\/upload/
    ]
}));


//导入并使用user路由模块
const userRouter = require('./router/user');
app.use('/api', userRouter);
//导入并使用 用户信息 路由模块
const userinfoRouter = require('./router/userinfo');
app.use('/my', userinfoRouter);
// 导入并使用文章分类的路由模块
const artCateRouter = require('./router/artcate');
app.use('/my/article', artCateRouter);

//静态托管
app.use(express.static('../web_client'));

//定义错误级别的中间件
app.use((err, req, res, next) => {
    //验证失败导致的错误
    if (err instanceof joi.ValidationError) {
        return res.send({
            status: 1,
            message: err.message,
        });
    }
    //身份认证失败后的错误
    if (err.name === 'UnauthorizedError') {
        return res.send({
            status: 1,
            message: '身份认证失败!',
        });
    }
    return res.send({
        status: 1,
        message: err.message,
    });
});

//启动服务器
app.listen(80, () => {
    console.log('api server running at http://192.168.56.1');
});
