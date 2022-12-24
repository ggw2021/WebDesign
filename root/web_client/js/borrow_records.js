$(function () {
    var content = $(".book-store table tbody");
    // console.log(content);
    $.ajax({
        type: "get",
        url: "/my/getBooksAndBorrow",
        headers: {
            Authorization: localStorage.getItem('token'),
        },
        success: function (res) {
            // if (res.message === '身份认证失败!' && res.status == 1) {
            //     logout();
            // }
            // console.log(res.data);
            // var books = res.data.books.split('||');
            var borrow_time = res.data.borrow_time.split('||');
            var borrow_books = res.data.borrow_books.split('||');
            // console.log(borrow_time);
            $.ajax({
                type: "post",
                url: "/api/getMoreBooks",
                data: {
                    books: res.data.borrow_books,
                },
                success: function (res) {
                    // console.log(res);
                    // console.log(borrow_books);
                    $(".pages p").html('共 ' + borrow_books.length + ' 条记录');
                    // console.log($(".page p")); alert('s');
                    for (var i = 0; i < borrow_books.length; i++) {
                        for (var j = 0; j < res.length; j++) {
                            // console.log(res[j].id)
                            // console.log(borrow_books[i])
                            // console.log('ok');
                            if (res[j].id == borrow_books[i]) {
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
                                if (borrow_time[i][0] == '-') {
                                    var str = borrow_time[i];
                                    var newstr = str.slice(1, str.length);
                                    td.html(newstr + ' 归还');
                                }
                                else {
                                    td.html(borrow_time[i] + ' 借阅');
                                }
                                tr.append(td);
                                content.prepend(tr);
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