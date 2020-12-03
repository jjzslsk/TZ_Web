layui.use(['form', 'laydate','table'], function(){
    var form = layui.form
        ,layer = layui.layer
        ,laydate = layui.laydate
        ,table = layui.table;

    //日期
    laydate.render({
        elem: '#date'
        ,range: true
        ,change: function(value, date, endDate){
            // console.log(value); //得到日期生成的值，如：2017-08-18
            tabLoad(value.split(" - ")[0]);
        }
    });
    //加载table 初始化头部数据
    var colsData = [];
    //添加岗位信息
    $.ajax({
        type : 'GET',
        url : main_url+'/ssd-business-duty/getJobList',
        data :{"loginOrgId":loginInfo.orgId},
        dataType : 'json',
        success: function (data) {
            if(data.success&&data.data!=null&&data.data.length>0){
                var jobArr = data.data;
                for (let i = 0; i < jobArr.length; i++) {
                    colsData.push({'field':jobArr[i].id,  'title': jobArr[i].name});
                }
                //最后值班人
                tabLoad("");
                form.render();
            }
        },
        error: function () {
            layer.msg("查询岗位信息异常");
        }
    });

    var tabLoad = function(dateTime){
        table.render({
            elem: '#tableList'
            ,id:'tableReload'
            ,height: "full"
            ,method:'get'
            ,url: main_url + '/ssd-business-duty/getDayJobList'
            ,where:{"dateTime":dateTime,"loginOrgId":loginInfo.orgId}
            ,cols:[colsData]
            ,done: function (res, curr, count) {
            }
        });
    }

    $("#saveQuickSch").click(function(){
        //时间
        var date = $("#date").val();
        if(date==null||date==""){
            layer.alert("请选择排班时间");
            return;
        }
        //用户
        var users = "";
        $("#rightUl li").each(function(index,ele){
            var id = $(ele).find("span").attr("id");
            // var dayNum = $(ele).find("input").val();
            // dayNum = dayNum==""||dayNum==null ? '0' : dayNum;
            users+=id+",";
        });
        if(users==null||users==""){
            layer.alert("请选择值班人员");
            return;
        }

        var sendLoadIndex = layer.msg('正在保存...', {
            icon: 16
            ,shade: 0.03
            ,time:0
        });

        //保存
        $.ajax({
            type : 'POST',
            url : main_url+'/ssd-business-duty/saveQuickDuty_xxfwzx',
            data :{"date":date,"users":users,"loginOrgId":loginInfo.orgId},
            dataType : 'json',
            success: function (data) {
                layer.close(sendLoadIndex);
                if(data.success){
                    layer.confirm('保存成功', {
                        btn: ['确定'] //按钮
                    }, function(){
                        //确认函数
                        layer.closeAll();
                        //调用父页面关闭窗口方法
                        window.parent['vueDefinedMyProp']({name:'xxfwzx',date:date});
                       // location.reload();  //刷新
                    });

                }else{
                    layer.alert(data.message);
                }
            },
            error: function () {
                layer.close(sendLoadIndex);
                layer.msg("保存排班信息异常");
            }
        });
    });

});
/*
	 * 向右穿梭
	 */
function goRight(){
    var li = $(".list-box li.active");
    if(li.length > 0 && li.parent().attr("id") == 'leftUl'){
        var newLi = li.clone().click(setActive);
        $("#rightUl").append(newLi);
        li.remove();
    }
}
/*
 * 向左穿梭
 */
function goLeft(){
    var li = $(".list-box li.active");
    if(li.length > 0 && li.parent().attr("id") == 'rightUl'){
        var newLi = li.clone().click(setActive);
        $("#leftUl").append(newLi);
        li.remove();
    }
}
/*
 * 向上穿梭
 */
function goUp(){
    var li = $(".list-box li.active");
    if(li.length > 0){
        if(li.prev().length > 0){
            var newLi = li.clone().click(setActive);
            li.prev().before(newLi);
            li.remove();
        }
    }
}
/*
 * 向下穿梭
 */
function goDown(){
    var li = $(".list-box li.active");
    if(li.length > 0){
        if(li.next().length > 0){
            var newLi = li.clone().click(setActive);
            li.next().after(newLi);
            li.remove();
        }
    }
}
function setActive(){
    $(".list-box li").removeClass("active");
    $(this).addClass("active");
}
$("#leftUl").dblclick(function(){
    goRight()
})
$("#rightUl").dblclick(function(){
    goLeft()
})
$(function(){
    $(".list-box li").click(setActive);
    $(".list-tool-indiv .icon.right").click(goRight);
    $(".list-tool-indiv .icon.up").click(goUp);
    $(".list-tool-indiv .icon.down").click(goDown);
    $(".list-tool-indiv .icon.left").click(goLeft);
    $.ajax({
        type : 'GET',
        url : main_url+'/ssd-business-duty/getOrgUserList',
        data :{"loginOrgId":loginInfo.orgId},
        dataType : 'json',
        success: function (data) {
            if(data.success&&data.data!=null&&data.data.length>0){
                var userArr = data.data;
                for (let i = 0; i < userArr.length; i++) {
                    addItem("#leftUl",{title:userArr[i].name,id:userArr[i].id});
                }
            }
        },
        error: function () {
            layer.msg("查询用户信息异常");
        }
    });
})
function addItem(ul,item){
    //添加选项时绑定事件
    $("<li>"
    +"<span class='title' id='"+item.id+"'>"+item.title+"</span>"
    +"<input type='text' name='title' required  lay-verify='required' autocomplete='off' class='layui-input'/>"
    +"</li>")
    .appendTo($(ul)).click(setActive);
}
function getItems(){
    var list = [];
    $("#leftUl li").each(function(i,o){
        var obj = {};
        //自定义参数
        obj.moduleId = $(o).attr('moduleid');
        //是否可见
        obj.seen = -1;
        //排序
        obj.seq = i+1;
        list.push(obj);
    });
    $("#rightUl li").each(function(i,o){
        var obj = {};
        obj.moduleId = $(o).attr('moduleid');
        obj.seen = 1;
        obj.seq = i+1;
        list.push(obj);
    });
    console.log(list);
    alert(JSON.stringify(list));
    return list;
}
