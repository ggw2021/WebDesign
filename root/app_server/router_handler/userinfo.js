// 导入数据库操作模块
const db = require('../db/index')
// 导入处理密码的模块
const bcrypt = require('bcryptjs')

// 获取用户借阅以及已有书籍信息的处理函数
exports.getBooksAndBorrow = (req, res) => {
    // 定义查询用户信息的 SQL 语句
    const sql = `select books,borrow_time,borrow_books from ev_users where id=?`
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, req.user.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) {
            return res.send({
                status: 1,
                message: err.message,
            })
        }
        // 执行 SQL 语句成功，但是查询的结果可能为空
        if (results.length !== 1) {
            return res.send({
                status: 1,
                message: '获取书籍失败！',
            })
        }
        // 用户信息获取成功
        res.send({
            status: 0,
            message: '获取书籍成功！',
            data: results[0],
        })
    })
}

//借阅或者归还一本书
exports.borrowOrReturnOneBook = (req, res) => {
    // console.log(req.body.borrow_time);
    //还书
    
    const Sql = 'select books,borrow_time,borrow_books from ev_users where id=?';
    db.query(Sql, req.user.id, (err, r) => {
        // 执行 SQL 语句失败
        if (err) {
            return res.send({
                status: 1,
                message: err.message,
            })
        }
        // console.log(results);
        // 执行 SQL 语句成功，但是影响行数不等于 1
        if (r.length !== 1) {
            return res.send({
                status: 1,
                message: '查询用户的基本信息失败！',
            })
        }
        
        // res.send(r[0]);
        // console.log('-----------------');
        // console.log(req.body);console.log(req.body.borrow_time[0] == '-');
        if (req.body.borrow_time[0] == '-') {
            // console.log(r[0].borrow_time);
            // console.log('-----------------');
            // if (r[0].borrow_time == NULL) console.log('-----------------');
            if (r[0].borrow_time == null || r[0].borrow_time.length == 0) r[0].borrow_time = '' +req.body.borrow_time;
            else r[0].borrow_time += '||' + req.body.borrow_time;

            if (r[0].borrow_books == null || r[0].borrow_books.length == 0) r[0].borrow_books = '' +req.body.id;
            else r[0].borrow_books += '||' + req.body.id;
            // console.log(r[0].borrow_time);
            
            if (r[0].books != null) {
                var books = r[0].books.split('||');
                // console.log(books);
                for (var i = 0; i < books.length; i++) {
                    if (req.body.id == books[i]) {
                        // console.log(books[i]);
                        books.splice(i, 1);
                        break;
                    }
                }
                r[0].books = books.join('||');
            }
            // console.log(r[0].books);
        }
        //借书
        else {
            // console.log(r[0].books == null);
            if (r[0].books != null) {
                // console.log('1-----------------');
                var books = r[0].books.split('||');
                // console.log(books);
                for (var i = 0; i < books.length; i++) {
                    if (req.body.id == books[i]) {
                        // console.log(books[i]);
                        return res.send({
                            status: 1,
                            message: '只能借阅一本',
                        })
                        break;
                    }
                }
            }
            // console.log(r[0].books);
            // if (r[0].books == null) console.log('2-----------------');
            if (r[0].books == null || r[0].books.length == 0) r[0].books = '' + req.body.id;
            else r[0].books += '||' + req.body.id;

            if (r[0].borrow_time == null || r[0].borrow_time.length == 0) r[0].borrow_time = '' +req.body.borrow_time;
            else r[0].borrow_time += '||' + req.body.borrow_time;

            if (r[0].borrow_books == null || r[0].borrow_books.length == 0) r[0].borrow_books = '' +req.body.id;
            else r[0].borrow_books += '||' + req.body.id;

        }
        //修改数据库内容
        const sql_books = 'select book_borrowNum,book_remainNum from ev_books_store where ev_books_store.id=?';
        db.query(sql_books, req.body.id, (err, results_books) => {
            // console.log(results_books);   
            // 执行 SQL 语句失败
            if (err) {
                return res.send({
                    status: 1,
                    message: err.message,
                })
            }
            // console.log(results);
            // 执行 SQL 语句成功，但是影响行数不等于 1
            if (results_books.length !== 1) {
                return res.send({
                    status: 1,
                    message: '获取书籍失败！',
                })
            }
            // 成功
            // console.log('-----------------------');
            // console.log(results_books[0].book_remainNum);
            if (req.body.borrow_time[0] == '-') {
                //还书
                // console.log('还书');
                results_books[0].book_remainNum++;
            }
            else {
                //借书
                // console.log('借书');
                if (results_books[0].book_remainNum < 1) {
                    return res.send({
                        status: 1,
                        message: '库存不足',
                    })
                }
                else {
                    results_books[0].book_remainNum--;
                    results_books[0].book_borrowNum++;
                }
            }
            // console.log(results_books[0].book_remainNum);
            // console.log('-----------------------');
            // console.log(results_books[0]);
            const sql_updateBooks = 'update ev_books_store SET book_borrowNum = ' + results_books[0].book_borrowNum
                + ', book_remainNum = ' + results_books[0].book_remainNum + ' where id = ' + req.body.id;
            // console.log(sql_updateBooks);
            db.query(sql_updateBooks, (err, results) => {
                // 执行 SQL 语句失败
                if (err) {
                    return res.send({
                        status: 1,
                        message: err.message,
                    })
                }
                // console.log(results);
                // 执行 SQL 语句成功，但是影响行数不等于 1
                if (results.affectedRows !== 1) {
                    return res.send({
                        status: 1,
                        message: '更新图书的基本信息失败！',
                    })
                }
                // 成功 
                // console.log('更新图书的基本信息成功');
            })
            const sql_users = 'update ev_users set books=?,borrow_time=?,borrow_books=? where id=?';
            db.query(sql_users, [r[0].books, r[0].borrow_time, r[0].borrow_books, req.user.id], (err, results) => {
                // 执行 SQL 语句失败
                if (err) {
                    return res.send({
                        status: 1,
                        message: err.message,
                    })
                }
                // console.log(results);
                // 执行 SQL 语句成功，但是影响行数不等于 1
                if (results.affectedRows !== 1) {
                    return res.send({
                        status: 1,
                        message: '更新用户的基本信息失败！',
                    })
                }
                // 成功
                return res.send({
                    status: 0,
                    message: '操作成功！',
                    data: 'results[0]',
                })
            })
        })

    })

    // res.send(req.user);
    // const sql = 'SELECT id,book_pic,book_description FROM my_db_01.ev_books_store order by book_borrowNum desc limit 0,5'
    // db.query(sql, (err, results) => {
    //     //执行SQL语句失败
    //     if (err) {
    //         return res.send({
    //             status: 1,
    //             message: err.message
    //         })
    //     }
    //     if (results.length < 1) {
    //         return res.send({ status: 1, message: '没有足够的书籍' });
    //     }
    //     res.send(results);
    // })
}

// 更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
    // 定义待执行的 SQL 语句
    // console.log('---------------------------------------------------');
    // console.log(req);
    const sql = `update ev_users set nickname=? where id=?`
    // console.log(req.body.id);
    // 调用 db.query() 执行 SQL 语句并传递参数
    db.query(sql, [req.body.nickname, req.user.id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) {
            return res.send({
                status: 1,
                message: err.message,
            })
        }
        // console.log(results);
        // 执行 SQL 语句成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) {
            return res.send({
                status: 1,
                message: '更新用户的基本信息失败！',
            })
        }
        // 成功
        res.send({
            status: 0,
            message: '更新用户信息成功！',
            data: results[0],
        })
    })
}

// 更新用户密码的处理函数
exports.updatePassword = (req, res) => {
    // 根据 id 查询用户的信息
    const sql = `select * from ev_users where id=?`
    // 执行根据 id 查询用户的信息的 SQL 语句
    db.query(sql, req.user.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) {
            return res.send({
                status: 1,
                message: err.message,
            })
        }
        // 判断结果是否存在
        if (results.length !== 1) {
            return res.send({
                status: 1,
                message: '用户不存在！',
            })
        }

        // 判断密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) {
            return res.send({
                status: 1,
                message: '旧密码错误！',
            })
        }

        // 定义更新密码的 SQL 语句
        const sql = `update ev_users set password=? where id=?`
        // 对新密码进行加密处理
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        // 调用 db.query() 执行 SQL 语句
        db.query(sql, [newPwd, req.user.id], (err, results) => {
            // 执行 SQL 语句失败
            if (err) return res.cc(err)
            // 判断影响的行数
            if (results.affectedRows !== 1) {
                return res.send({
                    status: 1,
                    message: '更新密码失败！',
                })
            }
            // 成功
            return res.send({
                status: 0,
                message: '更新密码成功',
            })
        })
    })
}

// 更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
    // 1. 定义更新头像的 SQL 语句
    const sql = `update ev_users set user_pic=? where id=?`
    // 2. 调用 db.query() 执行 SQL 语句
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) {
            return res.send({
                status: 1,
                message: err.message,
            })
        }
        // 影响的行数是否等于 1
        if (results.affectedRows !== 1) {
            return res.send({
                status: 1,
                message: '更换头像失败！',
            })
        }
        // 成功
        return res.send({
            status: 0,
            message: '更换头像成功！',
        })
    })
}

exports.getAvatar = (req, res) => {
    const sql = `SELECT user_pic FROM ev_users where id=?`;
    db.query(sql, req.user.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) {
            return res.send({
                status: 1,
                message: err.message,
            })
        }
        // 获取的行数是否等于 1
        if (results.length !== 1) {
            return res.send({
                status: 1,
                message: '获取头像失败！',
            })
        }
        return res.send({
            status: 0,
            message: '获取头像成功！',
            avatar: results[0].user_pic,
        })
    })
}

//更新评论
exports.updateComment = (req, res) => {
    // console.log(req.body);
    const sql = 'insert into ev_comments set ?'
    db.query(sql, req.body, (err, results) => {
        if (err) {
            return res.send({
                status: 1,
                message: err.message
            })
        }
        if (results.affectedRows !== 1) {
            return res.send({ status: 1, message: '更新数据失败' });
        }
        res.send({ status: 0, message: '更新数据成功' });
    })
}

//获取评论
exports.getComments = (req, res) => {
    const sql = 'SELECT u.nickname,c.comment,c.time FROM ev_comments c, ev_users u where c.username = u.username'
    db.query(sql, (err, results) => {
        //执行SQL语句失败
        if (err) {
            return res.send({
                status: 1,
                message: err.message
            })
        }
        if (results.affectedRows < 1) {
            return res.send({ status: 1, message: '没有评论' });
        }
        res.send(results);
    })
}


