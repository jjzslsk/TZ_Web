$(function(){
    lodingDate();
    lodingSelect();
    selectd();
});
//加载时间
function lodingDate(){
    for (let i = 0; i <5 ; i++) {
     $("#day"+(i+1)).html(getDay(i));
    }
}
function getDay(day){
    var today = new Date();
    var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;
    today.setTime(targetday_milliseconds); //注意，这行是关键代码
    var tDate = today.getDate();
    tDate = doHandleMonth(tDate);
    return tDate;
}
function doHandleMonth(month){
    var m = month;
    if(month.toString().length == 1){
        m = "0" + month;
    }
    return m;
}

function lodingSelect() {
    $.ajax({
        type: 'GET',
        url: main_url + '/tools/getIndex',
        data: {"loginAreaId": loginInfo.areaId},// loginInfo.loginAreaId
        dataType: 'json',
        success: function (data) {
            var fireLevel = data.data.fireLevel;//森林火险
            var dressing = data.data.dressing;//穿衣指数
            var outing = data.data.outing;//郊游指数
            var ultraviolet = data.data.ultraviolet;//紫外线指数
            var heatstroke = data.data.heatstroke;//中暑指数
            var morningexercises = data.data.morningexercises;//晨练指数
            var comfort = data.data.comfort;//舒适度指数
            $(".indexselect").empty();
            var html = '<option value="">请选择</option>';
            for (let i = 0; i < fireLevel.length; i++) {
                html += '<option value="' + fireLevel[i].itemCode +'_'+fireLevel[i].content+'">' + fireLevel[i].content + '</option>';
            }
            $(".indexselect").append(html)

            //舒适度
            var comforthtml = '<option value="">请选择</option>';
            for (let i = 0; i < comfort.length; i++) {
                comforthtml += '<option value="' + comfort[i].itemCode +'_'+comfort[i].content+'">' + comfort[i].content + '</option>';
            }
            $("#comfortDay").append(comforthtml)
            //穿衣指数
            var dressinghtml = '<option value="">请选择</option>';
            for (let i = 0; i < dressing.length; i++) {
                dressinghtml += '<option value="' + dressing[i].itemCode +'_'+dressing[i].content+'">' + dressing[i].content + '</option>';
            }
            $("#dressingDay").append(dressinghtml)
            //郊游指数
            var outinghtml = '<option value="">请选择</option>';
            for (let i = 0; i < outing.length; i++) {
                outinghtml += '<option value="' + outing[i].itemCode + '_'+outing[i].content+'">' + outing[i].content + '</option>';
            }
            $("#outingDay").append(outinghtml)
            //紫外线
            var ultraviolethtml = '<option value="">请选择</option>';
            for (let i = 0; i < ultraviolet.length; i++) {
                ultraviolethtml += '<option value="' + ultraviolet[i].itemCode +'_'+ultraviolet[i].content+'">' + ultraviolet[i].content + '</option>';
            }
            $("#ultravioletDay").append(ultraviolethtml)
            //中暑
            var heatstrokehtml = '<option value="">请选择</option>';
            for (let i = 0; i < heatstroke.length; i++) {
                heatstrokehtml += '<option value="' + heatstroke[i].itemCode +'_'+heatstroke[i].content+'">' + heatstroke[i].content + '</option>';
            }
            $("#heatstrokeDay").append(heatstrokehtml)
            //晨练
            var morningexerciseshtml = '<option value="">请选择</option>';
            for (let i = 0; i < morningexercises.length; i++) {
                morningexerciseshtml += '<option value="' + morningexercises[i].itemCode + '_'+morningexercises[i].content+'">' + morningexercises[i].content + '</option>';
            }
            $("#morningexercisesDay").append(morningexerciseshtml)

            layui.use('form', function() {
                var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功
                form.render();
            });
        }, error: function () {
            layer.msg("查询指数等级异常");
        }
    });
}
function selectd(){
    $.ajax({
        type: 'GET',
        url: main_url + '/tools/getselectd',
        data: {"loginAreaId": loginInfo.areaId},// loginInfo.loginAreaId
        dataType: 'json',
        success: function (data) {
            var datas = data.data;//森林火险
            for (let i = 0; i <datas.length ; i++) {
                var productCode=datas[i].selectCode;
                var elementCode=datas[i].selectedValue;
                if(elementCode!=null && elementCode!=''){
                    var select = document.getElementById(productCode);
                    for (var j = 0; j < select.options.length; j++){
                        var value=select.options[j].value;
                        if (value.indexOf(elementCode)>=0){
                            select.options[j].selected = true;
                            break;
                        }
                    }
                    layui.use('form', function() {
                        var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功
                        form.render();
                    });
                }
            }

        }, error: function () {
            layer.msg("查询异常");
        }
    });
}

function save(){
    var slhx1=document.getElementById("forestFireDay1").value;
    var slhx2=document.getElementById("forestFireDay2").value;
    var slhx3=document.getElementById("forestFireDay3").value;
    var slhx4=document.getElementById("forestFireDay4").value;
    var slhx5=document.getElementById("forestFireDay5").value;
    var dressing=document.getElementById("dressingDay").value;//穿衣指数
    var outing=document.getElementById("outingDay").value;//郊游指数
    var ultraviolet=document.getElementById("ultravioletDay").value;//紫外线指数
    var heatstroke=document.getElementById("heatstrokeDay").value;//中暑指数
    var morningexercises=document.getElementById("morningexercisesDay").value;//晨练指数
    var comfort=document.getElementById("comfortDay").value;//舒适度指数
    var param="forestFireDay1:"+slhx1+",forestFireDay2:"+slhx2+",forestFireDay3:"+slhx3+",forestFireDay4:"+slhx4+",forestFireDay5:"+slhx5+",dressingDay:"+dressing+",outingDay:"+outing+",ultravioletDay:"+ultraviolet+",heatstrokeDay:"+heatstroke+",morningexercisesDay:"+morningexercises+",comfortDay:"+comfort
    $.ajax({
        type: 'POST',
        url: main_url +'/tools/add',
        data: {"loginAreaId": loginInfo.areaId,"data": param},// loginInfo.loginAreaId
        dataType: 'json',
        success: function (data) {
            layer.msg("保存成功");
        }, error: function () {
            layer.msg("保存异常");
        }
  })
}
