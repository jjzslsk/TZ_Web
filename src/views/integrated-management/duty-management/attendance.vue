<template>
<div class="page-wrapper attendance">
    <el-container>
        <el-main>
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="primary">考勤管理</span>
                </div>
                        <page-table ref="table" :height="'140'" remote="requestAttendanceList" :formatPayload="formatPayload" :span-method="spanMethod" :hidePagination="true">
                            <div class="actions" slot="actions">
                                <span class="title">选择月份</span>
                                <el-date-picker v-model="query.monthTime" :clearable='false' :disabled="editCol" format="yyyy-MM" value-format="yyyy-MM" type="month" placeholder="选择月"></el-date-picker>
                                <c-button type="search" @click="search()" :disabled="editCol">查询</c-button>
                                <c-button type="search" v-if="!editCol && showBut" @click="editCol=!editCol">编辑</c-button>
                                <c-button v-if="editCol" @click="cancelEdit">取消</c-button>
                                <c-button type="search" v-if="editCol" @click="submitEdit">保存</c-button>
                                <c-button type="search" @click="inputItem()" v-if="!editCol && showBut" :disabled="editCol">导入</c-button>
                                <c-button type="search"  @click="downloadExcel()" :disabled="editCol">导出</c-button>
                                <!-- <c-button type="search">打印</c-button> -->
                                <span>出勤“/”值班“Z”补休“一1”班休“一2”调休“<span class="red">一3</span>”公差“Δ” 迟到“L”早退“ E”年休假“<span class="red">*</span>”事假“ ＄”病假“⊕”旷工“〇”</span>
                            </div>
                            <el-table-column prop="name" label="姓名" width="80px"></el-table-column>
                            <el-table-column label="日期" width="60px">
                                <el-table-column prop="range" label="星期" width="60px" />
                            </el-table-column>

                                <el-table-column v-for="({date,week,value},index) in dates" :label="date" :key="index">
                                    <template>
                                        <el-table-column :label="week" :width="90">
                                            <template v-slot:default="{row}">
                                                <slot :row="row">
                                                    <div :class="editCol? 'duty-edit-box':''" @click="colClick(row,date,week,value)">
                                                        <div v-if="editCol" :class="editCol? 'color-blue':'color-black'">
                                                            <el-select v-if="colUserId == row.user_id && colRange == row.range && colNeedAttendance == row.needAttendance && colName == row.name && editCol && colDate == date" v-model="row[date]" @change="selectValue(row)" size="mini" placeholder="">
                                                                <el-option v-for="(item,index) in optionsEdit" :key="index" :label="item.label" :value="item.value">
                                                                </el-option>
                                                            </el-select>
                                                            <span v-else>{{row[date]}}</span>
                                                        </div>
                                                        <span v-else>{{row[date]}}</span>
                                                    </div>
                                                </slot>
                                            </template>
                                        </el-table-column>
                                        </template>
                                </el-table-column>

                            <el-table-column prop="attendance" label="实出勤（天）" width="80px"/>
                            <el-table-column prop="needAttendance" label="应出勤（天）" width="80px"/>
                        </page-table>
            </el-card>
        </el-main>
    </el-container>
    <dialog-form title="文件导入" :visible.sync="visibleDialogFormItem" :getPayload="()=>getPayload()" :confirmDisabled="!formItem.orgId||!fileList" remote="requestDialogFormMenuItemInputAdd11"
    v-if="formItem" @success="submitSuccess">
        <fileUpload ref="mychild" :queryChild='query' :uploadUrlChild='uploadUrl' @uploadResults='uploadResults'></fileUpload>
    </dialog-form>
</div>
</template>
<script>
import {
requestAttendanceList,
requestAttendanceUpdate,
requestSchedulingUpdate,
requestAttendanceDownload
} from "@/remote/";
import {
    common,
    witchCommonList,
    withCommonLeftTree
} from '../../mixins/index';
import {
    mapActions,mapGetters
} from 'vuex'
export default {
    mixins: [common, witchCommonList, withCommonLeftTree],
    data() {
        return {
            butCode:'Business-Check',
            uploadUrl:'http://10.137.4.30:6001/integration/main/ssd-business-check/importBusinessCheck',
            colUserId:null,
            colRange:null,
            colNeedAttendance:null,
            colName:null,
            colDate:null,
            fileList:[],
            options:[
                {label:'/',value:'/'},
                {label:'Z',value:'Z'},
                {label:'一1',value:'一1'},
                {label:'一2',value:'一2'},
                {label:'一3',value:'一3'},
                {label:'Δ',value:'Δ'},
                {label:'＄',value:'＄'},
                {label:'L',value:'L'},
                {label:'E',value:'E'},
                {label:'*',value:'*'},
                {label:'＄',value:'＄'},
                {label:'⊕',value:'⊕'},
                {label:'〇',value:'〇'},
                ],
            query: {
                monthTime: null,
                orgId:null
            },
            loginInfo:null,
            editCol: false,
            dates: null,
            form: {},
            selectData:[],
        };
    },
    watch:{
        "$route.query": {
            handler: function() {
                requestAttendanceList({orgId:this.accountOrgId,monthTime:this.query.monthTime}).then(res=>{
                    this.dates = res.data.dateList
                    this.query.monthTime = res.data.monthTime
                })
            },
            // immediate: true
      },
        editCol(val){
            if(!val){
                this.colUserId=null
                this.colRange=null
                this.colNeedAttendance=null
                this.colName=null
                this.colDate=null
            }
        }
    },
    mounted() {
        this.requestData()
    },
    computed: {
        ...mapGetters(['accountOrgId']),
        optionsEdit() {
            const {
                options
            } = this
            return options ? options.map(item => {
                if (item.label != null && item.value != null) {
                    return item
                } else {
                    return {
                        label: item,
                        value: item,
                    }
                }
            }) : options;
        },
        showBut(){
            let butState = false
            if(JSON.parse(localStorage.getItem('loginInfo',)).roleCodes.length > 0){
                JSON.parse(localStorage.getItem('loginInfo',)).roleCodes.forEach(item => {
                    if(item == this.butCode){
                        butState = true
                        return
                    }
                });
            }else{
                butState = false
            }
            return butState
        }
    },
    methods: {
        uploadResults(){
            this.visibleDialogFormItem = false;
            this.formItem = {}
            this.submitSuccess()
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
            requestAttendanceDownload(param).then(res=>{
                this.$message.success("下载完成");
            })
        },
        submitSuccess(res){
            this.onConfirmUpdate()
            this.requestData()
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
        colClick(row,date,week,value){
            if(!this.editCol) return
            this.colUserId=row.user_id
            this.colRange=row.range
            this.colNeedAttendance=row.needAttendance
            this.colName=row.name
            this.colDate = date
        },
        requestData(){
        const loginInfo = JSON.parse(localStorage.getItem('loginInfo',))
        this.loginInfo = loginInfo
        this.query.orgId = this.loginInfo.orgId

        requestAttendanceList({orgId:this.accountOrgId}).then(res=>{
            this.dates = res.data.dateList
            this.query.monthTime = res.data.monthTime
        })

        },
          submitEdit(){
            this.editCol=!this.editCol
            if(!this.editCol && this.selectData.length > 0){
                 requestAttendanceUpdate({orgId:this.loginInfo.orgId,month:this.query.monthTime,list:this.selectData}).then(res =>{
                     if(res.success){
                        this.requestData()
                     }
                    this.selectData = []
                })
            }else{this.selectData = []}
        },
        cancelEdit(){
            this.editCol=!this.editCol
            this.onConfirmUpdate()
        },

        selectValue(data){
            let paramOdj = data
                delete paramOdj.needAttendance
                delete paramOdj.attendance
            paramOdj.monthTime = this.query.monthTime
            this.selectData.push(paramOdj)
            console.log(this.selectData)
        },
        inputValue(data){
             let arrData = this.selectData
            if(this.selectData.length == 0){
                this.selectData.push(data)
                return
            }else{
                arrData.map((item,index)=>{
                    if(item.user_id == data.user_id && data.range == '上午' && item.range == '上午' &&  item.range !== '下午'){
                        this.selectData.push(data)
                        return
                      }else if(item.user_id == data.user_id && data.range == '下午' && item.range !== '上午' &&  item.range == '下午'){
                          this.selectData.push(data)
                          return
                      }else if(item.user_id !== data.user_id){
                          this.selectData.push(data)
                          return
                      }else if(item.user_id == data.user_id && item.range == '上午' &&  item.range == '下午'){
                        this.selectData.splice(index, 1);
                        this.selectData.push(data)
                          return
                      }
                })
             arrData.forEach((item,index) =>{
                if(item.user_id !== data.user_id){
                    this.selectData.push(data)
                    return
                }
             })
           }
        },
        spanMethod({
            row,
            column,
            rowIndex,
            columnIndex,
            rows
        }) {
            if (columnIndex == 0 || column.property == 'attendance' || column.property == 'needAttendance') {
                const funSpan = e => e.user_id == row.user_id;
                const spanLength = rows.filter(funSpan).length;
                if (spanLength > 1) {
                    if (rows.findIndex(funSpan) == rowIndex) {
                        return {
                            rowspan: spanLength,
                            colspan: 1
                        }
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    }
                }
            }
            this.form.rows = rows;
        },
        formatPayloadLeft(payload){
            return {
                // pageSize: 5,
                // pageIndex: 1,
                'orgId':this.accountOrgId,
                'monthTime':this.query.monthTime
                // ...payload
            }
        },
    }
};
</script>
<style lang="postcss" scoped>
    .color-black {
        color: #606266 !important;
    }
    .color-blue {
        color: #409eff;
    }
    .duty-edit-box {
        display: flex;
        align-items:center;
        justify-content: center;
        background: #f5f7fa;
        border: 1px solid;
        border-color: #40a0ff31;
        border-radius: 4px;
        height: 30px;
        width: 100%;
}
</style>
<style lang="postcss">
.attendance {
    height: 100%;
    td.rest {
        background: rgba(253, 245, 230, 1);
    }
}
</style>
