var zTree;
var keyId = "userId";
var nameId = "channelName";

// $(function(){
//     var taskId = '-999';
//     initTree(taskId);
// });

function initTree(taskId){
    //查询
    $.ajax({
        data:{"areaId":loginInfo.areaId,"taskId":taskId},
        url : main_url+"/ssd-service-user/getServiceUserTree",
        type : "GET",
        cache : false,
        dataType : "json",
        error : function() {
            layer.alert('加载数据出错...');
            return false;
        },
        success : function(data) {
            // var selectId = "${selectId}";
            // var checkParent = "${checkParent}";  //是否回显父节点   true：回显   其他：不回显
            var setting = {
                check: {
                    enable: true,
                    nocheckInherit: false
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onClick: function (e, treeId, treeNode, clickFlag) {
                        zTree.checkNode(treeNode, !treeNode.checked, true,true);
                    },
                }
            };
            // var nodes = eval(data.userTreeDate);
            zTree = $.fn.zTree.init($("#commonTree"), setting, data.userTreeDate);
            // zTree = $.fn.zTree.init($("#commonTree"), setting, data);
            var nodes = zTree.getNodes();
            //默认展开第一级
            // if (nodes.length>0) {
            //     for(var i=0;i<nodes.length;i++){
            //         zTree.expandNode(nodes[i], true, false, false);
            //     }
            // }
            //默认勾选已选中的
            var nodesAll = zTree.transformToArray(nodes);
            var selectIdArr = data.userList;
            if (nodesAll.length>0&&selectIdArr.length>0) {
                for(var i=0;i<nodesAll.length;i++){
                    if(selectIdArr.indexOf(nodesAll[i].id+"")!=-1){
                        zTree.checkNode(nodesAll[i], true, true,false);
                    }
                }
            }
            //SECCESS
        }
    });
}

//根据节点id返回节点name
function getselectNameByNum(){
    //按顺序拼接节点name
    if(selectId!=null&&selectId!=""){
        var selectIdArr = selectId.split(",");
        for(var j = 0 ; j < selectIdArr.length; j++){
            if(selectIdArr[j]!=''){
                var nodes = zTree.getNodesByParam("id", selectIdArr[j], null);
                selectName += nodes[0].name+",";
            }
        }
        selectName=selectName.substring(0,selectName.length-1);
    }
}
//点击取消
function closeZtree(){
    window.parent.layer.close(parent.layer.index);
}
//点击确定
function submitZtree(){
    //获取所有勾选节点
    var cnodes=zTree.getCheckedNodes(true);
    var checkIds="";
    var checkNames = "";
    if(cnodes.length>0){
        for(var i=0;i<cnodes.length;i++){
            if(!cnodes[i].isParent){
                checkIds += cnodes[i].id+",";
            }else if(cnodes[i].pId==null||cnodes[i].pId==0){
                checkNames += cnodes[i].name+",";
            }
        }
        checkIds=checkIds.substring(0,checkIds.length-1);
        checkNames=checkNames.substring(0,checkNames.length-1);
    }

    if(checkIds==""||checkNames==""){
        $("#"+keyId,parent.document).val("");
        $("#"+nameId,parent.document).val("");
        closeZtree();
    }else{
        $("#"+keyId,parent.document).val(checkIds);
        $("#"+nameId,parent.document).val(checkNames);
        closeZtree();
    }
}
