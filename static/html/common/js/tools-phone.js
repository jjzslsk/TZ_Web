
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
        ,url: main_url+'/tools/listTools' //数据接口
        ,title: '业务规范列表'
        ,page: true //开启分页
        ,limits: [15,50,100]
        ,limit:15
        ,where:{"type":"phone"}
        ,toolbar: '#info_toolbar' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
        ,defaultToolbar: ['filter', 'print']
        ,totalRow: false //开启合计行
        ,cols: [[ //表头
            {field:'id', title: '序号', sort: true,templet:'#orderNumber'}
            ,{field:'name', title: '名称'} //width 支持：数字、百分比和不填写。你还可以通过 minWidth 参数局部定义当前单元格的最小宽度，layui 2.2.1 新增
            ,{field:'filePath', title: '号码'}
            ,{field:'content', title: '备注'}
            ,{field:'publishDate', title: '发布日期'}
            ,{field:'oper', title: '操作',toolbar: '#barList',width:250}
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
                    title:"业务规范添加",
                    type: 2,
                    area: ['550px','400px'],
                    btn: ['保存', '取消'],
                    content:'../common/tools-typeEdit.html',
                    success: function(layero, index){
                        var iframe = window['layui-layer-iframe'+index];
                        iframe.childd("phone","号码");
                    },
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
                    url: main_url +'/tools/delTools',
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
                title:"业务规范更新",
                type: 2,
                area: ['550px','400px'],
                btn: ['修改', '取消'],
                content:'../common/tools-typeEdit.html',
                success: function(layero, index){
                    var iframe = window['layui-layer-iframe'+index];
                    iframe.child(data.id,"号码");
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
        var content = $("#content").val();
        var name = $("#name").val();
        table.reload('taskReload', {
            page: {
                curr: 1 //重新从第 1 页开始
            }
            ,where: {
                content:content,
                name:name,
                type:"file"
            }
        });
    }
    $('#findBy').on('click', function(){
        reloadTable();
    });

});
