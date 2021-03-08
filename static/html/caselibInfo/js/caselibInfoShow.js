
layui.use([ 'layer', 'table','element','laydate','form'], function(){
    var laydate = layui.laydate;
    var table = layui.table //表格
    var form = layui.form;
    var element = layui.element;

        laydate.render({
            elem: '#start'
            ,type: 'datetime'
        });
        laydate.render({
            elem: '#end'
            ,type: 'datetime'
        });
    //执行一个 table 实例
    table.render({
        id: 'taskReload'
        ,elem: '#tasklist'
        ,height: "full-135"
        ,method:'GET'
        ,url: main_url+'/ssd-caselibInfo/listCaselibInfo' //数据接口
        ,title: '案例管理列表'
        ,page: true //开启分页
        ,limits: [15,50,100]
        ,limit:15
        ,data: {}
        ,toolbar: '#info_toolbar' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
        ,defaultToolbar: ['filter', 'print']
        ,totalRow: false //开启合计行
        ,cols: [[ //表头
//            {type: 'checkbox', fixed: 'left'}
            {field: 'TITLE', title: '标题',align:'center'}
            ,{field: 'CASELIBNO', title: '案列编码',align:'center' }
            ,{field: 'START_TIME', title: '开始时间',align:'center'  }
            ,{field: 'END_TIME', title: '结束时间',align:'center'}
            ,{field: 'DEATH_NUM', title: '死亡人数',align:'center'  }
            ,{field: 'INJURED_NUM', title: '受伤人数',align:'center'  }
            ,{field: 'TRANSFER_NUM', title: '转移人数',align:'center'  }
            ,{field: 'MISSING_NUM', title: '失踪人数',align:'center'  }
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
                    title:"案例管理添加",
                    type: 2,
                    area: ['1000px','920px'],
                    btn: ['保存', '取消'],
                    content:'../caselibInfo/caselibInfoEdit.html' ,
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
                var id=data.ID
                $.ajax({
                    type: 'POST',
                    url: main_url +'/ssd-caselibInfo/delCaselibInfo',
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
                title:"案例管理更新",
                type: 2,
                area: ['1000px','920px'],
                btn: ['修改', '取消'],
                content:'../caselibInfo/caselibInfoEdit.html' ,
                success: function(layero, index){
                    var iframe = window['layui-layer-iframe'+index];
                    iframe.child(data.ID);
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
        var title = $("#title").val();
        var caselibno = $("#caselibno").val();
        var start = $("#start").val();
        var end = $("#end").val();
        table.reload('taskReload', {
            page: {
                curr: 1 //重新从第 1 页开始
            }
            ,where: {
                title:title,
                caselibno:caselibno,
                start:start,
                end:end
            }
        });
    }
    $('#findBy').on('click', function(){
        reloadTable();
    });

});




