const express = require('express');
const router = express.Router();

//挂载路由

//导入路由处理函数模块
const userinfo_handler = require('../router_handler/userinfo')

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi');
// 导入需要的验证规则对象
const { update_userinfo_schema,
    update_password_schema,
    update_avatar_schema,
    comment_schema } = require('../schema/user');

//获取用户借阅以及已有书籍信息的路由
router.get('/getBooksAndBorrow', userinfo_handler.getBooksAndBorrow);
//借阅或者归还一本书
router.post('/borrowOrReturnOneBook', userinfo_handler.borrowOrReturnOneBook);
// 更新用户信息的路由
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo);
// 更新密码的路由
router.post('/updatepwd', expressJoi(update_password_schema), userinfo_handler.updatePassword);
// 更换头像的路由
router.post('/update/avatar', expressJoi(update_avatar_schema), userinfo_handler.updateAvatar);
//获取头像的路由
router.get('/getAvatar', userinfo_handler.getAvatar);
//更新评论
router.post('/updateComments', expressJoi(comment_schema), userinfo_handler.updateComment);
//获取评论
router.get('/getComments', userinfo_handler.getComments);


module.exports = router;
