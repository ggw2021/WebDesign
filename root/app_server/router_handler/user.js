//导入数据库操作模块
const db = require('../db/index');
//导入bcryptjs
const bcryptjs = require('bcryptjs');
//导入生成token的包
const jwt = require('jsonwebtoken');
//导入全局配置文件 密钥
const config = require('../schema/config');

//注册处理函数
exports.regUser = (req, res) => {
    //获取用户端提交到服务器的信息
    const userinfo = req.body;
    // console.log(userinfo);
    //对表单数据进行合法性校验
    // if (!userinfo.username || !userinfo.password) {
    //     return res.send({
    //         status: 1,
    //         message: '用户名或密码不合法！'
    //     })
    // }
    // 定义SQL语句，查询用户名是否被占用
    const sqlStr = 'select * from ev_users where username=?';
    db.query(sqlStr, userinfo.username, (err, results) => {
        //执行SQL语句失败
        if (err) {
            return res.send({
                status: 1,
                message: err.message
            })
        }
        // console.log(results);
        //判断用户名是否被占用
        if (results.length > 0) {
            return res.send({
                status: 1,
                message: '用户名被占用， 请更换其他用户名！'
            })
        }
        //todo:用户名可用
        //调用bcryptjs.hashSync()对密码加密
        // console.log(userinfo);
        if (userinfo.password !== userinfo.again) {
            return res.send({
                status: 1,
                message: '与初始密码不相同',
            })
        }
        userinfo.password = bcryptjs.hashSync(userinfo.password, 10);
        // console.log(userinfo);
        //定义插入SQL语句
        const sql = 'insert into ev_users set ?'
        //注册
        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            //判断SQL语句是否成功
            if (err) return res.send({ status: 1, message: err.message });
            // 影响行数是否为1
            if (results.affectedRows !== 1) return res.send({ status: 1, message: '注册用户失败，稍后再试' });
            //注册成功
            res.send({ status: 0, message: '注册成功' });
        })
    })

    // res.send('reguser OK');
}


//登录处理函数
exports.login = (req, res) => {
    //获取用户信息
    const userinfo = req.body;
    //定义sql语句
    const sql = 'select * from ev_users where username=?';
    //执行sql语句，根据用户名查询用户信息
    db.query(sql, userinfo.username, (err, results) => {
        //执行SQL语句失败
        if (err) {
            return res.send({
                status: 1,
                message: err.message,
            })
        }
        //执行成功，但是获取条数不等于1
        if (results.length !== 1) {
            return res.send({
                status: 1,
                message: '用户名不存在',
            })
        }
        //todo: 判断密码是否正确
        const compareResult = bcryptjs.compareSync(userinfo.password, results[0].password);
        if (!compareResult) {
            return res.send({
                status: 1,
                message: '密码错误',
            })
        }
        //todo: 在服务器端生成token字符串
        const user = { ...results[0], password: null, user_pic: null }
        // console.log(user);
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn });
        //登录成功
        results[0].id = null;
        results[0].password = null;
        return res.send({
            status: 0,
            message: '登录成功',
            token: 'Bearer ' + tokenStr,
            user: results[0],
        })

    })
}
//获取图书数量
exports.getBooksNum = (req, res) => {
    const sql = 'SELECT count(id) as num FROM my_db_01.ev_books_store'
    db.query(sql, (err, results) => {
        //执行SQL语句失败
        if (err) {
            return res.send({
                status: 1,
                message: err.message
            })
        }
        if (results.length < 1) {
            return res.send({ status: 1, message: '没有书籍' });
        }
        res.send(results);
    })
}
//获取一本图书
exports.getOneBook = (req, res) => {
    // console.log(req.body.id);
    const sql = 'SELECT book_name,book_author,book_pic,book_description,id FROM my_db_01.ev_books_store where id =' + req.body.id + '';
    db.query(sql, (err, results) => {
        //执行SQL语句失败
        if (err) {
            return res.send({
                status: 1,
                message: err.message
            })
        }
        if (results.length < 1) {
            return res.send({ status: 1, message: '没有书籍' });
        }
        res.send(results[0]);
    })
}
//获取多本图书
exports.getMoreBooks = (req, res) => {
    // console.log(req.body.books);
    var books = req.body.books.split('||');
    // console.log(books);
    var sql = 'SELECT book_name,book_author,id FROM my_db_01.ev_books_store where id =' + books[0];
    for (var i = 1; i < books.length; i++) {
        sql += '|| id=' + books[i];
    }
    // console.log(sql);
    db.query(sql, (err, results) => {
        //执行SQL语句失败
        if (err) {
            return res.send({
                status: 1,
                message: err.message
            })
        }
        if (results.length < 1) {
            return res.send({ status: 1, message: '没有书籍' });
        }
        res.send(results);
    })
}
//获取图书
exports.getBooks = (req, res) => {
    // console.log(req.body.page);
    const sql = 'SELECT book_name,book_author,book_borrowNum,book_remainNum,id FROM my_db_01.ev_books_store limit ' + (req.body.page - 1) * 17 + ',17';
    db.query(sql, (err, results) => {
        //执行SQL语句失败
        if (err) {
            return res.send({
                status: 1,
                message: err.message
            })
        }
        if (results.length < 1) {
            return res.send({ status: 1, message: '没有书籍' });
        }
        res.send(results);
    })
}

//获取图书图片
exports.getBookPics = (req, res) => {
    const sql = 'SELECT book_pic FROM my_db_01.ev_books_store where id <= 20'
    db.query(sql, (err, results) => {
        //执行SQL语句失败
        if (err) {
            return res.send({
                status: 1,
                message: err.message
            })
        }
        if (results.length < 1) {
            return res.send({ status: 1, message: '没有书籍' });
        }
        // res.header('Access-Control-Allow-Origin', '*');
        res.send(results);
    })
}

//获取热门图书图片和简介
exports.getTopBookPicsAndDesc = (req, res) => {
    const sql = 'SELECT id,book_pic,book_description FROM my_db_01.ev_books_store order by book_borrowNum desc limit 0,5'
    db.query(sql, (err, results) => {
        //执行SQL语句失败
        if (err) {
            return res.send({
                status: 1,
                message: err.message
            })
        }
        if (results.length < 1) {
            return res.send({ status: 1, message: '没有足够的书籍' });
        }
        res.send(results);
    })
}

//搜索书
exports.searchBooks = (req, res) => {
    const sql = 'SELECT book_name,book_author,book_borrowNum,book_remainNum,id FROM my_db_01.ev_books_store where book_name like "%'+req.body.search+'%"'
    db.query(sql, (err, results) => {
        //执行SQL语句失败
        if (err) {
            return res.send({
                status: 1,
                message: err.message
            })
        }
        if (results.length < 1) {
            return res.send({ status: 1, message: '没有足够的书籍' });
        }
        res.send({
            status: 0,
            message: '搜索成功',
            data: results,
        });
    })
}