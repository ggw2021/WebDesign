const express = require('express');
const router = express.Router();

//导入用户路由处理函数模块
const user_handler = require('../router_handler/user');

// 1. 导入验证数据的中间件
const expressJoi = require('@escook/express-joi');
// 2. 导入需要的验证规则对象
const { register_schema,login_schema } = require('../schema/user');

// 注册新用户
router.post('/reguser', expressJoi(register_schema), user_handler.regUser);
//登录
router.post('/login', expressJoi(login_schema), user_handler.login);
//获取图书数量
router.get('/getBooksNum', user_handler.getBooksNum);
//获取一本图书
router.post('/getOneBook', user_handler.getOneBook);
//获取多本图书
router.post('/getMoreBooks', user_handler.getMoreBooks);
//获取某页图书
router.post('/getBooks', user_handler.getBooks);
//获取图书图片
router.get('/getBookPics', user_handler.getBookPics);
//获取热门图书图片和简介
router.get('/getTopBookPicsAndDesc', user_handler.getTopBookPicsAndDesc);
//搜索书
router.post('/searchBooks', user_handler.searchBooks);
module.exports = router;