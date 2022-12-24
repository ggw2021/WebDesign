if (localStorage.getItem('status') == 1) {
    alert('请登录！！');
    $(location).prop('href', 'login.html');
}
function getFile(node) {
    // console.log(node.files[0]);
    var fr = new FileReader();
    fr.readAsDataURL(node.files[0]);
    fr.onload = function (e) {
        console.log(e.target.result);
        $.ajax({
            type: "post",
            url: "/my/update/avatar",
            headers: {
                Authorization: localStorage.getItem('token'),
            },
            data: {
                avatar: e.target.result,
            },
            success: function (res) {
                var flag = 0;
                if (res.message === '身份认证失败!' && res.status == 1) {
                    alert('身份认证失败!');
                    logout();
                }
                else { 
                    $(".shutcut .login a img").prop('src', e.target.result);
                    flag = 1;
                } 
                // console.log(res);
                var tip = $(".tip");
                tip.find("p").html('上传成功！');
                tip.find("button").off().click(function () {
                    $(location).prop('href', 'index.html');
                })
                if(flag) tip.css('display', 'block');
            }
        });
        // console.log(e.target.result);
    }
}
$(function () {
    $(".user-login form .sub").click(function () {
        $(".user-login form input:nth-child(1)").click();
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