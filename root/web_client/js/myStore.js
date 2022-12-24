// $(function () {
//     var content = $(".book-store table tbody");
//     // console.log(content);
//     $.ajax({
//         type: "get",
//         url: " /my/getBooksAndBorrow",
//         headers: {
//             Authorization: localStorage.getItem('token'),
//         },
//         success: function (res) {
//             // console.log(res.data);
//             // var books = res.data.books.split('||');
//             // console.log(books);
//             $.ajax({
//                 type: "post",
//                 url: " /api/getMoreBooks",
//                 data: {
//                     books: res.data.books,
//                 },
//                 success: function (res) {
//                     console.log(res);
//                     for (var i = 0; i < res.length; i++) {
//                         var tr = $("<tr></tr>");
//                         for (var k in res[i]) {
//                             // console.log(k);
//                             // console.log(res[i][k]);
//                             if (k === 'id') continue;
//                             var td = $("<td></td>");
//                             if (k === 'book_name') {
//                                 td.html('<a>《' + res[i][k] + '》</a>');
//                                 td.data('bookId', res[i]['id']);
//                                 // console.log(td.data('bookId'));
//                             }
//                             else td.html(res[i][k]);
//                             tr.append(td);
//                         }
//                         var td = $("<td></td>");
//                         td.html('<a href="javascript:;">归还</a>');
//                         tr.append(td);
//                         content.append(tr);
//                     }
//                 }
//             });
//         }
//     });
//     //点击书名查看详情
//     $(".book-store table tbody").on('click', 'td', function (e) {
//         var td = $(e.target);
//         td = td.is('a') ? td.parent() : td; //bug 已修复
//         // console.log(td.is('a'));
//         console.log(td.data('bookId'));
//         if (td.data('bookId') != undefined) {
//             sessionStorage.setItem('bookId', td.data('bookId'));
//             $(location).prop('href', 'bookDescription.html');
//         }
//     })
// })

$(function () {
    var content = $(".book-store table tbody");
    var booksNum = 0;
    // console.log(content);
    $.ajax({
        type: "get",
        url: "/my/getBooksAndBorrow",
        headers: {
            Authorization: localStorage.getItem('token'),
        },
        success: function (res) {
            // console.log(res.data);
            // var books = res.data.books.split('||');
            var borrow_time = res.data.borrow_time.split('||');
            var books = res.data.books.split('||');
            // console.log(borrow_time);
            $.ajax({
                type: "post",
                url: "/api/getMoreBooks",
                data: {
                    books: res.data.books,
                },
                success: function (res) {
                    // console.log(res);
                    booksNum = res.length;
                    if (res.length == undefined) $(".pages p").html('共 ' + 0 + ' 本书');
                    else $(".pages p").html('共 ' + res.length + ' 本书');
                    // console.log(borrow_books);
                    for (var i = 0; i < res.length; i++) {
                        for (var j = 0; j < res.length; j++) {
                            // console.log(res[j].id)
                            // console.log(borrow_books[i])
                            // console.log('ok');
                            if (res[j].id == books[i]) {
                                var tr = $("<tr></tr>");
                                for (var k in res[j]) {
                                    // console.log(k);
                                    // console.log(res[i][k]);
                                    if (k === 'id') continue;
                                    var td = $("<td></td>");
                                    if (k === 'book_name') {
                                        td.html('<a>《' + res[j][k] + '》</a>');
                                        td.data('bookId', res[j]['id']);
                                        // console.log(td.data('bookId'));
                                    }
                                    else td.html(res[j][k]);
                                    tr.append(td);
                                }
                                var td = $("<td></td>");
                                td.html('<a href="javascript:;">归还</a>');
                                td.data('borrowId', res[j]['id']);
                                // console.log(res[j]['id']);
                                tr.append(td);
                                content.append(tr);
                            }
                            // console.log(borrow_books[i])
                        }

                    }
                }
            });
        }
    });
    //点击书名查看详情
    $(".book-store table tbody").on('click', 'td', function (e) {
        var td = $(e.target);
        td = td.is('a') ? td.parent() : td; //bug 已修复
        // console.log(td.is('a'));
        // console.log(td.data('bookId'));
        if (td.data('bookId') != undefined) {
            sessionStorage.setItem('bookId', td.data('bookId'));
            $(location).prop('href', 'bookDescription.html');
        }
        if (td.data('borrowId') != undefined) {
            //更新共 条记录
            booksNum--;
            $(".pages p").html('共 ' + booksNum + ' 本书');
            // console.log(td.data('borrowId'));
            // alert(td.data('borrowId'));
            var date = new Date();
            var m = date.getMonth() + 1;
            var d = date.getDate();
            var h = date.getHours();
            var mns = date.getMinutes();
            m = m < 10 ? '0' + m : m;
            d = d < 10 ? '0' + d : d;
            h = h < 10 ? '0' + h : h;
            mns = mns < 10 ? '0' + mns : mns;
            const time = date.getFullYear() + "-"
                + m + "-"
                + d + " "
                + h + ":"
                + mns;
            // alert(time)
            $.ajax({
                type: "post",
                url: "/my/borrowOrReturnOneBook",
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
                data: {
                    id: td.data('borrowId'),
                    borrow_time: '-'+time,
                },
                success: function (res) {
                    // console.log(res);
                    if (res.message === '身份认证失败!' && res.status == 1) {
                        logout();
                    }
                    if (res.status == 0) {
                        alert('归还成功！');
                        td.parent().remove();
                    }
                }
            });
        }
    })
    //搜索
    var content = $(".book-store table tbody");
    $(".shutcut .search button").click(function () {
        // $(location).prop('href', 'search.html');
        content.empty();
        var search = $(".shutcut .search input");
        var searchcontent = search.val();
        //加载搜索结果
        if (searchcontent != '请输入书名...') {
            sessionStorage.setItem('searchcontent', searchcontent);
            $(location).prop('href', 'search.html');
        }
    })
})