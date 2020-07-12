<template>
<div class="page-wrapper attendance">
    <el-container>
        <el-main>
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="primary">考勤管理</span>
                </div>
                        <page-table ref="table" remote="requestAttendanceList" :height="'700'" :formatPayload="formatPayload" :span-method="spanMethod" :hidePagination="true">
                            <div class="actions" slot="actions">
                                <span class="title">选择月份</span>
                                <el-date-picker v-model="query.monthTime" format="yyyy-MM" value-format="yyyy-MM" type="month" placeholder="选择月"></el-date-picker>
                                <c-button type="search" @click="search()">查询</c-button>
                                <c-button type="search" v-if="!editCol" @click="editCol=!editCol">编辑</c-button>
                                <c-button v-if="editCol" @click="cancelEdit">取消</c-button>
                                <c-button type="search" v-if="editCol" @click="submitEdit">保存</c-button>
                                <c-button type="search">导出</c-button>
                                <c-button type="search">打印</c-button>
                                <span>出勤“/”值班“Z”补休“一1”班休“一2”调休“<span class="red">一3</span>”公差“Δ”事假“ ＄”迟到“L”早退“ E”年休假“<span class="red">*</span>”事假“ ＄”病假“⊕”旷工“〇”</span>
                            </div>
                            <el-table-column prop="name" label="姓名" width="80px"></el-table-column>
                            <el-table-column label="日期" width="60px">
                                <el-table-column prop="range" label="星期" width="60px" />
                            </el-table-column>
                            <!-- <el-table-column v-for="({date,week,value},index) in dates" :label="date" :key="index"> -->
                                <!-- <table-col :prop="value" :label="week" :edit="editCol"></table-col> -->
                                <!-- <table-col :prop="date" :label="week" :edit="editCol" @inputValue="inputValue"></table-col>
                            </el-table-column> -->
                                <!-- <el-table-column v-for="({date,week,value},index) in dates" :label="date" :key="index">
                                    <table-col v-if="options && dates" :prop="date" :options='options' :label="week" :edit="editCol" @selectValue="selectValue" @inputValue="inputValue"></table-col>
                                </el-table-column> -->

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
</div>
</template>
<script>
import {
requestAttendanceList,
requestAttendanceUpdate,
requestSchedulingUpdate
} from "@/remote/";
import {
    common,
    witchCommonList
} from '../../mixins/index';
import {
    mapActions,mapGetters
} from 'vuex'
export default {
    mixins: [common, witchCommonList],
    data() {
        return {
            colUserId:null,
            colRange:null,
            colNeedAttendance:null,
            colName:null,
            colDate:null,
            options:[
                // {label:'出勤“/”',value:'/'},
                // {label:'值班“Z”',value:'Z'},
                // {label:'补休“一1”',value:'一1'},
                // {label:'班休“一2”',value:'一2'},
                // {label:'调休“一3”',value:'一3'},
                // {label:'公差“Δ”',value:'Δ'},
                // {label:'事假“＄”',value:'＄'},
                // {label:'迟到“L”',value:'L'},
                // {label:'早退“E”',value:'E'},
                // {label:'年休假“*”',value:'*'},
                // {label:'事假“＄”',value:'＄'},
                // {label:'病假“⊕”',value:'⊕'},
                // {label:'旷工“〇”',value:'〇'},

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
        }
    },
    methods: {
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
                                //   this.selectData.splice(index, 1);
                                    this.selectData.push(data)
                                    // alert('同id，不同时段',data.user_id)
                                    return
                      }else if(item.user_id == data.user_id && data.range == '下午' && item.range !== '上午' &&  item.range == '下午'){
                                //   this.selectData.splice(index, 1);
                          this.selectData.push(data)
                          return
                        //   alert('同id，不同时段',data.user_id)
                      }else if(item.user_id !== data.user_id){
                                //  this.selectData.splice(index, 1);
                          this.selectData.push(data)
                          return
                        //   alert('同id，不同时段',data.user_id)
                      }else if(item.user_id == data.user_id && item.range == '上午' &&  item.range == '下午'){
                        this.selectData.splice(index, 1);
                        this.selectData.push(data)
                          return
                      }
                })
             arrData.forEach((item,index) =>{
                if(item.user_id !== data.user_id){
                    this.selectData.push(data)
                    // alert('不同id',data.user_id)
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
.page-wrapper.attendance {
    span.red {
        color: red;
    }

    td.rest {
        background: rgba(253, 245, 230, 1);
    }
}
</style>
