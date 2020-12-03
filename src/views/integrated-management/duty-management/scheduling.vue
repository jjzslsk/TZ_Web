<template>
<div class="page-wrapper scheduling">
    <el-container>
        <el-main>
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="primary">排班管理</span>
                </div>
                    <div class="content-list">
                        <page-table ref="table" :key="tableKey" remote="requestSchedulingList" :formatPayload="formatPayload" :hidePagination="true" :row-class-name="tableRowClassName">
                        <!-- <page-table ref="table" :formatPayload="formatPayload" :row-class-name="tableRowClassName"> -->
                            <div class="actions" slot="actions">
                                <span class="title">选择月份</span>
                                <el-date-picker :clearable='false' :disabled="editCol" v-model="query.monthTime" format="yyyy-MM" value-format="yyyy-MM" type="month" placeholder="选择月"></el-date-picker>
                                <c-button type="search" @click="search()" :disabled="editCol">查询</c-button>
                                <c-button type="search" v-if="!editCol && showBut" @click="editCol=!editCol">编辑</c-button>
                                <c-button v-if="editCol" @click="cancelEdit">取消</c-button>
                                <c-button type="search" v-if="editCol" @click="submitEdit">保存</c-button>
                                    <c-button  type="search" v-if="!editCol && showBut" :disabled="editCol" @click="inputItem()">导入</c-button>
                                    <c-button type="search" :disabled="editCol" @click="downloadExcel()">导出</c-button>
                                    <c-button type="search" :disabled="editCol" v-if="quickDutyXxfwzx" @click="quickScheduling('service')">服务中心排班</c-button>
                                    <c-button type="search" :disabled="editCol" v-if="quickDutyQxt" @click="quickScheduling('observatory')">气象台排班</c-button>
                                    <span class="title title-remark">*</span>
                                    <el-input
                                    class="remark"
                                    size="mini"
                                    placeholder="请输入排班备注"
                                    v-model="remark"
                                    @blur="onInputBlur"
                                    >
                                    </el-input>
                            </div>
                            <el-table-column prop="dutyDate" label="日期" width="60px"></el-table-column>
                            <el-table-column prop="weekDate" label="星期" width="60px"/>
                            <!-- <template v-for="item in userList" :key="index"> -->
                            <!-- <el-table-column v-for="(item,index) in userList" :prop="item.dutyDate" :label="item.userName" :key="index"> name == '台州气象台'? 'right':''
                            </el-table-column> -->
                            <!-- </template> -->

                            <el-table-column v-for="({name,id},index) in persons" :prop="name" :label="name" :key="index">
                            <!-- <el-table-column v-for="({name,id},index) in persons" :prop="name" :label="name" :key="index" :fixed="tableFixed(name,id)"> -->
                                <template slot-scope="scope" >
                                    <div class="col-box" :class="editCol == true && scope.row.currentDate.split('-').join('') >= serviceDay.split('-').join('') ? 'col-box-bg':''" @click="tableColumClick(scope.row[id],scope)">
                                    <div v-if="name !== '首席'">
                                        <el-select v-if="showSelectId == scope.row[id] && editCol && colName == scope.column.label && colDuty == scope.row.dutyDate && scope.row.currentDate.split('-').join('') >= serviceDay.split('-').join('')" v-model="scope.row[id]" @change="changeTelescopic(index,scope.row[id],scope.row,name,id)" placeholder="选择" :class="`scheduling-${scope.row[id]}`">
                                            <el-option v-for="{name,id} in postList" :label="name" :value="id" :key="id"></el-option>
                                        </el-select>
                                        <span @click="itemClick(scope.row[id])" type="text" v-else>
                                            <span :class="editCol? 'color-blue':'color-black'" v-for="item in postList" :key="item.id" v-if="scope.row[id] == item.id" :style="item.name == '短临'? 'font-weight: bold;font-size:15.5px;color:#000':'' || item.name == '短期'? 'font-weight: bold;font-size:15.5px;color:#000':'' || item.name == '补休'? 'font-weight: bold;font-size:15.5px;background-color: #76c07b !important;color:#fff !important;':'' || item.name == '班休'? 'font-weight: bold;font-size:15.5px;background-color: #76c07b !important;color:#fff !important;':''" >{{item.name}}</span>
                                        </span>
                                    </div>

                                    <div v-if="name == '首席'">
                                        <el-select v-if="showSelectId == scope.row[id] && editCol && colName == scope.column.label && colDuty == scope.row.dutyDate" v-model="scope.row[id]" @change="changeTelescopic(index,scope.row[id],scope.row,name,id)" placeholder="选择" :class="`scheduling-${scope.row[id]}`">
                                            <el-option v-for="{name,id} in postUserList" :label="name" :value="id" :key="id"></el-option>
                                        </el-select>
                                        <span @click="itemClick(scope.row[id])" type="text" v-else>
                                            <span :class="editCol? 'color-blue':'color-black'" v-for="item in postUserList" :key="item.id" v-if="scope.row[id] == item.id" :style="item.name == '短临'? 'font-weight: bold;font-size:15.5px;color:#000':'' || item.name == '短期'? 'font-weight: bold;font-size:15.5px;color:#000':'' || item.name == '补休'? 'font-weight: bold;font-size:15.5px;background-color: #76c07b !important;color:#fff !important;':'' || item.name == '班休'? 'font-weight: bold;font-size:15.5px;background-color: #76c07b !important;color:#fff !important;':''">{{item.name}}</span>
                                        </span>
                                    </div>
                                    </div>
                                    <!-- <el-select v-model="scope.row[id]" @change="changeTelescopic(index,scope.row[id],scope.row,name,id)" placeholder="请选择" v-if="scope.row[id] && editCol" :class="`scheduling-${scope.row[id]}`"> -->
                                    <!-- <el-select v-model="scope.row[id]" @change="changeTelescopic(index,scope.row[id],scope.row,name,id)" placeholder="请选择" v-show="editCol && name !== '首席'" :class="`scheduling-${scope.row[id]}`">
                                        <el-option v-for="{name,id} in postList" :label="name" :value="id" :key="id"></el-option>
                                    </el-select>
                                    <el-select v-model="scope.row[id]" @change="changeTelescopic(index,scope.row[id],scope.row,name,id)" placeholder="请选择" v-show="editCol && name == '首席'" :class="`scheduling-${scope.row[id]}`">
                                        <el-option v-for="{name,id} in postUserList" :label="name" :value="id" :key="id"></el-option>
                                    </el-select> -->
                                </template>
                            </el-table-column>
                        </page-table>
                    </div>
            </el-card>
        </el-main>
    </el-container>
    <el-dialog title="服务中心排班" class="dialog-scheduling" :visible.sync="dialogTableVisibleSchedulingService" width="1000px">
        <iframe class="dialog-iframe-scheduling" v-if="dialogTableVisibleSchedulingService" src="../../../../static/html/quickScheduling/quickScheduling_xxfwzx.html" frameborder="0"></iframe>
    </el-dialog>
    <el-dialog title="气象台排班" class="dialog-scheduling" :visible.sync="dialogTableVisibleSchedulingObservatory" width="1000px">
        <iframe class="dialog-iframe-scheduling" v-if="dialogTableVisibleSchedulingObservatory" src="../../../../static/html/quickScheduling/quickScheduling_qxt.html" frameborder="0"></iframe>
    </el-dialog>
    <dialog-form title="文件导入" :visible.sync="visibleDialogFormItem" :getPayload="()=>getPayload()" :confirmDisabled="!formItem.orgId||!fileList" remote="requestDialogFormMenuItemInputAdd11"
      v-if="formItem" @success="submitSuccess">
        <fileUpload ref="mychild" :queryChild='query' :uploadUrlChild='uploadUrl' @uploadResults='uploadResults'></fileUpload>
    </dialog-form>
</div>
</template>

<script>
import {
requestAllUserList,
requestDialogFormSchedulingDownload,
requestSchedulingList,
requestSchedulingRemark,
requestSchedulingUpRemark,
requestSchedulingOptionList,
requestSchedulingSxOptionList,
requestSchedulingDutyUser,
requestSchedulingUpdate,
requestSchedulingDownload,
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
            remark:null,
            tableKey:1,
            dialogTableVisibleSchedulingService:false,
            dialogTableVisibleSchedulingObservatory:false,
            readonly: true,
            butCode:'Business-Duty',
            butCodeXxfwzx:'Business-QuickDuty-xxfwzx',
            butCodeQxt:'Business-QuickDuty-qxt',
            uploadUrl:'http://10.137.4.30:6001/integration/main/ssd-business-duty/saveExcel',
            colName:null,
            colDuty:null,
            isSelectId:null,
            showSelectId:null,
            loginInfo:null,
            imageUrl: '',
            fileList: [],
            editCol: false,
            quickDutyXxfwzx:false,
            quickDutyQxt:false,
            selectData:[],
            query: {
                orgId: '',
                monthTime:''
            },
            persons: null,
            userList:null,
            postList:null,
            postUserList:null,
            pageTableList:null,
            serviceDay:null,//当前服务器时间
        };
    },
    created() {
      // 初始化时为window绑定一个方法
      window['vueDefinedMyProp'] = (receiveParams) => {
        this.receiveParamsFromHtml(receiveParams)
      }
    },
    computed: {
        ...mapGetters(['accountOrgId']),
        showBut(){
            let butState = false
            if(JSON.parse(localStorage.getItem('loginInfo',)).roleCodes.length > 0){
                JSON.parse(localStorage.getItem('loginInfo',)).roleCodes.forEach(item => {
                    if(item == this.butCode){
                        butState = true
                    }
                    if(item == this.butCodeXxfwzx){
                        this.quickDutyXxfwzx = true
                    }
                    if(item == this.butCodeQxt){
                        this.quickDutyQxt = true
                    }
                });
            }
            return butState
        }
    },
    mounted() {
        const loginInfo = JSON.parse(localStorage.getItem('loginInfo',))
        this.loginInfo = loginInfo
        this.requestData()
    },
    watch:{
        editCol(val){
            if(!val){
                this.showSelectId = null
                this.colName = null
                this.colDuty = null
            }
        }
    },
    methods: {
    //失去焦点 保存备注
    onInputBlur(){
        if(!this.query.monthTime || !this.remark) return
        requestSchedulingUpRemark({month:this.query.monthTime,content:this.remark}).then(res=>{
            //获取备注
            requestSchedulingRemark({month:this.query.monthTime}).then(res=>{
                if(res.data[0]){
                    this.remark = res.data[0].remark
                }else{
                    this.remark = null
                }
            })
        })
    },
    receiveParamsFromHtml({name,date}) {
        this.query.monthTime = date.slice(0,7)
        ++this.tableKey
        if(name == 'xxfwzx'){
            this.dialogTableVisibleSchedulingService=false
        }else{
            this.dialogTableVisibleSchedulingObservatory=false
        }
    },
      uploadResults(){
            this.visibleDialogFormItem = false;
            this.formItem = {}
            this.submitSuccess()
        },
      tableColumClick(id,scope){
          console.log(id)
          console.log(scope)
          if(!this.editCol) return
          this.showSelectId = id
          this.colName = scope.column.label
          this.colDuty = scope.row.dutyDate
      },
      itemClick(id){

        //   if(!this.editCol) return
        //   console.log(id)
        //   this.isSelectId = id
      },
        getPayload(){
            this.$refs.mychild.parentHandleclick();
            // return
        },
        getFormItemByInputItem(item={}) {
            const {
                lastItemClicked
            } = this;
            return {
                orgId:this.loginInfo.orgId,
                fileName:null,
            }
        },
        tableFixed(name,id){
            var isRight = null
            if(name == '管理员'){
                isRight = 'right'
            }
            if(name == '日期'){
                isRight = 'list'
            }
            if(name == '星期'){
                isRight = 'list'
            }
            return isRight
        },
        submitSuccess(res){
        // this.treeDataList = []
            this.onConfirmUpdate()
            this.requestData()
        },
        async requestData(){
        //非首席 岗位option数据
        requestSchedulingOptionList({orgId:this.loginInfo.orgId,isNormal:'0'}).then(res =>{
            this.postList = res.data.list
            this.postList.unshift({label:'',id:''})
        })
        //首席 用户option数据
        requestSchedulingSxOptionList({orgId:this.loginInfo.orgId,jobCode:'shouxi'}).then(res =>{
            this.postUserList = res.data.list
            this.postUserList.unshift({label:'',id:''})
        })
        //获取当前月份
        await requestSchedulingList({orgId:this.loginInfo.orgId}).then(res=>{
            // this.pageTableList = res.data.list
            this.query.monthTime = res.data.monthTime
            this.serviceDay = res.data.serviceDay
        })
        //获取备注
        requestSchedulingRemark({month:this.query.monthTime}).then(res=>{
            if(res.data[0]){
                this.remark = res.data[0].remark
            }else{
                this.remark = null
            }
        })
        //排班管理-表头 getDutyUser
        requestSchedulingDutyUser({orgId:this.loginInfo.orgId,monthTime:this.query.monthTime}).then(res =>{
            this.persons = res.data
            this.persons.map(item=>{
                item.label = item.name,
                item.value = item.id
            })
        })
        },

        handleChange(files, fileList){
            console.log(files, fileList)
            this.formItem.fileName = files.name
            this.fileList = fileList
        },
        submitUpload() {
            // this.$refs.upload.submit();
        },

        submitEdit(){
            this.editCol=!this.editCol
            if(!this.editCol && this.selectData.length > 0){
                // let params
                // this.selectData.forEach(i=>{
                //    if(i.userId == 'bf5df19b976d4381bb1a2f841ab544a7'){
                //         i.userIdItem = i.userId
                //         i.jobIdItem = i.jobId
                //         i.userId = i.jobIdItem
                //         i.jobId = 'bf5df19b976d4381bb1a2f841ab544a7'
                //         delete i.userIdItem
                //         delete i.jobIdItem
                //    }
                // })
                 requestSchedulingUpdate({orgId:this.loginInfo.orgId,month:this.query.monthTime,list:this.selectData}).then(res =>{
                     if(res.success){
                        this.requestData()
                     }
                    this.selectData = []
                })
                console.log(this.selectData)
            }else{this.selectData = []}
        },
        cancelEdit(){
            this.editCol=!this.editCol
            this.onConfirmUpdate()
        },
        changeTelescopic(index,jobId,scope,name,id){
            if(name == '首席'){
                this.selectData.push({'userId':jobId,'jobId':id,'dutyDate': this.query.monthTime + '-' + scope.dutyDate})
            }else{
                this.selectData.push({'userId':id,'jobId':jobId,'dutyDate': this.query.monthTime + '-' + scope.dutyDate})
            }
        },
        formatPayload(payload){
            const loginInfo = JSON.parse(localStorage.getItem('loginInfo',))
            this.loginInfo = loginInfo
            if(!this.query.monthTime){//首次加载时，加载表头
                //获取当前月份
                requestSchedulingList({orgId:this.loginInfo.orgId}).then(res=>{
                    this.query.monthTime = res.data.monthTime
                    //刷新排班管理-表头 getDutyUser
                    requestSchedulingDutyUser({orgId:this.loginInfo.orgId,monthTime:this.query.monthTime}).then(res =>{
                        this.persons = res.data
                        this.persons.map(item=>{
                            item.label = item.name,
                            item.value = item.id
                        })
                    })
                })
            }else{
                //刷新排班管理-表头 getDutyUser
                requestSchedulingDutyUser({orgId:this.loginInfo.orgId,monthTime:this.query.monthTime}).then(res =>{
                    this.persons = res.data
                    this.persons.map(item=>{
                        item.label = item.name,
                        item.value = item.id
                    })
                })
                //获取备注
                requestSchedulingRemark({month:this.query.monthTime}).then(res=>{
                    if(res.data[0]){
                        this.remark = res.data[0].remark
                    }else{
                        this.remark = null
                    }
                })
            }

            return payload.monthTime?  {
                'orgId':this.loginInfo.orgId,
                monthTime: this.query.monthTime?  this.query.monthTime:payload.monthTime
            }:{
                'orgId':this.loginInfo.orgId,
            }
            // return payload
        },
        downloadExcel(){
            if(!this.query.monthTime){
                this.$message.warning("请选择月份");
                return
            }
                let param = {
                monthTime:this.query.monthTime,
                orgId:this.loginInfo.orgId,
            }
            requestSchedulingDownload(param).then(res=>{
                this.$message.success("下载完成");
            })
        },
        quickScheduling(data){
            if(data == 'service'){
                this.dialogTableVisibleSchedulingService = true
            }else{
                this.dialogTableVisibleSchedulingObservatory = true
            }
        },
        tableRowClassName({
            row,
            rowIndex
        }) {
            // return row.dataType && 'rest';
            return row.dataType == "0" ? true:'rest'
        }
    },
};
</script>
<style lang="postcss" scoped>
.content-list{
    .upload-demo {
        display: inline-block;
    }
}
.upload-demo {
    .el-upload__tip {
        display: inline;
        margin-left:8px;
    }
}
.clearfix{
    display: flex;
    justify-content: space-between;

}
</style>
<style lang='postcss'>
.scheduling-bx {
    .el-input__inner {
        color: red;
    }
}

.page-wrapper.scheduling {
    tr.rest {
        background: rgba(253, 245, 230, 1);
    }
}
.scheduling {
    height: 100%;

    /* 自适应高度 */
        /* .el-main {
        .el-card{
            height: calc(100% - 2px);
            position: relative;
            .el-card__header {
                height: 55px;
            }
            .el-card__body {
                height: calc(100% - 95px);
                .content-list{
                    height: 100%;
                    .list-table{
                        height: 100%;
                    }
                    height: 100%;
                    .actions{
                        height: 56px;
                        }
                    .el-table{
                        height: calc(100% - 72px);
                        .el-table__header-wrapper {
                            height: 34px;
                        }
                        .el-table__body-wrapper {
                            overflow-y: auto;
                            height:calc(100% - 34px);
                        }
                    }
                }
            }
        }
} */
    /* 自适应高度end------------------- */
    .title-remark{
        color:red;
    }
    .remark .el-input__inner{
        padding: 5px;
        background: rgb(252, 243, 243);
        border: 1px solid rgb(252, 243, 243);
    }

    .color-black {
        color: #606266 !important;
    }
    .color-blue {
        color: #409eff;
    }
    .cell {
        .col-box {
            display: flex;
            align-items:center;
            justify-content: center;
            /* width: 100px; */
            min-height: 34px;
        }
        .col-box-bg{
            background: #f5f7fa;
            border: 1px solid;
            border-color: #40a0ff31;
            border-radius: 4px;
        }
    }
    .is-leaf {
        text-align: center;
    }
}
.dialog-scheduling .el-dialog__body{
    display: flex;
    justify-content: center;
    padding: 0 0 20px 0;
}
.dialog-scheduling .dialog-iframe-scheduling {
    min-width: 1100px;
    height: 605px;
}

</style>
