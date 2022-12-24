if (localStorage.getItem('status') == 1) {
    alert('请登录！！');
    $(location).prop('href', 'login.html');
}
$(function () {
    var oldPwd = $(".user-login form ul li input:eq(0)");
    var newPwd = $(".user-login form ul li input:eq(1)");
    var sbtn = $(".user-login form .sub");
    const s_err = [
        '"oldPwd" is not allowed to be empty',
        '"newPwd" is not allowed to be empty',
        '旧密码错误！',
        '"newPwd" contains an invalid value'
    ];
    const c_err = [
        '请输入原密码',
        '请输入新密码',
        '原密码错误！',
        '新密码不能和原来相同',
        '密码格式错误(6-12位字母加数字)',
    ];
    sbtn.click(function () {
        // console.log(localStorage.getItem('token'));
        $.ajax({
            type: "POST",
            url: "/my/updatepwd",
            headers: {
                Authorization: localStorage.getItem('token'),
            },
            data: {
                oldPwd: oldPwd.val(),
                newPwd: newPwd.val(),
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
                    tip.find("p").html('修改成功');
                    localStorage.setItem('status', 1);
                    tip.find("button").off().click(function () {
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
                        $(location).prop('href', 'login.html');
                    })
                }
                else {
                    // console.log(tip.find("p"));
                    // 
                    var i = 0;
                    for (; i < 4; i++) {
                        if (res.message === s_err[i]) {
                            tip.find("p").html(c_err[i]);
                            break;
                        }
                    }
                    if (i == 4) {
                        tip.find("p").html(c_err[4]);
                    }
                    tip.find("button").off().click(function () {
                        tip.css('display', 'none');
                    })
                }
                if (flag) tip.css('display', 'block');
            }
        });
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