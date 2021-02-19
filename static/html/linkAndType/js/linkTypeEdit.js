layui.use([ 'layer', 'table','element','laydate','form','upload'], function() {
    var laydate = layui.laydate;
    var table = layui.table //表格
    var form = layui.form;
    var element = layui.element;
    var upload = layui.upload;
    upload.render({
        elem: '#test3'
        ,url: main_url +'/ssd-linkType/upload?type=1'
        //,accept: 'file' //普通文件
        ,done: function(res){
            if(res.code!='0'){
                layer.msg(res.msg);
            }else{
                $("#uplode").show();
                $("#imgurls").attr("src",res.path)
                $("#imgurl").val(res.path)
            }
        }
    });
    //监控下拉框改变事件
    form.on('select(defaultimg)', function(data){
        if (data.value == "0") {
            $("#selectim").show();
            $("#imgss").hide();
            $("#msg").hide();
        } else {//上传图片
            $("#selectim").hide();
            $("#imgss").show();
            $("#msg").show();
            $("#imgurl").val("");
            $("#imgurls").hide();
        }
    });
    form.on('select(selectimg)', function(data){
        var va = data.value
        $.ajax({
            type: 'get',
            async: false,
            url: main_url + '/ssd-linkType/getImgUrl',
            data: {},// loginInfo.loginAreaId
            dataType: 'json',
            success: function (data) {
                var path = data.path
                $("#imgurls").attr("src", path + "" + va + "-a.png");
                $("#imgurl").val(path + "" + va + "-a.png")
            }, error: function () {
                layer.msg("查询异常");
            }
        })
    });
    //监听提交
    form.on('submit(save)', function(data){
        $.ajax({
            type : 'POST',
            url :main_url+'/ssd-linkType/saveLinkType',
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
            url :main_url+'/ssd-linkType/updateLinkType',
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
        url: main_url + '/ssd-linkType/getLinkTypeById',
        data: {"id": id},// loginInfo.loginAreaId
        dataType: 'json',
        success: function (data) {
            let datas = data.data
            $("#taskId").val(datas.keyid);
            $("#typename").val(datas.typename);
            $("#sort").val(datas.sort);
            $("#exp1").val(datas.exp1); ;
            $("#imgurls").attr("src",datas.imgurl)
            if(datas.imgurl !="" || datas.imgurl!=null){
                $("#uplode").show();
            }
            layui.use('form', function () {
                var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功
                form.render();
            });
        }, error: function () {
            layer.msg("查询异常");
        }
    })
}


function jzym() {
    var fileName = $("#selectimg").val();
    $.ajax({
        type: 'get',
        async: false,
        url: main_url + '/ssd-linkType/getImgUrl',
        data: {},// loginInfo.loginAreaId
        dataType: 'json',
        success: function (data) {
            var path = data.path
            $("#imgurls").attr("src", path + "" + fileName + "-a.png");
            $("#imgurl").val(path + "" + fileName + "-a.png")
        }, error: function () {
            layer.msg("查询异常");
        }
    })
}
