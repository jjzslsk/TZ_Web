var layedit = "";
var indexs = "";
$(function () {
    $("#startwarning").val(getDay(3))
    $("#endwarning").val(getDay(0))
    $("#startLive").val(getDay(3))
    $("#endLive").val(getDay(0))
})
layui.use(['layer', 'table', 'element', 'laydate', 'form', 'upload', 'layedit'], function () {
    var laydate = layui.laydate;
    var table = layui.table //表格
    var form = layui.form;
    var element = layui.element;
    var upload = layui.upload;
    layedit = layui.layedit;
    //预警图标
    table.render({
        id: 'taskReloads'
        , elem: '#tableEarly'
        , height: "full-135"
        , method: 'GET'
        ,url: main_url+'/ssd-caselibInfo/listgetEarlyList?start='+getDay(3)+'&end='+getDay(0) //数据接口
        , title: '预警列表'
        , page: true //开启分页
        , limits: [15, 50, 100]
        , limit: 15
        , defaultToolbar: ['filter', 'print']
        , totalRow: false //开启合计行
        , cols: [[ //表头
            {type: 'checkbox', fixed: 'left'}
            , {field: 'title', align: 'center', title: '标题'}
            , {field: 'publish_org', align: 'center', title: '发布单位'}
            , {field: 'publish_time', align: 'center', title: '发布时间'}
            , {field: 'rarlyName', align: 'center', title: '灾种名称'}
            , {field: 'level', align: 'center', title: '等级'}
            , {field: 'type', align: 'center', title: '预警状态'}
        ]]
        , data: []
        , done: function (res, curr, count) {

        }
    });
    //实况
    table.render({
        id: 'taskReload'
        , elem: '#tableLive'
        , height: "full-135"
        , method: 'GET'
        ,url: main_url+'/ssd-caselibInfo/getLivelist?start='+getDay(3)+'&end='+getDay(0) //数据接口
        , title: '实况列表'
        , page: true //开启分页
        , limits: [15, 50, 100]
        , limit: 15
        , defaultToolbar: ['filter', 'print']
        , totalRow: false //开启合计行
        , cols: [[ //表头
              {field: 'StationName', align: 'center', title: '站点名称'}
            , {field: 'StationNum', align: 'center', title: '站点编号'}
            , {field: 'time', align: 'center', title: '观测时间'}
            , {field: 'Rain', align: 'center', title: '小时雨量'}
            , {field: 'Temp', align: 'center', title: '气温'}
            , {field: 'MaxTemp', align: 'center', title: '最高气温'}
            , {field: 'MinTemp', align: 'center', title: '最低气温'}
            , {field: 'WindD', align: 'center', title: '风力'}
            , {field: 'WindV', align: 'center', title: '风向'}
            , {field: 'Visib', align: 'center', title: '能见度'}
            , {field: 'RelHum', align: 'center', title: '相对湿度'}
        ]]
        , data: []
        , done: function (res, curr, count) {

        }
    });
    var $ = layui.$, active = {
        reload: function () {
            //执行重载
            reloadTable();
        }
    };

    //单选框点击事件
    form.on('radio(switchTest)', function (data) {
        let value = data.value
        if (value == 1) {
            $("#test3").show();
            $("#test2").hide();
        }
        if (value == 2) {
            $("#test2").show();
            $("#test3").hide();
        }
    });
    //富文本
    indexs = layedit.build('content',
        {tool: ['strong', 'italic', 'underline', 'del', '|', 'left', 'center', 'right', 'face']}); //建立编辑器

    form.verify({
        content: function (value) {
            return layedit.sync(indexs);
        }
    })
    laydate.render({
        elem: '#start'
        , type: 'datetime'
    });
    laydate.render({
        elem: '#end'
        , type: 'datetime'
    });
    laydate.render({
        elem: '#startwarning'
        , type: 'datetime'
    });
    laydate.render({
        elem: '#endwarning'
        , type: 'datetime'
    });
    laydate.render({
        elem: '#startLive'
        , type: 'datetime'
        ,change: function (value, date, endDate) { //监听日期被切换
            $("#startLives").val(value);
        }
    });
    laydate.render({
        elem: '#endLive'
        , type: 'datetime'
        ,change: function (value, date, endDate) { //监听日期被切换
            $("#endLives").val(value);
        }
    });

    element.on('tab(docDemoTabBrief)', function (data) {
        $("#tabindex").val(data.index);
    });

    upload.render({
        elem: '#test3'
        , url: main_url + '/ssd-caselibInfo/upload'
        //,accept: 'file' //普通文件
        , done: function (res) {
            if (res.code != '0') {
                layer.msg(res.msg);
            } else {
                $("#divs").empty();
                var html = '<img src="' + res.path + '" id="imgs" name="imgs" style="width: 70px;height: 70px;">'
                $("#divs").append(html)
                $("#type").val("image");
                $("#url").val(res.path)
                $("#name").val(res.fileName)
            }
        }
    });
    upload.render({
        elem: '#test2'
        , url: main_url + '/ssd-caselibInfo/upload'
        , accept: 'video' //普通文件
        , done: function (res) {
            if (res.code != '0') {
                layer.msg(res.msg);
            } else {
                $("#divs").empty();
                var html = '<video src="' + res.path + '" controls="controls"  style="width: 460px;height: 150px;"></video>'
                $("#divs").append(html)
                $("#type").val("video");
                $("#url").val(res.path)
                $("#name").val(res.fileName)
            }
        }
    });
    //监控下拉框改变事件
    form.on('select(defaultimg)', function (data) {
        if (data.value == "0") {
            $("#selectim").show();
            $("#imgss").hide();
            $("#msg").hide();
        } else {//上传图片
            $("#selectim").hide();
            $("#imgss").show();
            $("#msg").show();
            $("#img").val("");
            $("#imgs").hide();
        }
    });
    form.on('select(selectimg)', function (data) {
        var va = data.value
        $.ajax({
            type: 'get',
            async: false,
            url: main_url + '/ssd-linkType/getImgUrl',
            data: {},// loginInfo.loginAreaId
            dataType: 'json',
            success: function (data) {
                var path = data.path
                $("#imgs").attr("src", path + "/" + va + "-a.png");
                $("#img").val(path + "/" + va + "-a.png")
            }, error: function () {
                layer.msg("查询异常");
            }
        })
    });
    //监听提交
    form.on('submit(save)', function (data) {
        var checkStatus = table.checkStatus('taskReloads');
        var data = checkStatus.data;
        var id = "";
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                if (id != "") {
                    id += ",";
                }
                id += "'" + data[i].id + "'";
            }
            $("#earlyId").val(id)
        }
        $.ajax({
            type: 'POST',
            url: main_url + '/ssd-caselibInfo/saveCaselibInfo',
            data: $("#form1").serialize(),
            dataType: 'json',
            success: function (data) {
                if (data.code == 0) {
                    if (data.result == '1') {
                        parent.layer.msg('操作成功', {icon: 6,});
                        parent.layer.closeAll('iframe'); //关闭弹框
                        parent.layui.table.reload('taskReload', {page: {curr: 1}});
                    } else {
                        parent.layer.msg('编码已存在！ ', {icon: 6,});
                    }
                } else {
                    parent.layer.msg(data.msg, {icon: 6,});
                    parent.layui.table.reload('taskReload', {page: {curr: 1}});
                }
            },
            error: function (data) {
                // 异常提示
                parent.layer.msg('出现网络故障', {icon: 5});
                parent.layer.closeAll('iframe'); //关闭弹框
            }
        });
        return false;
    });
    //修改
    form.on('submit(update)', function (data) {
        var checkStatus = table.checkStatus('taskReloads');
        var data = checkStatus.data;
        var id = "";
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                if (id != "") {
                    id += ",";
                }
                id += "'" + data[i].id + "'";
            }
            $("#earlyId").val(id)
        }e
        $.ajax({
            type: 'POST',
            url: main_url + '/ssd-caselibInfo/updateCaselibInfo',
            data: $("#form1").serialize(),
            dataType: 'json',
            success: function (data) {
                if (data.code == 0) {
                    if (data.result == '1') {
                        // 成功提示框
                        parent.layer.msg('操作成功', {icon: 6,});
                        parent.layer.closeAll('iframe'); //关闭弹框
                        parent.layui.table.reload('taskReload', {page: {curr: 1}});
                    } else {
                        parent.layer.msg('编码已存在！', {
                            icon: 6,
                        });
                    }
                } else {
                    parent.layer.msg(data.msg, {icon: 6,});
                }
            }, error: function (data) {
                // 异常提示
                parent.layer.msg('出现网络故障', {icon: 5});
                parent.layer.closeAll('iframe'); //关闭弹框
            }
        });
        return false;
    });


//预警信息查询
    $('#btnSwarning').on('click', function () {
        reloadTableEarly();
    });

//实况
    $('#btnSLive').on('click', function () {
        reloadTableLive();
    });


    var reloadTableLive = function () {
        var startLive = $("#startLive").val();//开始事件
        var endLive = $("#endLive").val();//结束事件
        table.reload('taskReload', {
            page: {
                curr: 1 //重新从第 1 页开始
            }
            , where: {
                start: startLive,
                end: endLive
            }
        });
    }
    var reloadTableEarly = function () {
        var startwarning = $("#startwarning").val();//开始事件
        var endwarning = $("#endwarning").val();//结束事件
        table.reload('taskReloads', {
            page: {
                curr: 1 //重新从第 1 页开始
            }
            , where: {
                start: startwarning,
                end: endwarning
            }
        });
    }

});

function child(id) {
    $.ajax({
        type: 'get',
        async: false,
        url: main_url + '/ssd-caselibInfo/getCaselibInfoById',
        data: {"id": id},// loginInfo.loginAreaId
        dataType: 'json',
        success: function (data) {
            let datas = data.data
            $("#title").val(datas.TITLE);
            $("#id").val(datas.ID);
            $("#caselibno").val(datas.CASELIBNO);
            $("#start").val(datas.START_TIMES);
            $("#end").val(datas.END_TIMES);
            layedit.setContent(indexs, datas.DESCRIPTION, false);
            /*  $("#content").html(datas.DESCRIPTION);*/
            $("#deathNum").val(datas.DEATH_NUM);
            $("#injuredBun").val(datas.INJURED_NUM);
            $("#transfer").val(datas.TRANSFER_NUM);
            $("#missingNum").val(datas.MISSING_NUM);
            var type = datas.ATTACHMENT_TYPE;
            if (type == 'image') {
                $("#divs").empty();
                var html = '<img src="' + datas.ATTACHMENT_URL + '" id="imgs" name="imgs" style="width: 70px;height: 70px;">'
                $("#divs").append(html)
            } else if (type == 'video') {
                $("#divs").empty();
                var html = '<video src="' + datas.ATTACHMENT_URL + '" controls="controls"  style="width: 460px;height: 150px;"></video>'
                $("#divs").append(html)
            }
        }, error: function () {
            layer.msg("查询异常");
        }
    })
}


function getDay(day) {
    var today = new Date();
    var targetday_milliseconds = today.getTime() - (1000 * 60 * 60 * 24 * day);
    today.setTime(targetday_milliseconds); //注意，这行是关键代码
    var tYear = today.getFullYear();
    var tMonth = today.getMonth() + 1;
    var tDate = today.getDate();
    if (tMonth < 10) {
        tMonth = 0 + "" + tMonth
    }
    if (tDate < 10) {
        tDate = 0 + "" + tDate
    }
    return tYear + "-" + tMonth + "-" + tDate + " 00:00:00";
}



