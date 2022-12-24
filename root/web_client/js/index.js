//加载图片
$.ajax({
    type: "get",
    url: "/api/getBookPics",       
    success: function (res) {
        console.log(res);
        var img = $("#starsIF img");
        for (var i = 0; i < 20; i++){
            img.eq(i).prop('src', res[i].book_pic);
        }
    }
});
$.ajax({
    type: "get",
    url: "/api/getTopBookPicsAndDesc",
    success: function (res) {
        // console.log(res);
        var ul = $(".rank ul");
        for (var i = 0; i < res.length; i++){
            var li = $("<li></li>");
            var a = $("<a></a>");
            var img = $("<img/>");
            var p = $("<p></p>");
            img.prop('src', res[i].book_pic);
            p.html(res[i].book_description);
            a.append(img);
            a.append(p);
            li.append(a);
            img.data('id', res[i].id);
            ul.append(li);
        }
    }
});


$(function () {
    $(".rank ul").on('click', 'li', function (e) {
        // console.log($(e.target).data('id'));
        sessionStorage.setItem('bookId', $(e.target).data('id'));
        $(location).prop('href', 'bookDescription.html');
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
