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
            <page-table ref="table" :height="'40'" remote="requestDutyPostList" :formatPayload="formatPayload" :hidePagination="true">
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
                        {{({'0':'X','1':'√','2':'X'})[row.product]}}
                    </template>
                </el-table-column>
                <el-table-column prop="productInfoName" label="关联产品" />
                <el-table-column prop="remark" label="任务说明"/>
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
    <dialog-form @success="submitSuccess" title="岗位流程配置" :visible.sync="visibleDialogFormItem" :getPayload="()=>formItemFn()" :confirmDisabled="!this.formItem.name||!this.formItem.jobId" remote="requestDialogFormDutyPostItemInput" v-if="formItem">
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
            <el-form-item label="施行顺序" label-width="120px">
                <el-input v-model="formItem.showOrder" type="Number" placeholder="请输入数字" autocomplete="off"></el-input>
            </el-form-item>
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
            <div class="notition-options" v-if="formItem.remind">
                <div>
                    <el-radio-group v-model="formItem.XXXPROP_DUTY_POST_X3">
                        <el-radio-button label="XXXLABEL_DUTY_POST_month">月</el-radio-button>
                        <el-radio-button label="XXXLABEL_DUTY_POST_day">日</el-radio-button>
                        <el-radio-button label="XXXLABEL_DUTY_POST_week">周</el-radio-button>
                    </el-radio-group>
                    <span>时间类型：</span>
                    <el-radio-group v-model="formItem.remindType">
                        <el-radio label="1">阳历</el-radio>
                        <el-radio label="0">农历</el-radio>
                    </el-radio-group>
                </div>
                <div>
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                    <div style="margin: 15px 0;"></div>
                    <el-checkbox-group v-model="checkedItems">
                        <el-checkbox v-for="(item,index) in checkItemOptions" :label="item.value" :key="index">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>

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
               <el-input v-model="formItem.productInfoName" placeholder="请选择产品" @click.native="inputEvent(formItem)" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="其他任务地址" label-width="120px" v-if="formItem.product == '2'">
               <el-input v-model="formItem.other" placeholder="请以http://或者https:// 格式开头"></el-input>
            </el-form-item>
        </template>
    </dialog-form>
</div>
</template>

<script>
import {
    requestDutyPostListDelItem,
    requestPostList,
    requestTreeChildrenOfDutyPostNode,
    requestProductInfoTpyeTreeList,
    requestDialogFormDutyPostItemInput,
    requestDutyPostList,
    requestDutyPostTime
} from "@/remote/";
import {
    mapActions,mapGetters
} from 'vuex'
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
            formItem:{
                XXXPROP_DUTY_POST_X3:'',
            },
            MonthData:[
            {name:'一月',value:'1'},
            {name:'二月',value:'2'},
            {name:'三月',value:'3'},
            {name:'四月',value:'4'},
            {name:'五月',value:'5'},
            {name:'六月',value:'6'},
            {name:'七月',value:'7'},
            {name:'八月',value:'8'},
            {name:'九月',value:'9'},
            {name:'十月',value:'10'},
            {name:'十一月',value:'11'},
            {name:'十二月',value:'12'},
            ],
            WeekData:[
            {name:'一',value:'1'},
            {name:'二',value:'2'},
            {name:'三',value:'3'},
            {name:'四',value:'4'},
            {name:'五',value:'5'},
            {name:'六',value:'6'},
            {name:'日',value:'7'},
            ],
            DayData:[
            {name:'1',value:'1'},
            {name:'2',value:'2'},
            {name:'3',value:'3'},
            {name:'4',value:'4'},
            {name:'5',value:'5'},
            {name:'6',value:'6'},
            {name:'7',value:'7'},
            {name:'8',value:'8'},
            {name:'9',value:'9'},
            {name:'10',value:'10'},
            {name:'11',value:'11'},
            {name:'12',value:'12'},
            {name:'13',value:'13'},
            {name:'14',value:'14'},
            {name:'15',value:'15'},
            {name:'16',value:'16'},
            {name:'17',value:'17'},
            {name:'18',value:'18'},
            {name:'19',value:'19'},
            {name:'20',value:'20'},
            {name:'21',value:'21'},
            {name:'22',value:'22'},
            {name:'23',value:'23'},
            {name:'24',value:'24'},
            {name:'25',value:'25'},
            {name:'26',value:'26'},
            {name:'27',value:'27'},
            {name:'28',value:'28'},
            {name:'29',value:'29'},
            {name:'30',value:'30'},
            {name:'31',value:'31'},
            ],
            treeDataList:null,
            periodType:null,
            postList:null,
            dataTree: null,
            defaultProps: {
                children: 'children',
                label: 'label'
                },
            query: {
                XXXPROP_DUTY_POST_CUSTOM: true
            },
            formItemTimeRange: [],
            checkAll: null,
            checkedItems: [], //已勾选
            dateArr:{
                XXXLABEL_DUTY_POST_month:(new Array(12)).fill('').map((e, i) => ({
                    name: `${i+1}月`,
                    value: `${i+1}`
                })),
                XXXLABEL_DUTY_POST_day:(new Array(31)).fill('').map((e, i) => ({
                    name: `${i+1}`,
                    value: `${i+1}`
                })),
                XXXLABEL_DUTY_POST_week:(new Array(7)).fill('').map((e, i) => ({
                    name: `${i+1}`,
                    value: `${i+1}`
                })),
            }
        };
    },
    
    computed: {
        ...mapGetters(['accountOrgId']),
        actionOfListDelItem() {
            return requestDutyPostListDelItem;
        },
        checkItemOptions() {
            return this.formItem ? ({
                'XXXLABEL_DUTY_POST_month': this.MonthData,
                'XXXLABEL_DUTY_POST_week': this.WeekData,
                'XXXLABEL_DUTY_POST_day': this.DayData
            })[this.formItem.XXXPROP_DUTY_POST_X3] : []

        },
        checkedCount() {
            const checkedItems = this.checkedItems || [];
            const checkedCount = checkedItems.length;
            return checkedCount;
        },

        //indeterminate 是否全选状态效果
        isIndeterminate() {
            const {
                checkedCount,
                checkItemOptions = []
            } = this;
            return checkedCount > 0 && checkedCount < checkItemOptions.length
        },

        //checkAll 是否全选状态  true 或者 false
        checkAll() {
            const {
                checkedCount,
                checkItemOptions = []
            } = this;
            return checkedCount == checkItemOptions.length
        }
    },
    watch: {
        'formItem.product'(val){
            if(!val){
                // this.formItem.productInfoName = null
                // this.formItem.productInfoId = null
            }
        },
        'query.XXXPROP_DUTY_POST_CUSTOM': function() {
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
        checkItemOptions() {
            // this.checkedItems = [];
        },
        'formItem.XXXPROP_DUTY_POST_X3': function(val) {
            if(this.formItem.XXXPROP_DUTY_POST_X3 == '' && !this.formItem.id) return
            const {
                    formItem,
                } = this;
            this.periodType = val

            if(this.formItem.id){
                this.checkedItems = []
                if (val == 'XXXLABEL_DUTY_POST_day') {
                    if(this.formItem.remindDay){
                            this.formItem.remindDay.forEach(i=>{
                            this.checkedItems.push(i)
                        })
                    }
                }else
                if (val == 'XXXLABEL_DUTY_POST_month') {
                    if(this.formItem.remindMonth){
                            this.formItem.remindMonth.forEach(i=>{
                            this.checkedItems.push(i)
                        })
                    }
                }else
                if (val == 'XXXLABEL_DUTY_POST_week') {
                    if(this.formItem.remindWeek){
                            this.formItem.remindWeek.forEach(i=>{
                            this.checkedItems.push(i)
                        })
                    }
                }
            }

            if(!this.formItem.id && this.formItem.remind){
                this.checkedItems = []
                if (val == 'XXXLABEL_DUTY_POST_day') {
                    if(this.formItem.remindDay){
                            this.formItem.remindDay.forEach(i=>{
                            this.checkedItems.push(i)
                        })
                    }
                }else
                if (val == 'XXXLABEL_DUTY_POST_month') {
                    if(this.formItem.remindMonth){
                            this.formItem.remindMonth.forEach(i=>{
                            this.checkedItems.push(i)
                        })
                    }
                }else
                if (val == 'XXXLABEL_DUTY_POST_week') {
                    if(this.formItem.remindWeek){
                            this.formItem.remindWeek.forEach(i=>{
                            this.checkedItems.push(i)
                        })
                    }
                }
            }
        },
        checkedItems(val){
            console.log('2checkedItems::',val)


            console.log('3checkedItems::',this.formItem.XXXPROP_DUTY_POST_X3)
            if(val.length !==  null && this.formItem.XXXPROP_DUTY_POST_X3 == 'XXXLABEL_DUTY_POST_day'){
                this.formItem.remindDay = val
            }


            const {
                formItem
            } = this;
            if(val.length !==  null && this.periodType == 'XXXLABEL_DUTY_POST_day' ){
                formItem.remindDay = val
            }
            if(val.length !==  null && this.periodType == 'XXXLABEL_DUTY_POST_month'){
                formItem.remindMonth = val
            }
            if(val.length !==  null && this.periodType == 'XXXLABEL_DUTY_POST_week'){
                formItem.remindWeek = val
            }
        },
        visibleDialogFormItem(data){
            //初始化弹窗
            console.log('4visibleDialogFormItem::',this.periodType)
            // if(!this.formItem.id) {this.checkedItems=[]} 
            if(this.formItem.id && this.periodType == 'XXXLABEL_DUTY_POST_day'){
                // this.checkedItems = ['1','2']
            }
            if(!data){
                this.checkedItems = []
                this.periodType = ''
                this.formItem = null
                this.visible = false
            }

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
            }else{
                return this.formItem
            }
        },
        submitSuccess(res){
            this.onConfirmUpdate()
        },
        monitorSwitch(data){
            if(data){
                let param = {
                    ...data,
                    "remind":data.remind == true ? '1':'0',
                    "product":data.product == true ? '1':'0',
            }
                requestDialogFormDutyPostItemInput(param).then(res=>{
                        this.onConfirmUpdate()
                })
            }
        },
        formatPayloadLeft(payload){
            return {
                ...payload
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
        inputEvent(item){
            console.log(item)
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
            //     this.visible = !this.visible
            // }
            // else{this.$message.warning('请选择正确的产品');}
        },
        requestData(){
            const loginInfo = JSON.parse(localStorage.getItem('loginInfo',))
            this.loginInfo = loginInfo
            this.query.orgId = this.loginInfo.orgId

            requestPostList({orgId:loginInfo.orgId,pageIndex:'1',pageSize:'20'}).then(res =>{
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
        getFormItemByInputItem(item = {}) {
            if(item.productInfoId){
                requestDutyPostTime({infoId:item.productInfoId}).then(res=>{
                    if(res.data.list.length > 0){
                        this.dutyTime = res.data.list
                        this.formItem.makeTime = item.make_time
                    }else{
                        this.dutyTime = []
                    }
                })
            }
            console.log('item:',item)
            const {
                checkedItems,
            } = this;
            const lastKeyItemClicked = checkedItems && checkedItems.id;
            if(item.startTime&&item.endTime){
                this.formItemTimeRange = [item.startTime, item.endTime];
            }else{
                this.formItemTimeRange = ['20:00','22:00']
            }

            setTimeout(() => {
                if(!item.id){
                    this.formItem.XXXPROP_DUTY_POST_X3 = 'XXXLABEL_DUTY_POST_day'
                    this.periodType == 'XXXLABEL_DUTY_POST_day'
                }
            }, 100);

            return item.id ? {//编辑
                ...item,
                product:JSON.stringify(item.product),
                other:item.other,
                remindType:item.remindType.toString(),
                "XXXPROP_DUTY_POST_X3": 'XXXLABEL_DUTY_POST_day',
            }:{//新建
                "XXXPROP_DUTY_POST_X3": 'XXXLABEL_DUTY_POST_day',
                "remindType": '1',
                other:null,
                product:'2',
            }
        },
        //全选事件
        handleCheckAllChange(val) {
            const {
                checkItemOptions
            } = this;
            this.checkedItems = val ? checkItemOptions.map(e => e.value) : [];
            // this.isIndeterminate = false;
        },
        handleCheckedItemChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.cities.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
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
