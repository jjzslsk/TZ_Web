$("#weather").on("input",function(e){
    $(".layui-input.weather").val(e.delegateTarget.value);
});
var area = ['pingqiao','baihe','jietou','tantou','sanhe','hongchou','shiliang','yongxi','longxi','nanping','leifeng','sanzhou'];
var temp = ['0','1','1','0','0','0','5','2','2','2','1','3'];
$(function(){
    var loginAreaId = 'e4823e4a7f8111eaae330221860e9b7e'//userInfo.loginAreaId;
    $("#areaId").val(loginAreaId);
    var loginUserIdr = '979e7f75bce046b4ad69d2f88f9c251f'//userInfo.loginUserIdr;
    $("#loginUserId").val(loginUserIdr);

    $.ajax({
        url: main_url + '/tools/getTownForecast',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (res) {
            if (res.code == '0') {
                var data = res.data;
                for (var i = 0; i < data.length; i++) {
                    var map = data[i];
                    for (var k = 0; k < area.length; k++) {
                            $("input[name='"+map.element_code.replace("town_", "")+"']").val(map.element_content);
                    }
                }
            }
        },
        error:function(e,f,g){
            debugger;
        }
    })
})

function clearNoNum(obj,id) {
    var num = obj.value;
    if(isNaN(num)){
        $("#"+id).text("请输入有效数字！");
        return false;
    }else{
        $("#"+id).text("");
    }
}
$("input[name='chengqu_minTemp']").on("input",function(e){
    var mintemp = e.delegateTarget.value;
    area.forEach(function(value,i){
        if(isNaN(mintemp)){
            return false;
        }else{
            var x = (parseFloat(mintemp)- parseFloat(temp[i]));
            $("input[name='"+value+"_minTemp']").val(x);
        }

    })
});
$("input[name='chengqu_maxTemp']").on("input",function(e){
    var maxTemp = e.delegateTarget.value;
    area.forEach(function(value,i){
        var x = (parseFloat(maxTemp)- parseFloat(temp[i]));
        $("input[name='"+value+"_maxTemp']").val(x);

    })
});
$("#save").click(function(){
    var fo = $("#myForm").serialize();
    $.ajax({
        url: main_url + '/tools/saveTownForecast',
        type: 'POST',
        dataType: 'json',
        data:fo,
        async: false,
        success: function (res) {
            if(res.code=='0'){
                alert(res.msg);
            }
        },
        error:function(e,f,g){
            debugger;
        }
    })
})
