$.ajax({
    type: "get",
    url: "/api/getBooksNum",
    success: function (res) {
        // console.log(res);
        var ul = $(".pages ul");
        for (var i = 1; i <= (res[0].num + 1) / 17 + 1; i++) {
            var li = $("<li></li>");
            li.html(i);
            ul.append(li);
        }

        $(".pages ul li:eq(0)").css('background-color', 'rgb(255, 255, 255)');
    }
});
$(function () {
    //读取数据begin
    sessionStorage.setItem('page', 1);
    var content = $(".book-store table tbody");
    $.ajax({
        type: "post",
        url: "/api/getBooks",
        data: {
            page: 1,
        },
        success: function (res) {
            // console.log(res);
            for (var i = 0; i < res.length; i++) {
                var tr = $("<tr></tr>");
                for (var k in res[i]) {
                    // console.log(k);
                    // console.log(res[i][k]);
                    if (k === 'id') continue;
                    var td = $("<td></td>");
                    if (k === 'book_name') {
                        td.html('<a>《' + res[i][k] + '》</a>');
                        td.data('bookId', res[i]['id']);
                        // console.log(td.data('bookId'));
                    }
                    else td.html(res[i][k]);
                    tr.append(td);
                }
                var td = $("<td></td>");
                td.html('<a href="javascript:;">借阅</a>');
                td.data('borrowId', res[i]['id']);
                tr.append(td);
                content.append(tr);
            }
        }
    });
    $(".pages ul").on('click', 'li', function (e) {
        var li = $(e.target);
        sessionStorage.setItem('page', li.html()),
            li.css('background-color', 'rgb(255, 255, 255)').siblings("li").css('background-color', 'rgba(180, 180, 180, .4)');
        content.empty();
        $.ajax({
            type: "post",
            url: "/api/getBooks",
            data: {
                page: sessionStorage.getItem('page'),
            },
            success: function (res) {
                // console.log(res);
                for (var i = 0; i < res.length; i++) {
                    var tr = $("<tr></tr>");
                    for (var k in res[i]) {
                        // console.log(k);
                        // console.log(res[i]['id']);
                        if (k === 'id') continue;
                        var td = $("<td></td>");
                        if (k === 'book_name') {
                            td.html('<a>《' + res[i][k] + '》</a>');
                            td.data('bookId', res[i]['id']);
                            // console.log(td.data('bookId'));
                        }
                        else td.html(res[i][k]);
                        tr.append(td);
                    }
                    var td = $("<td></td>");
                    td.html('<a href="javascript:;">借阅</a>');
                    td.data('borrowId', res[i]['id']);
                    tr.append(td);
                    content.append(tr);
                }
            }
        });
    })
    //读取数据end
    //点击书名查看详情 借阅
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
                    borrow_time: time,
                },
                success: function (res) {
                    // console.log(res);
                    if (res.message === '身份认证失败!' && res.status == 1) {
                        logout();
                    }
                    if (res.status == 0) {
                        alert(res.message);
                        //刷新数据
                        content.empty();
                        $.ajax({
                            type: "post",
                            url: "/api/getBooks",
                            data: {
                                page: sessionStorage.getItem('page'),
                            },
                            success: function (res) {
                                // console.log(res);
                                for (var i = 0; i < res.length; i++) {
                                    var tr = $("<tr></tr>");
                                    for (var k in res[i]) {
                                        // console.log(k);
                                        // console.log(res[i]['id']);
                                        if (k === 'id') continue;
                                        var td = $("<td></td>");
                                        if (k === 'book_name') {
                                            td.html('<a>《' + res[i][k] + '》</a>');
                                            td.data('bookId', res[i]['id']);
                                            // console.log(td.data('bookId'));
                                        }
                                        else td.html(res[i][k]);
                                        tr.append(td);
                                    }
                                    var td = $("<td></td>");
                                    td.html('<a href="javascript:;">借阅</a>');
                                    td.data('borrowId', res[i]['id']);
                                    tr.append(td);
                                    content.append(tr);
                                }
                            }
                        });
                    }
                    else alert(res.message);
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