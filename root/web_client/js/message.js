if (localStorage.getItem('status') == 1) {
    alert('请登录！！');
    $(location).prop('href', 'login.html');
}
$(function () {
    //读取数据begin
    $.ajax({
        type: "get",
        url: "/my/getComments",
        headers: {
            Authorization: localStorage.getItem('token'),
        },
        success: function (res) {
            // console.log(res);
            for (var i = 0; i < res.length; i++) {
                var li = $("<li></li>");
                var p1 = $("<p></p>");
                var p2 = $("<p></p>");
                var p3 = $("<p></p>");
                li.prepend(p3);
                li.prepend(p2);
                li.prepend(p1);
                ul.prepend(li);
                if (res[i].nickname == null) {
                    p1.html('未设置昵称:');
                }
                else { 
                    p1.html(res[i].nickname + ':');
                }
                p2.html(res[i].comment);
                p3.html(res[i].time);
            }
        }
    });
    //读取数据end
    var btn = $(".msg .in-puts button");
    var text = $(".msg .in-puts textarea");
    var ul = $(".msg .msg-content");
    if (localStorage.getItem('status') == 0) {
        btn.click(function () {
            if (!(text.prop("value") == ""
                || text.prop("value") == "说点什么吧...")) {
                var date = new Date();
                var m = date.getMonth() + 1;
                var d = date.getDate();
                var h = date.getHours();
                var mns = date.getMinutes();
                m = m < 10 ? '0' + m : m;
                d = d < 10 ? '0' + d : d;
                h = h < 10 ? '0' + h : h;
                mns = mns < 10 ? '0' + mns : mns;
                var li = $("<li></li>");
                var p1 = $("<p></p>");
                var p2 = $("<p></p>");
                var p3 = $("<p></p>");
                li.prepend(p3);
                li.prepend(p2);
                li.prepend(p1);
                ul.prepend(li);
                const time = date.getFullYear() + "-"
                    + m + "-"
                    + d + " "
                    + h + ":"
                    + mns;
                const val = text.prop("value");
                p1.html(localStorage.getItem('nickname') + ':');
                p2.html(val);
                p3.html(time);
                //放入数据库
                $.ajax({
                    type: "post",
                    url: "/my/updateComments",
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                    data: {
                        username: localStorage.getItem('username'),
                        comment: val,
                        time: time,
                    },
                    success: function (res) {
                        if (res.message === '身份认证失败!' && res.status == 1) {
                            alert('身份认证失败!');
                            logout();
                        }
                        // console.log(res);
                    }
                });
                text.prop("value", "说点什么吧...");
                text.css("color", "rgba(0, 0, 0,.5)");
            }
        });
    }
    text.focus(function () {
        if (text.prop("value") === "说点什么吧...") {
            text.prop("value", "");
            text.css("color", "black");
        }
    });
    text.blur(function () {
        if (text.prop("value") === "") {
            text.prop("value", "说点什么吧...");
            text.css("color", "rgba(0, 0, 0,.5)");
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