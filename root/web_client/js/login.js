$(function () {
    const username = $(".user-login form ul li .username");
    const password = $(".user-login form ul li .pwd");
    // console.log(username);
    // console.log(password);
    const sbtn = $(".user-login form .sub");
    const s_err = [
        '"username" must only contain alpha-numeric characters',
        '"username" is not allowed to be empty',
        '用户名不存在',
        '"password" is not allowed to be empty',
        '密码错误'
    ];
    const c_err = [
        '用户名只能含有字母或数字',
        '用户名不能为空',
        '用户名不存在',
        '密码为空',
        '密码错误',
        '密码格式错误(6-12位字母加数字)',
    ];
    // console.log(sbtn);
    sbtn.click(function (e) {
        $.ajax({
            type: "post",
            url: "/api/login",
            data: {
                username: username.prop('value'),
                password: password.prop('value'),
            },
            success: function (res) {
                // console.log(res);
                var tip = $(".tip");
                if (res.status === 0) {
                    // console.log(res.user);
                    tip.find("p").html('登录成功');
                    localStorage.setItem('token', res.token);
                    localStorage.setItem('username', res.user.username);
                    localStorage.setItem('status', 0);
                    if (res.user.nickname == null) {
                        localStorage.setItem('nickname', '未设置昵称');
                    }
                    else {
                        localStorage.setItem('nickname', res.user.nickname);
                    }
                    // console.log(res.user.nickname);
                    tip.find("button").off().click(function () {
                        $(location).prop('href', 'index.html');
                    })
                }
                else {
                    // console.log(tip.find("p"));
                    // 
                    var i = 0;
                    for (; i < 4; i++){
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
                tip.css('display', 'block');
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