$(function () {
    $.ajax({
        type: 'get',
        async: false,
        url: main_url + '/ssd-link/getLineTypeAndLink',
        data: {},// loginInfo.loginAreaId
        dataType: 'json',
        success: function (data) {
            let datas = data.data
            var html = '';
            if (datas != null && datas != "") {
                $("#linkul").empty()
                for (let i = 0; i < datas.length; i++) {//循环类型
                    let typename = datas[i].typename
                    let imgurl = datas[i].imgurl
                    let link = datas[i].link
                    html += '<li>';
                    html += '<div class="itemTop"><img  src="' + imgurl + '"><span>' + typename + '</span></div>';
                    html += '<div class="serviceList">'
                    if (link != null && link != "") {
                        for (let j = 0; j < link.length; j++) {//循环连接
                            let linkname = link[j].linkname
                            var da = link[j]
                            let img = link[j].img
                            let links = link[j].link
                            let exp1 = link[j].exp1
                            img = img.replace("\\", "/")
                            html += '<div class="serviceItem" onclick="hrefs(' + j + ');"> <input type="text" id="' + j + 'exp1"  value="' + exp1 + '"  hidden >  <input type="text" id="' + j + 'links"  value="' + links + '"  hidden > <img src="' + img + '"><span>' + linkname + '</span></div>';
                        }
                    }
                    html += ' </div>'
                    html += '</li>';
                }
                $("#linkul").append(html);

                $('.itemTop>img').css({'height': $('.itemTop').eq(0).find('img').outerWidth(true),'margin-top': -$('.itemTop').eq(0).find('img').outerWidth(true)/2})
            }
        }, error: function () {
            layer.msg("查询异常");
        }
    })
})

window.onresize = function(){
    $('.itemTop>img').css({'height': $('.itemTop').eq(0).find('img').outerWidth(true),'margin-top': -$('.itemTop').eq(0).find('img').outerWidth(true)/2})
}

function hrefs(j) {
    var exp1 = $("#" + j + "exp1").val();
    var links = $("#" + j + "links").val();
    if (exp1 == 0) {
        window.open(links)
    }
}
