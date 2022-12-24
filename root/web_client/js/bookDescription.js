$.ajax({
    type: "post",
    url: "/api/getOneBook",
    data: {
        id: sessionStorage.getItem('bookId'),
    },
    success: function (res) {
        // console.log(res);
        $(".description img").prop('src', res.book_pic);
        var p = $(".description ul li p");
        p.eq(0).html(res.book_name);
        p.eq(1).html(res.book_author);
        p.eq(2).html(res.book_description);
    }
});
$(function () {
    $(".description ul li button").click(function () {
        // alert(sessionStorage.getItem('bookId'));
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
                id: sessionStorage.getItem('bookId'),
                borrow_time: time,
            },
            success: function (res) {
                // console.log(res);
                if (res.status == 0) {
                    alert(res.message);
                }
                else alert(res.message);
                //掉线
                if (res.message === '身份认证失败!' && res.status == 1) {
                    logout();
                }
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