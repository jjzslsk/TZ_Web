layui.use([ 'layer', 'table','upload','laydate','form'], function(){
    var laydate = layui.laydate;
    var table = layui.table //表格
    var form = layui.form;
    var $ = layui.$;

    //默认时间
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if(month<10){
        month = "0" + month;
    }
    var day = date.getDate();
    if(day<10){
        day = "0"+day;
    }
    var startDateInit = year + "-" + month + "-" + "01";
    var endDateInit = year + "-" + month + "-" + day;

    laydate.render({
        elem: '#startTime'
        ,value:startDateInit
    });
    laydate.render({
        elem: '#endTime'
        ,value:endDateInit
    });

    //执行一个 table 实例
    table.render({
        id: 'biinfoReload'
        ,elem: '#biinfolist'
        ,height: "full-135"
        ,method:'GET'
        ,url: main_url + '/ssd-reminder-warn/getAllWarn?startTime='+startDateInit+'&endTime='+endDateInit //数据接口
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
            ,{field: 'MINVAL', title: '最小告警值',align:'center'}
            ,{field: 'MAXVAL', title: '最大告警值',align:'center'}
            ,{field: 'DATA_TIME', title: '告警时间',align:'center'}
            ,{field: 'WARN_CONTENT', title: '告警内容',align:'center'}
            ,{field: 'num', title: '告警站点数',align:'center'}
            ,{field: 'ISNOTICE', title: '是否已经通知',align:'center',templet:function(d){
                if(d.ISNOTICE == '0'){
                    return '未通知';
                }else if(d.ISNOTICE == '1'){
                    return '已通知';
                }else{
                    return d.ISNOTICE;
                }
            }}
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


    var reloadTable = function () {
        table.reload('biinfoReload', {
            page: {
                curr: 1 //重新从第 1 页开始
            }
            ,where: {
                element: $("#elementType").val()
                ,startTime:$("#startTime").val()
                ,endTime:$("#endTime").val()
            }
        });
    }

    //监听行工具事件
    table.on('tool(test)', function(obj){
        var data = obj.data //获得当前行数据
            ,layEvent = obj.event; //获得 lay-event 对应的值
        if(layEvent === 'edit'){
            //加载表单
            //执行一个 table 实例
            var ID = data.ID;
            table.render({
                id: 'detailsReload'
                ,elem: '#detailslist'
                ,height: "full-380"
                ,method:'GET'
                ,url: main_url + '/ssd-reminder-warn/getWarnDetailed?warnListId='+ID //数据接口
                ,title: '告警规则列表'
                ,page: true //开启分页
                ,limilt:20
                ,toolbar: '#info_toolbar' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
                ,defaultToolbar: ['filter', 'print']
                ,totalRow: false //开启合计行
                ,cols: [[ //表头
//            {type: 'checkbox', fixed: 'left'}
                    {field: 'STATIONNUM', title: '站点编号',align:'center'}
                    ,{field: 'StationName', title: '站点名称',align:'center'}
                    ,{field: 'WARN_TIME', title: '数据时间',align:'center'}
                    ,{field: 'WARN_VAL', title: '告警值',align:'center'}
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
            layer.open({
                title:"告警详细"
                ,type: 1
                ,area: ['65%','75%']
                ,btn: ['取消']
                ,content: $("#alarmDetails")
                // ,yes: function(index,layero){
                // }
            });
        }else if(layEvent === 'del'){
            layer.confirm('确定删除告警信息(包括告警详情)吗?', function(index){
                $.ajax({
                    type : 'GET',
                    url : main_url + '/ssd-reminder-warn/deleteWarnDetailed',
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
                        layer.msg("删除告警异常");
                    }
                });
            });

        }
    });

});

function closeLayer(){
    layer.closeAll();
    location.reload();
}
