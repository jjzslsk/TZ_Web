var jobids = '';
var table;
layui.use(['form', 'laydate', 'table'], function () {
    var form = layui.form
        , layer = layui.layer
        , laydate = layui.laydate
        , table = layui.table;
    //日期
    laydate.render({
        elem: '#date'
        , range: true
        , change: function (value, date, endDate) {
            // console.log(value); //得到日期生成的值，如：2017-08-18
            var d = new Date();//获取系统当前时间
            var year = d.getFullYear();
            var month = d.getMonth() + 1;
            var day = d.getDate()
            year = year + "-" + month + "-" + day
            var a = value.split(" - ")[0]
            var c = new Date(a);
            var d = new Date(year);
            if (c.getTime() <= d.getTime()) {
                layer.msg("开始日期必须大于或等于当前日期");
            }
            tabLoad(value.split(" - ")[0]);
            loadUser(value.split(" - ")[0]);
        }
    });
    //加载table 初始化头部数据
    var colsData = [];
    //添加岗位信息
    $.ajax({
        type: 'GET',
        url: main_url + '/ssd-business-duty/getJobList',
        data: {"loginOrgId": "fd1411e47c3f4dcb87beaa110a21a979"},
        dataType: 'json',
        success: function (data) {
            if (data.success && data.data != null && data.data.length > 0) {
                var jobArr = data.data;
                // $("#jobList").empty();
                for (let i = 0; i < jobArr.length; i++) {
                    // $("#jobList").append('<input type="checkbox" name="'+jobArr[i].id+'" title="'+jobArr[i].name+'">');
                    colsData.push({'field': jobArr[i].id, 'title': jobArr[i].name});
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

    var tabLoad = function (dateTime) {
        table.render({
            elem: '#tableList'
            , id: 'tableReload'
            , height: "full"
            , method: 'get'
            , url: main_url + '/ssd-business-duty/getDayJobList'
            , where: {"dateTime": dateTime, "loginOrgId": "fd1411e47c3f4dcb87beaa110a21a979"}
            , cols: [colsData]
            , done: function (res, curr, count) {
            }
        });
    }
    //加载默认排班
    var loadUser = function (dateTime) {
        $("#row").hide();
        //保存
        $.ajax({
            type: 'get',
            url: main_url + '/ssd-business-duty/getDutyHisUser',
            data: {"endTime": dateTime, "orgType": '气象台', "orgId": "fd1411e47c3f4dcb87beaa110a21a979"},
            dataType: 'json',
            success: function (data) {
                if (data.success) {
                    var datas = data.data.list//人员
                    var content = data.data.content//
                    if (datas != "" && datas != null) {
                        ulContainer = document.getElementById("rightUl");//leftUl
                        var arr = [];
                        //获取右边的人员循环赋值到左边框中
                        $("#rightUl li").each(function (index, ele) {
                            var id = $(ele).find("span").attr("id");
                            var name = $(ele).find("span").html();
                            addItem("#leftUl", {title: name, id: id});
                            arr.push(index);
                        });
                        //循环删除右边框
                        if (arr != null && arr != "") {
                            for (var i = arr.length - 1; i >= 0; i--) {
                                ulContainer.removeChild(ulContainer.childNodes[i + 1])
                            }
                        }

                        for (var i = 0; i < datas.length; i++) {
                            ulContainer = document.getElementById("leftUl");
                            addItem("#rightUl", {title: datas[i].name, id: datas[i].id});//有边框添加人员
                            //循环左边的框删除
                            $("#leftUl li").each(function (index, ele) {
                                var id = $(ele).find("span").attr("id");
                                var name = $(ele).find("span").html();
                                if (id == datas[i].id) {
                                    ulContainer.removeChild(ulContainer.childNodes[index + 1])
                                }
                            });
                        }
                    } else {//如果为空也要删除右边框的人员

                        var leftarr = [];
                        var rightarr = [];
                        $("#rightUl li").each(function (index, ele) {
                            rightarr.push(index);
                        });
                        $("#leftUl li").each(function (index, ele) {
                            leftarr.push(index);
                        });
                        if (rightarr != null && rightarr != "") {
                            ulContainer = document.getElementById("rightUl");
                            for (var i = rightarr.length - 1; i >= 0; i--) {
                                ulContainer.removeChild(ulContainer.childNodes[i + 1])
                            }
                        }
                        if (leftarr != null && leftarr != "") {
                            ulContainer = document.getElementById("leftUl");
                            for (var i = leftarr.length - 1; i >= 0; i--) {
                                ulContainer.removeChild(ulContainer.childNodes[i + 1])
                            }
                        }
                        user();
                    }
                    if (content != "" && content != null) {
                        $("#row").show();
                        $("#title").html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'  + content);
                    }
                } else {
                    layer.alert(data.message);
                }
            },
            error: function () {
                layer.msg("保存排班信息异常");
            }
        });
    }

    // form.on('checkbox()', function(data){
    //     var jobNames = $("#jobNames").val();
    //     var jobId = data.elem.name;
    //     var jobName = data.elem.title;
    //     if(data.elem.checked){
    //         //勾选
    //         if(jobids==''){
    //             jobids += jobId;
    //             jobNames += jobName;
    //         }else{
    //             jobids += ","+jobId;
    //             jobNames += " > " + jobName;
    //         }
    //         $("#jobNames").val(jobNames);
    //     }else{
    //         //取消勾选
    //         if(jobids.startsWith(jobId)){
    //             if(jobids.indexOf(',')==-1){
    //                 //当前只有一个,清空
    //                 jobids = '';
    //                 jobNames = '';
    //             }
    //             jobids = jobids.replace(jobId+',','');
    //             jobNames = jobNames.replace(jobName+' > ','');
    //         }else{
    //             jobids = jobids.replace(','+jobId,'');
    //             jobNames = jobNames.replace(' > ' + jobName,'');
    //         }
    //         $("#jobNames").val(jobNames);
    //     }
    // });

    $("#saveQuickSch").click(function () {
        //时间
        var date = $("#date").val();
        if (date == null || date == "") {
            layer.alert("请选择排班时间");
            return;
        }
        //用户
        var users = "";
        var names = "";
        var dayNums = "";
        $("#rightUl li").each(function (index, ele) {
            var id = $(ele).find("span").attr("id");
            var dayNum = $(ele).find("input").val();
            var name = $(ele).find("span").html();
            dayNum = dayNum == "" || dayNum == null ? '0' : dayNum;
            users += id + "_" + dayNum + ",";
            names += name + ",";
            dayNums += dayNum + ",";
        });
        if (users.endsWith(",")) {
            users = users.substring(0, users.length - 1);
        }
        if (names.endsWith(",")) {
            names = names.substring(0, names.length - 1);
        }
        if (dayNums.endsWith(",")) {
            dayNums = dayNums.substring(0, dayNums.length - 1);
        }
        if (users == null || users == "") {
            layer.alert("请选择值班人员");
            return;
        }
        // if(jobids==null||jobids==""){
        //     layer.alert("请选择值班岗位");
        //     return;
        // }
        var sendLoadIndex = layer.msg('正在保存...', {
            icon: 16
            , shade: 0.03
            , time: 0
        });

        //保存
        $.ajax({
            type: 'POST',
            url: main_url + '/ssd-business-duty/saveQuickDuty_qxt',
            data: {
                "date": date,
                "users": users,
                "names": names,
                "loginOrgId": "fd1411e47c3f4dcb87beaa110a21a979",
                "dayNum": dayNums,
                "state": ""
            },
            dataType: 'json',
            success: function (data) {
                layer.close(sendLoadIndex);
                if (data.success) {
                    layer.confirm(data.message, {
                        btn: ['确定'] //按钮
                    }, function () {
                        //确认函数
                        layer.closeAll();
                        //调用父页面关闭窗口方法
                        window.parent['vueDefinedMyProp']({name: 'qxt', date: date});
                        // location.reload();  //刷新
                    });

                } else {
                    layer.alert(data.message);
                }
            },
            error: function () {
                layer.close(sendLoadIndex);
                layer.msg("保存排班信息异常");
            }
        });
    });

    $("#backdata").click(function () {
        var index = layer.open({
            type: 1
            , title: '回溯'
            , closeBtn: 1
            , btn: ['提交', '关闭']
            , area: ['700px', '600px']
            , btnAlign: 'c'
            , content: $("#dow")
            , shade: 0.2 //不显示遮罩
            , yes: function () {
                var sendLoadIndex = layer.msg('正在保存...', {
                    icon: 16
                    , shade: 0.03
                    , time: 0
                });
                var a = table.checkStatus('hisDuty')
                var c = a.data;
                if (c != null && c != "" && typeof (c) != "undefined") {
                    var date = c[0].startTime
                    var end = c[0].endTime
                    var users = c[0].userids
                    var names = c[0].usernames
                    var dayNum = c[0].rest_num
                    $.ajax({
                        type: 'POST',
                        url: main_url + '/ssd-business-duty/saveQuickDuty_qxt',
                        data: {
                            "date": date + " - " + end,
                            "users": users,
                            "names": names,
                            "loginOrgId": "fd1411e47c3f4dcb87beaa110a21a979",
                            "dayNum": dayNum,
                            "state": "1"
                        },
                        dataType: 'json',
                        success: function (data) {
                            layer.close(sendLoadIndex);
                            if (data.success) {
                                layer.msg(data.message);
                                layer.close(index);
                                layer.closeAll();
                                //调用父页面关闭窗口方法
                                window.parent['vueDefinedMyProp']({name: 'qxt', date: date + " - " + end});
                            } else {
                                layer.alert(data.message);
                            }
                        },
                        error: function () {
                            layer.close(sendLoadIndex);
                            layer.msg("回溯排班信息异常");
                        }
                    });


                } else {
                    layer.msg("请选择要回溯的行");
                }

            }
        });
        table.render({
            elem: '#hisDuty'
            , url: main_url + '/ssd-business-duty/getHisDutyRecord'
            , method: 'get'
            , where: {"loginOrgId": ""}
            , page: true
            , limilt: 10
            , cols: [[
                {type: 'radio'}
                , {field: 'startTime', title: '开始日期', align: 'center'}
                , {field: 'endTime', title: '结束日期', align: 'center'}
                , {field: 'usernames', title: '排班人员', align: 'center'}
                , {field: 'rest_num', title: '补休天数', align: 'center'}
            ]]
        });
    });
});

/*
 * 向右穿梭
 */
function goRight() {
    var li = $(".list-box li.active");
    if (li.length > 0 && li.parent().attr("id") == 'leftUl') {
        var newLi = li.clone().click(setActive);
        $("#rightUl").append(newLi);
        li.remove();
    }
}

/*
 * 向左穿梭
 */
function goLeft() {
    var li = $(".list-box li.active");
    if (li.length > 0 && li.parent().attr("id") == 'rightUl') {
        var newLi = li.clone().click(setActive);
        $("#leftUl").append(newLi);
        li.remove();
    }
}

/*
 * 向上穿梭
 */
function goUp() {
    var li = $(".list-box li.active");
    if (li.length > 0) {
        if (li.prev().length > 0) {
            var newLi = li.clone().click(setActive);
            li.prev().before(newLi);
            li.remove();
        }
    }
}

/*
 * 向下穿梭
 */
function goDown() {
    var li = $(".list-box li.active");
    if (li.length > 0) {
        if (li.next().length > 0) {
            var newLi = li.clone().click(setActive);
            li.next().after(newLi);
            li.remove();
        }
    }
}

//单击
function setActive() {
    $(".list-box li").removeClass("active");
    $(this).addClass("active");
}

//双击
$("#leftUl").dblclick(function () {
    goRight()
})
$("#rightUl").dblclick(function () {
    goLeft()
})
$(function () {
    $(".list-box li").click(setActive);
    $(".list-tool-indiv .icon.right").click(goRight);
    $(".list-tool-indiv .icon.up").click(goUp);
    $(".list-tool-indiv .icon.down").click(goDown);
    $(".list-tool-indiv .icon.left").click(goLeft);
    $.ajax({
        type: 'GET',
        url: main_url + '/ssd-business-duty/getDutyUser',
        data: {"orgId": "fd1411e47c3f4dcb87beaa110a21a979", "monthTime": ""},
        dataType: 'json',
        success: function (data) {
            if (data.success && data.data != null && data.data.length > 0) {
                var userArr = data.data;
                for (let i = 0; i < userArr.length; i++) {
                    addItem("#leftUl", {title: userArr[i].name, id: userArr[i].id});
                }
            }
        },
        error: function () {
            layer.msg("查询用户信息异常");
        }
    });
})
var user = function () {
    $.ajax({
        type: 'GET',
        url: main_url + '/ssd-business-duty/getDutyUser',
        data: {"orgId": "fd1411e47c3f4dcb87beaa110a21a979", "monthTime": ""},
        dataType: 'json',
        success: function (data) {
            if (data.success && data.data != null && data.data.length > 0) {
                var userArr = data.data;
                for (let i = 0; i < userArr.length; i++) {
                    addItem("#leftUl", {title: userArr[i].name, id: userArr[i].id});
                }
            }
        },
        error: function () {
            layer.msg("查询用户信息异常");
        }
    });
}

function addItem(ul, item) {
    //添加选项时绑定事件
    $("<li>"
        + "<span class='title' id='" + item.id + "'>" + item.title + "</span>"
        + "<input type='text' name='title' required  lay-verify='required' autocomplete='off' class='layui-input'/>"
        + "</li>")
        .appendTo($(ul)).click(setActive);
}

function getItems() {
    var list = [];
    $("#leftUl li").each(function (i, o) {
        var obj = {};
        //自定义参数
        obj.moduleId = $(o).attr('moduleid');
        //是否可见
        obj.seen = -1;
        //排序
        obj.seq = i + 1;
        list.push(obj);
    });
    $("#rightUl li").each(function (i, o) {
        var obj = {};
        obj.moduleId = $(o).attr('moduleid');
        obj.seen = 1;
        obj.seq = i + 1;
        list.push(obj);
    });
    return list;
}
