//全局定义一次, 加载formSelects
layui.config({
    base: '../../layui/select/' //此处路径请自行处理, 可以使用绝对路径
}).extend({
    formSelects: 'formSelects-v4'
});
layui.use([ 'layer', 'table','upload','laydate','formSelects','form'], function(){
    var laydate = layui.laydate;
    var formSelects = layui.formSelects;
    var table = layui.table //表格
    var form = layui.form;
    //执行一个 table 实例
    table.render({
        id: 'biinfoReload'
        ,elem: '#biinfolist'
        ,height: "full-135"
        ,method:'GET'
        ,url: main_url + '/ssd-reminder-warn/getAlarmConfigListPage' //数据接口
        ,title: '告警规则列表'
        ,page: true //开启分页
        ,limilt:20
        ,toolbar: '#info_toolbar' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
        ,defaultToolbar: ['filter', 'print']
        ,totalRow: false //开启合计行
        ,cols: [[ //表头
//            {type: 'checkbox', fixed: 'left'}
            {field: 'TITLE', title: '名称',align:'center'}
            ,{field: 'ELEMENT', title: '要素',align:'center',templet:function(d){
                if(d.ELEMENT == 'T'){
                    return '气温';
                }else if(d.ELEMENT == 'Tx'){
                    return '最高气温';
                }else if(d.ELEMENT == 'Tn'){
                    return '最低气温';
                }else if(d.ELEMENT == 'RR'){
                    return '雨量';
                }else if(d.ELEMENT == 'fFy'){
                    return '风力';
                }else if(d.ELEMENT == 'U'){
                    return '湿度';
                }else if(d.ELEMENT == 'P'){
                    return '气压';
                }else if(d.ELEMENT == 'VV'){
                    return '能见度';
                }else{
                    return d.ELEMENT;
                }
            }}
            ,{field: 'STATIONTYPE', title: '站点类型',align:'center'}
            ,{field: 'FARMULA', title: '统计方式',align:'center',templet:function(d){
                if(d.FARMULA == 'max'){
                    return '最大值';
                }else if(d.FARMULA == 'min'){
                    return '最小值';
                }else if(d.FARMULA == 'sum'){
                    return '总和';
                }else if(d.FARMULA == 'avg'){
                    return '平均值';
                }else{
                    return d.FARMULA;
                }
            }}
            ,{field: 'MINVAL', title: '最小告警值',align:'center'}
            ,{field: 'MAXVAL', title: '最大告警值',align:'center'}
            ,{field: 'WARN_CONTENT', title: '告警内容',align:'center'}
            ,{field: 'BEFORE_HOUR', title: '统计时间(小时)',align:'center'}
            ,{field: 'VALIDITY_TIME', title: '提醒时长(分钟)',align:'center'}
            ,{field: 'STATION_NUM', title: '出现站点数',align:'center'}
            ,{fixed: 'right',  title: '操作', align:'center', toolbar: '#barList',width:250}
        ]]
        ,done: function (res, curr, count) {
            // $("[data-field='state']").children().each(function () {
            //     var value = $(this).text();
            //     if(value == '正常'){
            //         $(this).attr("style","color:green");
            //     }else if (value == '过期') {
            //         $(this).attr("style","color:#EA6034");
            //     }
            // });
        }
    });

    var $ = layui.$, active = {
        reload: function(){
            //执行重载
            reloadTable();
        }
    };
    $('.demoTable .layui-btn').on('click', function(){
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    formSelects.data('STATIONTYPE', 'server', {
        url: main_url + '/ssd-reminder-warn/getAlarmStationType'
    });

    //监听头工具栏事件
    table.on('toolbar(test)', function(obj){
        var checkStatus = table.checkStatus(obj.config.id)
            ,data = checkStatus.data; //获取选中的数据
        switch(obj.event){
            case 'add':
                openEdit();
                break;
        };
    });


    //监听行工具事件
    table.on('tool(test)', function(obj){
        var data = obj.data //获得当前行数据
            ,layEvent = obj.event; //获得 lay-event 对应的值
        if(layEvent === 'del'){
            layer.confirm('确定删除吗?', function(index){
                $.ajax({
                    type : 'GET',
                    url : main_url + '/ssd-reminder-warn/deleteAlarmConfig',
                    data :{"ID":data.ID},
                    dataType : 'json',
                    success: function (data) {
                        if(data.success){
                            layer.msg("删除成功", {
                                icon : 6,
                            });
                        }else{
                            layer.msg(data.msg, {
                                icon : 5,
                            });
                        }
                        reloadTable();
                    },
                    error: function () {
                        layer.msg("删除告警规则异常");
                    }
                });
            });
        } else if(layEvent === 'edit'){
            $.ajax({
                url: main_url + '/ssd-reminder-warn/getAlarmConfig',
                type:'GET',
                dataType: 'json',
                data: {"ID":data.ID},
                success: function (res) {
                    if (res.success){
                        var data = res.data;
                        //回显
                        form.val("formTest", { //formTest 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
                            "ID":data.ID
                            ,"TITLE": data.TITLE // "name": "value"
                            ,"ELEMENT": data.ELEMENT
                            ,"FARMULA": data.FARMULA
                            ,"MINVAL": data.MINVAL
                            ,"MAXVAL": data.MAXVAL
                            ,"WARN_CONTENT": data.WARN_CONTENT
                            ,"BEFORE_HOUR": data.BEFORE_HOUR
                            ,"VALIDITY_TIME": data.VALIDITY_TIME
                            ,"STATION_NUM": data.STATION_NUM
                        });
                        formSelects.value('STATIONTYPE', data.STATIONTYPE.split(","));
                        openEdit();

                    }else{
                        layer.alert(res.msg);
                    }
                },
                error: function (result) {
                    layer.msg("获取告警配置异常");
                }
            });
        }
    });
    //打开告警规则编辑窗口
    var openEdit = function(){
        layer.open({
            title:"告警规则",
            type: 1,
            area: ['65%','90%'],
            btn: ['保存', '取消'],
            content: $("#alarmEditDiv"),
            yes: function(index,layero){
                //ID
                var ID = $("#ID").val();
                //表单验证
                var checkForm = ckForm();
                if(!checkForm){
                    return;
                }
                //表单数据
                var formData = $("#form1").serialize();
                //站点类型
                var STATIONTYPE = formSelects.value('STATIONTYPE', 'valStr');
                formData += "&STATIONTYPE="+STATIONTYPE;
                //如果ID不为空为修改,ID为空则为添加
                var url = main_url + '/ssd-reminder-warn/saveAlarmConfig';
                var tip = "添加";
                if(ID!=null&&ID!=''){
                    tip = "修改";
                    url = main_url + '/ssd-reminder-warn/updateAlarmConfig';
                }
                //保存
                $.ajax({
                    url: url,
                    type:'POST',
                    dataType: 'json',
                    // contentType: "application/json; charset=utf-8",
                    data: formData,
                    success: function (res) {
                        if (res.success){
                            layer.confirm(tip+'告警规则成功', {
                                btn: ['确定'] //按钮
                            }, function(){
                                //确认函数
                                location.reload();  //刷新
                            });
                        }else{
                            layer.alert(res.msg);
                        }
                    },
                    error: function (result) {
                        layer.msg("保存告警配置异常");
                    }
                });
            }
            ,end:function(){
                //关闭回调,清空表单信息
                $("#form1")[0].reset();
                formSelects.value('STATIONTYPE', []);
            }
        });
    }

    var reloadTable = function () {
        table.reload('biinfoReload', {
            page: {
                curr: 1 //重新从第 1 页开始
            }
            ,where: {
                element: $("#elementType").val()
            }
        });
    }
    //表单验证
    var ckForm = function() {
        //名称
        var TITLE = $("#TITLE").val();
        if(TITLE==null||TITLE==''){
            layer.msg("名称不能为空");
            return false;
        }
        //要素
        var ELEMENT = $("#ELEMENT").val();
        if(ELEMENT==null||ELEMENT==''){
            layer.msg("请选择要素");
            return false;
        }
        //站点类型
        var STATIONTYPE = formSelects.value('STATIONTYPE', 'valStr');
        if(STATIONTYPE==null||STATIONTYPE==''){
            layer.msg("请选择站点类型");
            return false;
        }
        //统计方式
        var FARMULA = $('#FARMULADIV input[name="FARMULA"]:checked ').val();
        if(FARMULA==null||FARMULA==''){
            layer.msg("请选择统计方式");
            return false;
        }
        //最小告警值
        var MINVAL = $("#MINVAL").val();
        if(MINVAL==null||MINVAL==''){
            layer.msg("请输入最小告警值");
            return false;
        }
        //最大告警值
        var MAXVAL = $("#MAXVAL").val();
        if(MAXVAL==null||MAXVAL==''){
            layer.msg("请输入最大告警值");
            return false;
        }
        //匹配数字的正则
        var numReg = new RegExp(/^(\-|\+)?\d+(\.\d+)?$/);
        if(MINVAL!=null&&MINVAL!=""){
            if(!numReg.test(MINVAL)){
                layer.msg("最小告警值只能是数字");
                return false;
            }
        }
        if(MAXVAL!=null&&MAXVAL!=""){
            if(!numReg.test(MAXVAL)){
                layer.msg("最大告警值只能是数字");
                return false;
            }
        }
        //告警内容
        var WARN_CONTENT = $("#WARN_CONTENT").val();
        if(WARN_CONTENT==null||WARN_CONTENT==''){
            layer.msg("请输入告警内容");
            return false;
        }
        //匹配正整数的正则
        var positiveIntegerReg = new RegExp(/^[0-9]\d*$/);
        //统计时间
        var BEFORE_HOUR = $("#BEFORE_HOUR").val();
        if(BEFORE_HOUR==null||BEFORE_HOUR==''){
            layer.msg("请输入统计时间");
            return false;
        }
        if(!positiveIntegerReg.test(BEFORE_HOUR)){
            layer.msg("统计时间只能是正整数");
            return false;
        }
        //提醒时长
        var VALIDITY_TIME = $("#VALIDITY_TIME").val();
        if(VALIDITY_TIME==null||VALIDITY_TIME==''){
            layer.msg("请输入提醒时长");
            return false;
        }
        if(!positiveIntegerReg.test(VALIDITY_TIME)){
            layer.msg("提醒时长只能是正整数");
            return false;
        }
        //出现站点数
        var STATION_NUM = $("#STATION_NUM").val();
        if(STATION_NUM==null||STATION_NUM==''){
            layer.msg("请输入出现站点数");
            return false;
        }
        if(!positiveIntegerReg.test(STATION_NUM)){
            layer.msg("出现站点数只能是正整数");
            return false;
        }
        return true;
    }

});

function closeLayer(){
    layer.closeAll();
    location.reload();
}
