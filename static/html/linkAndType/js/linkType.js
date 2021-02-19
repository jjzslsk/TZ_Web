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
        ,url: main_url+'/ssd-linkType/listLinkType' //数据接口
        ,title: '友情链接列表'
        ,page: true //开启分页
        ,limits: [15,50,100]
        ,limit:15
        ,data: {"typename": ""}
        ,toolbar: '#info_toolbar' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
        ,defaultToolbar: ['filter', 'print']
        ,totalRow: false //开启合计行
        ,cols: [[ //表头
//            {type: 'checkbox', fixed: 'left'}
            {field: 'zizeng', title: '序号',align:'center',templet:'#orderNumber'}
            ,{field: 'typename', title: '类型名称',align:'center'}
            ,{field: 'exp1', title: '底图颜色',align:'center',templet:function(d){
                    if(d.exp1 == 'purpleColor'){
                        return '紫色';
                    }else if(d.exp1 == 'blueColor'){
                        return '蓝色';
                    }else if(d.exp1 == 'lakeBlueColor'){
                        return '湖蓝色';
                    }else if(d.exp1 == 'greenColor'){
                        return '绿色';
                    }else if(d.exp1 == 'darkGreenColor'){
                        return '墨绿色';
                    }else if(d.exp1 == 'redColor'){
                        return '红色';
                    }else if(d.exp1 == 'yellowColor'){
                        return '橙色';
                    }else{
                        return '';
                    }
                } }
            ,{field: 'sort', title: '顺序',align:'center'  }
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
                    title:"类型添加",
                    type: 2,
                    area: ['470px','470px'],
                    btn: ['保存', '取消'],
                    content:'../linkAndType/linkTypeEdit.html' ,
                    success: function(layero, index){
                        var iframe = window['layui-layer-iframe'+index];
                        iframe.jzym();
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
                var id=data.keyid
                $.ajax({
                    type: 'POST',
                    url: main_url +'/ssd-linkType/delLinkType',
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
                title:"类型更新",
                type: 2,
                area: ['470px','470px'],
                btn: ['修改', '取消'],
                content:'../linkAndType/linkTypeEdit.html',
                success: function(layero, index){
                    var iframe = window['layui-layer-iframe'+index];
                    iframe.child(data.keyid);
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
        var typename = $("#typename").val();
        table.reload('taskReload', {
            page: {
                curr: 1 //重新从第 1 页开始
            }
            ,where: {
                typename:typename
            }
        });
    }
    $('#findBy').on('click', function(){
        reloadTable();
    });

});




