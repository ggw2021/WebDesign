//退出登录
let logout = () => {
    localStorage.setItem('status', 1);
    var login = $(".shutcut .login");
    var ul = $(".shutcut .login .my-set");
    var img = $(".shutcut .login a img");
    var p = $(".shutcut .login a p");
    login.off("mouseenter mouseleave");
    ul.stop().slideToggle(100);
    img.stop().toggleClass("change");
    //切换登录默认头像，用户名
    img.prop('src', 'images/login.png');//bug local 
    p.html('...');
    localStorage.setItem('token', '...');
    localStorage.setItem('nickname', '...');
    $(location).prop('href', 'index.html');
}

$(function () {
    // console.log(window.innerWidth);
    if (window.innerWidth < 1340) {
        $(".shutcut .search").hide();
    }
    if (window.innerWidth > 1340) {
        $(".shutcut .search").show();
    }
    if (window.innerWidth < 790) {
        $(".shutcut .fun").hide();
    }
    if (window.innerWidth > 790) {
        $(".shutcut .fun").show();
    }
    $(window).resize(function () {
        // console.log(window.innerWidth);
        if (window.innerWidth < 1340) {
            $(".shutcut .search").hide();
        }
        if (window.innerWidth > 1340) {
            $(".shutcut .search").show();
        }
        if (window.innerWidth < 790) {
            $(".shutcut .fun").hide();
        }
        if (window.innerWidth > 790) {
            $(".shutcut .fun").show();
        }
    })
    // $.one(function () {
    //     alert('ss');
    //     if(localStorage.getItem('status') == 1) $(location).prop('href', 'login.html');
    // })
    // //初始化数据
    //localStorage.removeItem('username');
    var p = $(".shutcut .login a p");
    if (localStorage.getItem('nickname') == null) {
        p.html('...');
    }
    else {
        p.html(localStorage.getItem('nickname'));
    }
    //获取头像
    $.ajax({
        type: "get",
        url: "/my/getAvatar",
        headers: {
            Authorization: localStorage.getItem('token'),
        },
        success: function (res) {
            if (res.message === '身份认证失败!' && res.status == 1) {
                // if ($(location).prop('href') != 'index.html')
                var href = $(location).prop('href').split('/');
                href = href[href.length - 1];
                if (!(href == ''
                    || href == 'index.html'
                    || href == 'login.html'
                    || href == 'register.html'
                    || href == 'bookStore.html'
                    || href == 'bookDescription.html'
                    || href == 'search.html')) {
                    alert('身份认证失败!');
                    logout();
                }
                else {
                    localStorage.setItem('status', 1);
                    var login = $(".shutcut .login");
                    var ul = $(".shutcut .login .my-set");
                    var img = $(".shutcut .login a img");
                    var p = $(".shutcut .login a p");
                    login.off("mouseenter mouseleave");
                    //切换登录默认头像，用户名
                    img.prop('src', 'images/login.png');//bug local 
                    p.html('...');
                    localStorage.setItem('token', '...');
                    localStorage.setItem('nickname', '...');
                }
            }
            // console.log(res);
            if (res.avatar != null) {
                $(".shutcut .login a img").prop('src', res.avatar);
            }
            else if (localStorage.getItem('status') == 0) {
                $(".shutcut .login a img").prop('src', 'upload/login1.jpg');
            }
        }
    });

    // var xx = [
    //     '2022-05-22 07:50',
    //     '2022-05-21 22:47',
    //     '2022-05-21 22:00',
    // ];
    // var id = [
    //     1,
    //     2,
    //     3
    // ];
    // console.log(id.join('||'));
    // console.log('------------');

    var ipt = $(".shutcut .search input");
    ipt.focus(function (e) {
        if (ipt.prop("value") === "请输入书名...") {
            ipt.prop("value", "");
            // ipt.css("color", "black");
        }
        if (ipt.prop("value") !== '请输入书名...') {
            ipt.css("color", "black");
        }
    })
    ipt.blur(function (e) {
        if (ipt.prop("value") === "") {
            ipt.prop("value", "请输入书名...");
            ipt.css("color", "rgb(0, 0, 0,.5)");
        }
    });
    //个人信息
    if (localStorage.getItem('status') == 0) {
        var login = $(".shutcut .login");
        var ul = $(".shutcut .login .my-set");
        var img = $(".shutcut .login a img");
        login.on("mouseenter mouseleave", function () {
            ul.stop().slideToggle(100);
            img.stop().toggleClass("change");
        });
    }
    $(".shutcut .login a").click(function () {
        // console.log(localStorage.getItem('status'));
        if (localStorage.getItem('status') == null) localStorage.setItem('status', 1);
        if (localStorage.getItem('status') == 1) {
            $(location).prop('href', 'login.html');
        }
    })
    $(".shutcut .login ul li a:eq(4)").click(function () {
        //退出登录
        logout();
        // localStorage.setItem('status', 1);
        // var login = $(".shutcut .login");
        // var ul = $(".shutcut .login .my-set");
        // var img = $(".shutcut .login a img");
        // var p = $(".shutcut .login a p");
        // login.off("mouseenter mouseleave");
        // ul.stop().slideToggle(100);
        // img.stop().toggleClass("change");
        // //切换登录默认头像，用户名
        // img.prop('src', 'images/login.png');//bug local 
        // localStorage.setItem('token', '...');
        // localStorage.setItem('nickname', '...');
        // p.html(localStorage.getItem('nickname'));
        // $(location).prop('href', 'index.html');
        // console.log('cc');
    })
    // //搜索
    // var content = $(".book-store table tbody");
    // $(".shutcut .search button").click(function () {
    //     // $(location).prop('href', 'search.html');
    //     content.empty();
    //     var search = $(".shutcut .search input");
    //     var searchcontent = search.val();
    //     //加载搜索结果
    //     if (searchcontent != '请输入书名...') {
    //         $.ajax({
    //             type: "post",
    //             url: " /api/searchBooks",
    //             data: {
    //                 search: searchcontent,
    //             },
    //             success: function (res) {
    //                 console.log(res);
    //                 for (var i = 0; i < res.data.length; i++) {
    //                     var tr = $("<tr></tr>");
    //                     for (var k in res.data[i]) {
    //                         // console.log(k);
    //                         // console.log(res[i]['id']);
    //                         if (k === 'id') continue;
    //                         var td = $("<td></td>");
    //                         if (k === 'book_name') {
    //                             td.html('<a>《' + res.data[i][k] + '》</a>');
    //                             td.data('bookId', res.data[i]['id']);
    //                             console.log(td.data('bookId'));
    //                         }
    //                         else td.html(res.data[i][k]);
    //                         tr.append(td);
    //                     }
    //                     var td = $("<td></td>");
    //                     td.html('<a href="javascript:;">借阅</a>');
    //                     td.data('borrowId', res.data[i]['id']);
    //                     tr.append(td);
    //                     content.append(tr);
    //                 }
    //             }
    //         });
    //     }
    // })
    // //点击书名查看详情
    // $(".book-store table tbody").on('click', 'td', function (e) {
    //     var td = $(e.target);
    //     td = td.is('a') ? td.parent() : td; //bug 已修复
    //     // console.log(td.is('a'));
    //     console.log(td.data('bookId'));
    //     if (td.data('bookId') != undefined) {
    //         sessionStorage.setItem('bookId', td.data('bookId'));
    //         $(location).prop('href', 'bookDescription.html');
    //     }
    //     if (td.data('borrowId') != undefined) {
    //         // alert(td.data('borrowId'));
    //         var date = new Date();
    //         var m = date.getMonth() + 1;
    //         var d = date.getDate();
    //         var h = date.getHours();
    //         var mns = date.getMinutes();
    //         m = m < 10 ? '0' + m : m;
    //         d = d < 10 ? '0' + d : d;
    //         h = h < 10 ? '0' + h : h;
    //         mns = mns < 10 ? '0' + mns : mns;
    //         const time = date.getFullYear() + "-"
    //             + m + "-"
    //             + d + " "
    //             + h + ":"
    //             + mns;
    //         $.ajax({
    //             type: "post",
    //             url: " /my/borrowOrReturnOneBook",
    //             headers: {
    //                 Authorization: localStorage.getItem('token'),
    //             },
    //             data: {
    //                 id: td.data('borrowId'),
    //                 borrow_time: time,
    //             },
    //             success: function (res) {
    //                 console.log(res);
    //                 if (res.status == 0) {
    //                     alert('1' + res.message);
    //                     //刷新数据
    //                     content.empty();
    //                     $.ajax({
    //                         type: "post",
    //                         url: " /api/searchBooks",
    //                         data: {
    //                             search: searchcontent,
    //                         },
    //                         success: function (res) {
    //                             console.log(res);
    //                             for (var i = 0; i < res.data.length; i++) {
    //                                 var tr = $("<tr></tr>");
    //                                 for (var k in res.data[i]) {
    //                                     // console.log(k);
    //                                     // console.log(res[i]['id']);
    //                                     if (k === 'id') continue;
    //                                     var td = $("<td></td>");
    //                                     if (k === 'book_name') {
    //                                         td.html('<a>《' + res.data[i][k] + '》</a>');
    //                                         td.data('bookId', res.data[i]['id']);
    //                                         console.log(td.data('bookId'));
    //                                     }
    //                                     else td.html(res.data[i][k]);
    //                                     tr.append(td);
    //                                 }
    //                                 var td = $("<td></td>");
    //                                 td.html('<a href="javascript:;">借阅</a>');
    //                                 td.data('borrowId', res.data[i]['id']);
    //                                 tr.append(td);
    //                                 content.append(tr);
    //                             }
    //                         }
    //                     });
    //                 }
    //                 else alert(+res.message);
    //             }
    //         });
    //     }
    // })
})