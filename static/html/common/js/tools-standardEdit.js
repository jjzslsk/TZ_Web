
layui.use([ 'layer', 'table','element','laydate','form','upload'], function() {
    var laydate = layui.laydate;
    var table = layui.table //表格
    var form = layui.form;
    var element = layui.element;
    var upload = layui.upload;

    upload.render({
        elem: '#test2'
        ,url: main_url +'/tools/uplodeTools'
        ,accept: 'file' //普通文件
        ,done: function(res){
            if(res.code!='0'){
                layer.msg(res.msg);
            }else{
                $("#file_path").val(res.path)
                $("#servce_path").val(res.servcepath)
                $("#file_pathName").val(res.pathName)
            }
        }
    });


    //监听提交
    form.on('submit(save)', function(data){
        $.ajax({
            type : 'POST',
            url :main_url+'/tools/saveTools',
            data :$("#form1").serialize(),
            dataType : 'json',
            success : function(data) {
                if(data.code == 0){
                    // 成功提示框
                    parent.layer.msg('操作成功', {
                        icon : 6,
                    });
                    parent.layer.closeAll('iframe'); //关闭弹框
                    parent.layui.table.reload('taskReload', {
                        page: {
                            curr: 1 //重新从第 1 页开始
                        }

                    });
                }else{
                    parent.layer.msg(data.msg, {
                        icon : 6,
                    });
                    parent.layer.closeAll('iframe'); //关闭弹框
                    parent.layui.table.reload('taskReload', {
                        page: {
                            curr: 1 //重新从第 1 页开始
                        }

                    });
                }
            },
            error : function(data) {
                // 异常提示
                parent.layer.msg('出现网络故障', {
                    icon : 5
                });
                parent.layer.closeAll('iframe'); //关闭弹框
            }
        });
        return false;
    });
    //修改
    form.on('submit(update)', function(data){
        $.ajax({
            type : 'POST',
            url :main_url+'/tools/updateTools',
            data :$("#form1").serialize(),
            dataType : 'json',
            success : function(data) {
                if(data.code == 0){
                    // 成功提示框
                    parent.layer.msg('操作成功', {
                        icon : 6,
                    });
                    parent.layer.closeAll('iframe'); //关闭弹框
                    parent.layui.table.reload('taskReload', {
                        page: {
                            curr: 1 //重新从第 1 页开始
                        }

                    });
                }else{
                    parent.layer.msg(data.msg, {
                        icon : 6,
                    });
                    parent.layer.closeAll('iframe'); //关闭弹框
                    parent.layui.table.reload('taskReload', {
                        page: {
                            curr: 1 //重新从第 1 页开始
                        }

                    });
                }
            },
            error : function(data) {
                // 异常提示
                parent.layer.msg('出现网络故障', {
                    icon : 5
                });
                parent.layer.closeAll('iframe'); //关闭弹框
            }
        });
        return false;
    });


});

function child(id) {
    $.ajax({
        type: 'get',
        async: false,
        url: main_url + '/tools/getToolsById',
        data: {"id": id},// loginInfo.loginAreaId
        dataType: 'json',
        success: function (data) {
            let datas = data.data
            $("#taskId").val(datas.id);
            $("#name").val(datas.name);
            $("#type").val(datas.type);
            $("#show_order").val(datas.showOrder);
            $("#content").val(datas.content);
            $("#file_pathName").val(datas.filePath);
            layui.use('form', function () {
                var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功
                form.render();
            });
        }, error: function () {
            layer.msg("查询异常");
        }
    })
}
function childd(type) {
    $("#type").val(type);
}


