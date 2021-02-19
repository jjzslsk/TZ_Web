
$(function () {
    selectloding();
})
layui.use([ 'layer', 'table','element','laydate','form','upload'], function() {
    var laydate = layui.laydate;
    var table = layui.table //表格
    var form = layui.form;
    var element = layui.element;
    var upload = layui.upload;

    upload.render({
        elem: '#test3'
        ,url: main_url +'/ssd-linkType/upload?type=2'
        //,accept: 'file' //普通文件
        ,done: function(res){
            if(res.code!='0'){
                layer.msg(res.msg);
            }else{
                $("#uplode").show();
                $("#imgs").attr("src",res.path)
                $("#img").val(res.path)
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
            $("#img").val("");
            $("#imgs").hide();
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
                $("#imgs").attr("src", path + "/" + va + "-a.png");
                $("#img").val(path + "/" + va + "-a.png")
            }, error: function () {
                layer.msg("查询异常");
            }
        })
    });
    //监听提交
    form.on('submit(save)', function(data){
        $.ajax({
            type : 'POST',
            url :main_url+'/ssd-link/saveLink',
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
            url :main_url+'/ssd-link/updateLink',
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
        async:false,
        url: main_url +'/ssd-link/getLinkById',
        data: {"id":id},// loginInfo.loginAreaId
        dataType: 'json',
        success: function (data) {
            let datas=data.data
            $("#taskId").val(datas.keyid);
            $("#linkname").val(datas.linkname);
            $("#typeid").val(datas.typeid);
            $("#imgs").val(datas.img);
            $("#description").val(datas.description);
            let link=datas.link;
            if(link.indexOf("http")>=0){
                $("#hhtpType").val("https");
                $("#link").val(datas.link.substring(8,datas.link.length));
            }else{
                $("#hhtpType").val("http");
                $("#link").val(datas.link.substring(7,datas.link.length));
            }

            var exp1=datas.exp1;
            var a=document.getElementsByName("exp1")
            for (var i=0;i<a.length;i++){
                if(a[i].value==exp1){
                    a[i].checked=true;
                }
            }
            $("#exp1").val(datas.exp1);

            $("#imgs").attr("src",datas.img)
            if(datas.img!="" && datas.img !=null){
                $("#uplode").show();
            }
            setTimeout(function () {
                layui.use('form', function(){
                    var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功
                    form.render();
                });
            }, 300);

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
            $("#imgs").attr("src", path + "" + fileName + "-a.png");
            $("#img").val(path + "" + fileName + "-a.png")
        }, error: function () {
            layer.msg("查询异常");
        }
    })
}

function selectloding(){
    $.ajax({
        type: 'get',
        async:false,
        url: main_url +'/ssd-linkType/queryLinkType',
        data: {},
        dataType: 'json',
        success: function (data) {
            let datas=data.data
            $("#typeid").empty();
            var html='';
            for (var i=0;i<datas.length;i++){true
                html+='  <option value="'+datas[i].keyid+'">'+datas[i].typename+'</option>';
            }
            layui.use('form', function () {
                var form = layui.form;
                $("#typeid").append(html);
                form.render('select');
            })
        }, error: function () {
            layer.msg("查询异常");
        }
    })
}
