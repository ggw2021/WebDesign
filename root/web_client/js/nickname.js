if (localStorage.getItem('status') == 1) {
    alert('请登录！！');
    $(location).prop('href', 'login.html');
}
$(function () {
    const nickname = $(".user-login form ul li input");
    const sbtn = $(".user-login form .sub");
    sbtn.click(function (e) {
        $.ajax({
            type: "post",
            url: "/my/userinfo",
            headers: {
                Authorization: localStorage.getItem('token'),
            },
            data: {
                nickname: nickname.val(),
            },
            success: function (res) {
                var flag = 0;
                if (res.message === '身份认证失败!' && res.status == 1) {
                    alert('身份认证失败!');
                    logout();
                }
                else flag = 1;
                // console.log(res);
                var tip = $(".tip");
                if (res.status === 0) {
                    // console.log(tip.find("p"));
                    tip.find("p").html('设置成功');
                    localStorage.setItem('nickname', nickname.val());
                    tip.find("button").off().click(function () {
                        $(location).prop('href', 'index.html');
                    })
                }
                else {
                    if (res.message == '"nickname" is not allowed to be empty') {
                        tip.find("p").html('昵称不能为空');
                    }
                    else {
                        tip.find("p").html('身份认证失败');
                    }
                    tip.find("button").off().click(function () {
                        tip.css('display', 'none');
                    })
                }
                if (flag) {
                    tip.css({
                        'display': 'block',
                        'top': '-200px',
                    })
                }
            }
        });
    });
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