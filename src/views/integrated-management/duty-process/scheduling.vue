<template>
<div class="duty-process-wrap">
    <div class="actions">
        <c-button type="add" @click="inputItem({})">新增</c-button>
    </div>
    <div class="block-main">
        <div class="left-tree">
            <el-tree :data="dataTree" :props="defaultProps" @node-click="handleNodeClick" default-expand-all></el-tree>
        </div>
        <div class="list">
            <page-table ref="table" :height="'40'" remote="requestDutySchedulingList" :formatPayload="formatPayload" :row-class-name="rowClassName" :hidePagination="true">
                <el-table-column prop="" label="序号" width="50px" type="index"></el-table-column>
                <el-table-column prop="name" label="任务名称" />
                <el-table-column prop="showOrder" label="执行顺序" width="80px" />
                <el-table-column prop="startTime" label="任务开始时间" width="120px" />
                <el-table-column prop="endTime" label="任务结束时间" width="120px" />

                <el-table-column label="是否提醒">
                    <template slot-scope="{row}">
                        {{({'true':'√','false':'X'})[row.remind]}}
                    </template>
                </el-table-column>
                <el-table-column label="是否为产品">
                    <template slot-scope="{row}">
                        {{({'true':'√','false':'X'})[row.product]}}
                    </template>
                </el-table-column>
                <el-table-column prop="productInfoName" label="关联产品" />
                <el-table-column prop="remark" label="任务说明" />
                <el-table-column label="是否完成" width="80px">
                    <template slot-scope="scope">
                        {{scope.row.finish == '1' ?'√':'X'}}
                    </template>
                </el-table-column>
                <el-table-column prop label="操作" width="150px">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="inputItem(scope.row)">编辑</el-button>
                        <c-button type="del" @click="onConfirmDelete(scope.row)">
                            <span class="text-danger">删除</span>
                        </c-button>
                    </template>
                </el-table-column>
            </page-table>
        </div>
    </div>
    <dialog-form @success="submitSuccess" title="值班流程配置" :visible.sync="visibleDialogFormItem" :getPayload="()=>formItemFn()" :confirmDisabled="!formItem.name" remote="requestDialogFormDutySchedulingItemInput" v-if="formItem">
        <template>
            <el-dialog class="popover-box" :modal='false' :visible.sync="visible">
                <el-popover
                placement="top-start"
                width="400"
                v-model="visible"
                trigger="click">
                    <el-tree show-checkbox node-key="id" ref="tree" :check-strictly="true" :data="treeDataList" :props="defaultProps" @check="setSelectedNode" @node-click="handleNodeClickPop"></el-tree>
                </el-popover>
            </el-dialog>

            <el-form-item label="任务来源" label-width="120px">
                <el-select v-model="formItem.source" placeholder="请选择">
                    <el-option label="岗位" value="0"></el-option>
                    <el-option label="个人" value="1"></el-option>
                    <el-option label="临时派发" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="岗位选择" label-width="120px">
                <el-select v-model="formItem.jobId" placeholder="请选择">
                    <el-option v-for="item in postList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="任务名称" label-width="120px">
                <el-input v-model="formItem.name" autocomplete="off" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="任务说明" label-width="120px">
                <el-input v-model="formItem.remark" autocomplete="off" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="执行顺序" label-width="120px">
                <el-input v-model="formItem.showOrder" type="Number" placeholder="请输入数字" autocomplete="off"></el-input>
            </el-form-item>
                <!-- <el-date-picker v-model="formItemTimeRange" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker> -->
            <el-form-item label="起止时间" label-width="120px">
                  <el-time-picker
                    value-format="HH:mm"
                    is-range
                    format="HH:mm"
                    v-model="formItemTimeRange"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    placeholder="选择时间范围">
                </el-time-picker>
            </el-form-item>
            <el-form-item label="是否提醒" label-width="120px">
                <c-switch v-model="formItem.remind"></c-switch>
            </el-form-item>
            <el-form-item label="产品/地址" label-width="120px">
                <el-radio v-model="formItem.product" label="0">非产品</el-radio>
                <el-radio v-model="formItem.product" label="1">产品</el-radio>
                <el-radio v-model="formItem.product" label="2">其他任务地址</el-radio>

                <span v-if="dutyTime.length > 0 && formItem.productInfoName && formItem.product == '1'">选择时次：<el-select v-model="formItem.makeTime" @change="change()" placeholder="请选择">
                    <el-option v-for="(item,index) in dutyTime" :label="item.time" :value="item.time" :key="index"></el-option>
                    </el-select>
                </span>
            </el-form-item>

            <el-form-item label="产品选择" label-width="120px" v-if="formItem.product == '1'">
               <el-input placeholder="请选择产品" v-model="formItem.productInfoName" @click.native="inputEvent(formItem)" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="其他任务地址" label-width="120px" v-if="formItem.product == '2'">
               <el-input v-model="formItem.other" placeholder="请以http://或者https:// 格式开头"></el-input>
            </el-form-item>
            <el-form-item label="是否完成" label-width="120px">
                <c-switch v-model="formItem.finish"></c-switch>
            </el-form-item>
        </template>
    </dialog-form>
</div>
</template>

<script>
import {
    requestProductInfoTpyeTreeList,
    requestPostList,
    requestTreeChildrenOfDutyPostNode,
    requestDutySchedulingListDelItem,
    requestDialogFormDutySchedulingItemInput,
    requestDutyScheduling,
    requestDutyPostTime
} from "@/remote/";
import {
    common,
    witchCommonList,
    withCommonLeftTree
} from '../../mixins/index';
export default {
    mixins: [common, witchCommonList, withCommonLeftTree],
    data() {
        return {
            dutyTime:[],
            visible: false,
            postList:null,
            treeDataList:null,
            periodType:null,
            dataTree: null,
            defaultProps: {
                children: 'children',
                label: 'label'
                },
            query: {
                XXXPROP_DUTY_SCHEDULING_CUSTOM: true
            },
            formItemTimeRange: [],
            // checkAll: false,
            optionsOfCascaderFormInput: [{
                value: 'tzsqxt',
                label: '台州市气象台',
                children: [{
                    value: 'sx',
                    label: '首席',
                    children: [{
                        value: 'dqybsh',
                        label: '短期预报稿审核'
                    }]
                }]
            }]
        };
    },
    computed: {
        actionOfListDelItem() {
            return requestDutySchedulingListDelItem;
        },
    },
    watch: {
        'formItem.product'(val){
            if(val == '2'){//地址
                // this.formItem.productInfoName = null
                // this.formItem.productInfoId = null
            }else if(val == '1'){//产品
                // this.formItem.product_attr = null
            }
        },
        'query.XXXPROP_DUTY_SCHEDULING_CUSTOM': function() {
            this.query.currentPage = 1;
            this.search();
        },
        formItemTimeRange(val) {
            const {
                formItem
            } = this;
            if(!val.length > 0) return
            formItem.startTime = val && val[0];
            formItem.endTime = val && val[1];
        },
        visibleDialogFormItem(data){
            //初始化弹窗
            this.formItem.remindType == '1' ? this.formItem.remindType = '1' : this.formItem.remindType = '0'
        }
    },
    mounted() {
        this.requestData()
    },
    methods: {
        formItemFn(){
            if(this.formItem.product == 1){
                if (!this.formItem.productInfoName){
                    this.$message.warning('请选择产品');
                    return
                }else{
                    return this.formItem
                }
            }else if(this.formItem.product == 2){
                if (!this.formItem.other){
                    this.$message.warning('请输入地址');
                    return
                }else{
                    return this.formItem
                }
            }else if(this.formItem.product == 0){
                this.formItem.productInfoName = null
                this.formItem.other = null
                return this.formItem
            }else{
                return this.formItem
            }
        },
        submitSuccess(res){
            this.onConfirmUpdate()
        },
        monitorSwitch(data){
            if(data){
            console.log("data:",data)
                let param = {
                    ...data,
                    "remind":data.remind == true ? '1':'0',
                    "product":data.product == true ? '1':'0',
            }
                requestDialogFormDutySchedulingItemInput(param).then(res=>{
                        this.onConfirmUpdate()
                })
            }
        },
        handleNodeClick(data) {
            console.log(data);
            this.lastItemClicked = data;
            this.$router.replace({
                query: {
                    id: data.id
                }
            })
        },
        inputEvent(){
            this.visible = !this.visible
        },
        setSelectedNode(data){
            console.log(data)
            this.formItem.makeTime = null
            requestDutyPostTime({infoId:data.id}).then(res=>{
                if(res.data.list.length > 0){
                    this.dutyTime = res.data.list
                    this.formItem.makeTime = this.dutyTime[0].time
                }else{
                    this.dutyTime = []
                }
            })
            this.$refs.tree.setCheckedNodes([data])
            this.formItem.productInfoId = data.id
            this.formItem.productInfoName = data.label
            this.formItem.product_attr = data.treeType == 'product' ? 'info':'type'
        },
        change(){
        this.$forceUpdate()
        },
        handleNodeClickPop(data) {
            console.log(data)
            this.formItem.makeTime = null
            requestDutyPostTime({infoId:data.id}).then(res=>{
                if(res.data.list.length > 0){
                    this.dutyTime = res.data.list
                    this.formItem.makeTime = this.dutyTime[0].time
                }else{
                    this.dutyTime = []
                }
            })
            // if(data.treeType == 'product'){
                this.$refs.tree.setCheckedNodes([data])
                this.formItem.productInfoId = data.id
                this.formItem.productInfoName = data.label
                this.formItem.product_attr = data.treeType == 'product' ? 'info':'type'
                // this.visible = !this.visible
            // }
            // else{this.$message.warning('请选择正确的产品');}
        },
        requestData(){
            const loginInfo = JSON.parse(localStorage.getItem('loginInfo',))
            this.loginInfo = loginInfo
            this.query.orgId = this.loginInfo.orgId

            requestPostList({orgId:this.loginInfo.orgId,pageIndex:'1',pageSize:'20'}).then(res =>{
                this.postList = res.data.list
            })

            requestTreeChildrenOfDutyPostNode({orgId:this.query.orgId}).then(res =>{
                this.dataTree = [
                    {label: '岗位',children: []},
                 ]
                this.dataTree[0].children = res.data.list
                this.dataTree[0].children.map(element => {
                    element.children = []
                    element.label = element.name
                    element.value = element.id
                });
            })

            requestProductInfoTpyeTreeList().then(res =>{
                this.treeDataList = res.data.list;
            })
        },
        treeOfList(tree) {
            tree.map(item => {
                this.treeDataList.push(item);
                if (item.children) {
                this.treeOfList(item.children);
                }
            });
        },
        formatPayload(data) {
            const loginInfo = JSON.parse(localStorage.getItem('loginInfo',))
            const payload = {
                pageIndex: data.currentPage || 1,
                pageSize: 5,
                ...data
            };
            return {
                ...payload,
                userId:loginInfo.id
            }
        },
        getFormItemByInputItem(item = {}) {
            
            if(item.startTime&&item.endTime){
                this.formItemTimeRange = [item.startTime, item.endTime];
            }else{
                this.formItemTimeRange = ['20:00','22:00']
            }
            if(item.id){
                 requestDutyScheduling({id:item.id}).then((res)=>{
                       this.formItem = {
                            // "XXXPROP_DUTY_SCHEDULING_X4": null,
                            id:res.data.id,
                            jobId:res.data.job_id,
                            dutyDate: res.data.duty_date,
                            source: JSON.stringify(res.data.source),
                            jobName: res.data.jobName,
                            name: res.data.name,
                            startTime: res.data.start_time,
                            endTime: res.data.end_time,
                            remind: res.data.is_remind == 1? true:false,
                            finish: res.data.is_finish == 1? true:false,
                            remark: res.data.remark,
                            showOrder: res.data.show_order,
                            product: JSON.stringify(res.data.is_product),
                            other: res.data.other,
                            productInfoId: res.data.product_info_id,
                            productInfoName: res.data.product_info_name,
                            remindType: res.data.remind_type,
                        }

                        if(this.formItem.productInfoId){
                            requestDutyPostTime({infoId:item.productInfoId}).then(res=>{
                                if(res.data.list.length > 0){
                                    this.dutyTime = res.data.list
                                    this.formItem.makeTime = item.make_time
                                }else{
                                    this.dutyTime = []
                                }
                            })
                        }
                        
                    })
            }else{
                return {
                        jobId:this.loginInfo.jobId,
                        other:null,
                        product:'2',
                }
            }

        },


        rowClassName({
            row,
            rowIndex
        }) {
            if (row.XXXPROP_DUTY_SCHEDULING_IMPRESS) {
                return 'row-impress'
            }
        }
    }
}
</script>

<style lang="postcss" scoped>
.actions{
    margin-bottom: 10px;
}
.actions-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.block-main{
    display: flex;

    >.list{
        flex: 1;
    }
    .left-tree{
        border: 1px solid #ddd;
        width: 220px;
    }
}
.notition-options{
    margin-left: 52px;
    padding: 20px 25px;
    background:rgba(246,247,251,1);
    border-radius:4px;
}
</style>
<style lang="postcss">
.duty-process-wrap {
    .el-popover{
        height: 600px !important;
        overflow: auto;
    }
    .actions{
            height: 31px;
        }
    .block-main {
        height: calc(100%-31px);
        .el-tree{
            height: 100%;
            .el-tree-node{
                height: 100% !important;
                overflow-y: auto;
            }
        }
        .list{
            .list-table{
                height: 100%;
            }
        }
    }
}
</style>
