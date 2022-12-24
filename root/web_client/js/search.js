$(function () {
    var search = $(".shutcut .search input");
    search.prop('value', sessionStorage.getItem('searchcontent'));
    $.ajax({
        type: "post",
        url: "/api/searchBooks",
        data: {
            search: sessionStorage.getItem('searchcontent'),
        },
        success: function (res) {
            // console.log(res);
            if(res.data == undefined) $(".pages p").html('共 ' + 0 + ' 个结果');
                    else {
                        $(".pages p").html('共 ' + res.data.length + ' 个结果');
                    // console.log('--'+res.data);
                    for (var i = 0; i < res.data.length; i++) {
                        var tr = $("<tr></tr>");
                        for (var k in res.data[i]) {
                            // console.log(k);
                            // console.log(res[i]['id']);
                            if (k === 'id') continue;
                            var td = $("<td></td>");
                            if (k === 'book_name') {
                                td.html('<a>《' + res.data[i][k] + '》</a>');
                                td.data('bookId', res.data[i]['id']);
                                // console.log(td.data('bookId'));
                            }
                            else td.html(res.data[i][k]);
                            tr.append(td);
                        }
                        var td = $("<td></td>");
                        td.html('<a href="javascript:;">借阅</a>');
                        td.data('borrowId', res.data[i]['id']);
                        tr.append(td);
                        content.append(tr);
                    }
                    }
        }
    });
    //搜索
    var content = $(".book-store table tbody");
    $(".shutcut .search button").click(function () {
        // $(location).prop('href', 'search.html');
        var searchcontent = search.val();
        content.empty();
        //加载搜索结果
        if (searchcontent != '请输入书名...') {
            $.ajax({
                type: "post",
                url: "/api/searchBooks",
                data: {
                    search: searchcontent,
                },
                success: function (res) {
                    // console.log(res);
                    if(res.data == undefined) $(".pages p").html('共 ' + 0 + ' 个结果');
                    else {
                        $(".pages p").html('共 ' + res.data.length + ' 个结果');
                    // console.log('--'+res.data);
                    for (var i = 0; i < res.data.length; i++) {
                        var tr = $("<tr></tr>");
                        for (var k in res.data[i]) {
                            // console.log(k);
                            // console.log(res[i]['id']);
                            if (k === 'id') continue;
                            var td = $("<td></td>");
                            if (k === 'book_name') {
                                td.html('<a>《' + res.data[i][k] + '》</a>');
                                td.data('bookId', res.data[i]['id']);
                                // console.log(td.data('bookId'));
                            }
                            else td.html(res.data[i][k]);
                            tr.append(td);
                        }
                        var td = $("<td></td>");
                        td.html('<a href="javascript:;">借阅</a>');
                        td.data('borrowId', res.data[i]['id']);
                        tr.append(td);
                        content.append(tr);
                    }
                    }
                }
            });
        }
    })
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
                    if (res.message === '身份认证失败!' && res.status == 1) {
                        logout();
                    }
                    var searchcontent = search.val();
                    // console.log(res);
                    if (res.status == 0) {
                        alert(res.message);
                        //刷新数据
                        content.empty();
                        $.ajax({
                            type: "post",
                            url: " /api/searchBooks",
                            data: {
                                search: searchcontent,
                            },
                            success: function (res) {
                                // console.log('--------------')
                                // console.log(res);
                                for (var i = 0; i < res.data.length; i++) {
                                    var tr = $("<tr></tr>");
                                    for (var k in res.data[i]) {
                                        // console.log(k);
                                        // console.log(res[i]['id']);
                                        if (k === 'id') continue;
                                        var td = $("<td></td>");
                                        if (k === 'book_name') {
                                            td.html('<a>《' + res.data[i][k] + '》</a>');
                                            td.data('bookId', res.data[i]['id']);
                                            // console.log(td.data('bookId'));
                                        }
                                        else td.html(res.data[i][k]);
                                        tr.append(td);
                                    }
                                    var td = $("<td></td>");
                                    td.html('<a href="javascript:;">借阅</a>');
                                    td.data('borrowId', res.data[i]['id']);
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
})