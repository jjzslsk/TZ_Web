var keyItem = 0;
layui.use([ 'layer', 'table','element','laydate','form'], function(){
    var laydate = layui.laydate;
    var table = layui.table //表格
    var form = layui.form;
    var element = layui.element;
    //执行一个 table 实例
    table.render({
        id: 'taskReload'
        ,elem: '#tasklist'
        ,height: "full-135"
        ,method:'GET'
        ,url: main_url+'/ssd-reminder-alarm/listAlarmServer' //数据接口
        ,title: '提醒服务任务列表'
        ,page: true //开启分页
        ,limilt:20
        ,data: {"taskName": taskName,"taskCode": taskCode,"taskType":"taskType","state":"state"}
        ,toolbar: '#info_toolbar' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
        ,defaultToolbar: ['filter', 'print']
        ,totalRow: false //开启合计行
        ,cols: [[ //表头
//            {type: 'checkbox', fixed: 'left'}
            {field: 'taskName', title: '任务名称',align:'center'}
            ,{field: 'taskCode', title: '任务编号',align:'center' }
            ,{field: 'taskType', title: '任务类型',align:'center' ,templet:function(d){
                    if(d.taskType == '1'){
                        return '预警状态';
                    }else if(d.taskType == '2'){
                        return '警戒状态';
                    }else if(d.taskType == '3'){
                        return '关注状态';
                    }else{
                        return d.taskType;
                    }
                }}
            ,{field: 'state', title: '开启状态',align:'center' ,templet:function(d){
                    if(d.state == '0'){
                        return '不开启';
                    }else if(d.state == '1'){
                        return '开启';
                    }else{
                        return d.state;
                    }
                }}
            ,{field: 'taskRule', title: '任务规则',align:'center'}
            ,{field: 'describe', title: '规则说明',align:'center'}
            ,{field: 'dataType', title: '数据类型',align:'center',templet:function(d){
                    if(d.dataType == '0'){
                        return '实况数据';
                    }else if(d.dataType == '1'){
                        return '预报数据';
                    }else{
                        return '';
                    }
                }}
            ,{fixed: 'right',  title: '操作', align:'center', toolbar: '#barList',width:250}
        ]]
        ,data:[]
        ,done: function (res, curr, count) {

        }
    });

    var $ = layui.$, active = {
        reload: function(){
            //执行重载
            reloadTable();
        }
    };

    //监听头工具栏事件
    table.on('toolbar(test)', function(obj){
        var checkStatus = table.checkStatus(obj.config.id)
            ,data = checkStatus.data; //获取选中的数据
        switch(obj.event){
            case 'add':
                layer.open({
                    title:"服务任务配置-新增",
                    type: 2,
                    area: ['950px','710px'],
                    btn: ['保存', '取消'],
                    content:'../alarmServer/serverTaskEdit.html' ,
                    yes: function(index,layero){
                        // 获取iframe层的body
                        var body = layer.getChildFrame('body', index);
                        // 找到隐藏的提交按钮模拟点击提交
                        body.find('#permissionSubmit').click();

                    }
                });
                break;
        };
    });


    //监听行工具事件
    table.on('tool(test)', function(obj){
        var data = obj.data //获得当前行数据
            ,layEvent = obj.event; //获得 lay-event 对应的值
        if(layEvent === 'del'){//删除
            layer.confirm('确定删除吗?', function(index){
              var id=data.id
                $.ajax({
                    type: 'POST',
                    url: main_url +'/ssd-reminder-alarm/delServerTask',
                    data: {"id":id},// loginInfo.loginAreaId
                    dataType: 'json',
                    success: function (data) {
                        layer.msg(data.msg);
                        $('#findBy').click();
                    }, error: function () {
                        layer.msg("删除异常");
                    }
                })
            });
        } else if(layEvent === 'edit'){//修改
            layer.open({
                title:"服务任务配置-修改",
                type: 2,
                area: ['950px','710px'],
                btn: ['修改', '取消'],
                content:'../alarmServer/serverTaskEdit.html',
                success: function(layero, index){
                    var iframe = window['layui-layer-iframe'+index];
                    iframe.child(data.id);
                },
                yes: function(index,layero){
                    // 获取iframe层的body
                    var body = layer.getChildFrame('body', index);
                    // 找到隐藏的提交按钮模拟点击提交
                    body.find('#updateSubmit').click();

                }
            });
        }
    });

    var reloadTable = function () {
        var taskName = $("#taskName").val();
        var taskCode=document.getElementById("taskCode").value;
        var taskType=document.getElementById("taskType").value;
        var state=document.getElementById("state").value;
        var dataType=document.getElementById("dataType").value;
        table.reload('taskReload', {
            page: {
                curr: 1 //重新从第 1 页开始
            }
            ,where: {
                taskName:taskName
                ,taskCode:taskCode
                ,taskType:taskType
                ,state:state
                ,dataType:dataType
            }
        });
    }
    $('#findBy').on('click', function(){
        reloadTable();
    });

});




