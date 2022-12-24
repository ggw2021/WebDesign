// 这是文章分类的路由模块

const express = require('express')
const router = express.Router()

// 导入文章分类的路由处理函数模块
const artCate_handler = require('../router_handler/artcate')

// 获取文章分类列表数据的路由
router.get('/cates', artCate_handler.getArtCates);

module.exports = router