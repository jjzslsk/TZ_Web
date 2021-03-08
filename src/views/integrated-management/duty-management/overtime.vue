<template>
  <div class="page-wrapper overtime">
    <el-container>
      <el-main>
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="primary">加班管理</span>
          </div>
            <div class="content-list">
              <page-table
                ref="table"
                remote="requestOvertimeList"
                :formatPayload="formatPayload"
                :span-method="spanMethod"
                :hidePagination="true"
                v-if="dates"
              >
                <div class="actions" slot="actions">
                  <span class="title">选择月份</span>
                  <el-date-picker
                    v-model="query.monthTime"
                    :disabled="editCol"
                    :clearable='false'
                    format="yyyy-MM"
                    value-format="yyyy-MM"
                    type="month"
                    placeholder="选择月"
                  ></el-date-picker>
                  <c-button type="search" @click="search()" :disabled="editCol">查询</c-button>
                  <c-button type="search" v-if="!editCol && showBut" @click="editCol=!editCol">编辑</c-button>
                  <c-button v-if="editCol" @click="cancelEdit">取消</c-button>
                  <c-button type="search" v-if="editCol" @click="submitEdit">保存</c-button>
                  <c-button type="search" @click="inputItem()" v-if="!editCol && showBut" :disabled="editCol">导入</c-button>
                  <c-button type="search"  @click="downloadExcel()" :disabled="editCol">导出</c-button>
                  <!-- <c-button type="search">打印</c-button> -->
                  <c-button type="warning" @click="formNight={'type':'statistics'}" :disabled="editCol">夜班统计</c-button>
                  <c-button type="danger" @click="formEmergency={'type':'lead'}" :disabled="editCol">应急响应统计</c-button>
                </div>
                <el-table-column prop="name" label="姓名" width="80px"></el-table-column>
                <el-table-column label="日期">
                  <el-table-column prop="range" label="星期" width="80px" />
                </el-table-column>
                <el-table-column
                  v-for="({date,week,isRest,value},index) in dates"
                  :label="date"
                  :key="index"
                >
                  <table-col :className="isRest?'rest':''" :label="week">
                    <template slot-scope="scope">
                      <!-- <c-button type="text" @click="editCol&&(scope.row[value]=!scope.row[value])" v-if="editCol"> -->
                      <div v-if="editCol" class="table-but" @click.stop="changeCheck(scope.row,value)">
                        <span  class="overtime-checked-edit">{{scope.row[value] =='1' ? '√':''}}</span>
                      </div>
                      <span v-else class="overtime-checked">{{scope.row[value] =='1' ? '√':''}}</span>
                    </template>
                  </table-col>
                </el-table-column>
              </page-table>
            </div>
        </el-card>
      </el-main>
      <dialog-submit
        title="夜班统计"
        :visible.sync="visibleDialogFormNight"
        :getPayload="()=>formNight"
        remote="requestDialogFormNightDownload"
        v-if="formNight"
        primary-text="下载"
      >
        <template>
          <div class="dialog-main night-main">
            <el-tabs v-model="formNight.type">
              <el-tab-pane label="统计表" name="statistics"></el-tab-pane>
              <el-tab-pane label="发放表" name="distribution"></el-tab-pane>
            </el-tabs>
            <night-block :form="formNight" :monthTime='query.monthTime'></night-block>
          </div>
        </template>
      </dialog-submit>
      <dialog-submit
        title="应急响应统计"
        :visible.sync="visibleDialogFormEmergency"
        :getPayload="()=>formEmergency"
        remote="requestDialogFormNightEmergencyDownload"
        v-if="formEmergency"
        primary-text="下载"
      >
        <template>
          <div class="dialog-main night-main">
            <el-tabs v-model="formEmergency.type">
              <el-tab-pane label="领导" name="lead"></el-tab-pane>
              <el-tab-pane label="普通员工" name="employee"></el-tab-pane>
            </el-tabs>
            <night-emergency-block :form="formEmergency" :monthTime='query.monthTime'></night-emergency-block>
          </div>
        </template>
      </dialog-submit>
    </el-container>
    <dialog-form title="文件导入" :visible.sync="visibleDialogFormItem" :getPayload="()=>getPayload()" :confirmDisabled="!formItem.orgId||!fileList" remote="requestDialogFormMenuItemInputAdd11"
    v-if="formItem" @success="submitSuccess">
        <fileUpload ref="mychild" :queryChild='query' :uploadUrlChild='uploadUrl' @uploadResults='uploadResults'></fileUpload>
    </dialog-form>
  </div>
</template>

<script>
import {
    requestOverUpdate,
    requestOvertimeList,
    requestOvertimeDownload
 } from "@/remote/";
 import {
    mapActions,mapGetters
} from 'vuex'
import { common, witchCommonList } from "../../mixins/index";
import nightBlock from "./components/night-block.vue";
import nightEmergencyBlock from "./components/night-emergency-block.vue";
export default {
  mixins: [common, witchCommonList],
  components: {
    nightBlock,
    nightEmergencyBlock
  },
  data() {
    return {
      butCode:'Business-Overtime',
      uploadUrl:'http://10.137.4.30:6001/integration/main/ssd-business-overtime/importBusinessOvertime',
      query: {
        monthTime: null,
        orgId: null
      },
      fileList:[],
      selectData: [],
      loginInfo: null,
      queryTime: null,
      editCol: false,
      dates: null,
      form: {},
      visibleDialogFormNight: false,
      formNight: null,
      visibleDialogFormEmergency: false,
      formEmergency: null
    };
  },

  watch: {
    "$route.query": {
            handler: function() {
              requestOvertimeList({orgId:this.accountOrgId,monthTime:this.query.monthTime}).then(res=>{
                  this.dates = res.data.dateList
                  this.dates.forEach(item =>{
                      item.value = item.date
                  })
                  this.query.monthTime = res.data.monthTime
              })
            },
            // immediate: true
      },
    queryTime(data) {
      let timeData = data;
      this.query.time = timeData;
    },
    formNight(val) {
      if (val) {
        this.visibleDialogFormNight = true;
      }
    },
    visibleDialogFormNight(val) {
      if (!val) {
        this.formNight = null;
      }
    },
    formEmergency(val) {
      if (val) {
        this.visibleDialogFormEmergency = true;
      }
    },
    visibleDialogFormEmergency(val) {
      if (!val) {
        this.formEmergency = null;
      }
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
                        return
                    }
                });
            }else{
                butState = false
            }
            return butState
        }
    },
  mounted() {
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
    this.loginInfo = loginInfo;
    this.query.orgId = this.loginInfo.orgId;

    setTimeout(() => {

    }, 1000);

    this.requestData()
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
            requestOvertimeDownload(param).then(res=>{
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
        requestData(){
        const loginInfo = JSON.parse(localStorage.getItem('loginInfo',))
        this.loginInfo = loginInfo
        this.query.orgId = this.loginInfo.orgId

        requestOvertimeList({orgId:this.accountOrgId}).then(res=>{
            this.dates = res.data.dateList
            this.dates.forEach(item =>{
                item.value = item.date
            })
            this.query.monthTime = res.data.monthTime
        })

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

    submitEdit() {
      this.editCol = !this.editCol;
      if (!this.editCol && this.selectData.length > 0) {
        requestOverUpdate({orgId:this.loginInfo.orgId,month:this.query.monthTime,list:this.selectData}).then(res => {
          //  if(res.success){
          //     this.requestData()
          //  }
          this.selectData = [];
        });
      } else {
        this.selectData = [];
      }
    },
    cancelEdit(){
            this.editCol=!this.editCol
            this.onConfirmUpdate()
        },
    changeCheck(item, key) {
      this.$set(item, key, !Number(item[key]));
      // console.log(item)
      // console.log(key)
      let paramOdj = item;
      paramOdj.monthTime = this.query.monthTime;
      this.selectData.push(paramOdj);
      this.selectData.map((element, _index) => {
        Object.keys(element).forEach(i => {
          if (this.selectData[_index][i] == '1') {
            this.selectData[_index][i] = 1;
          } else if (this.selectData[_index][i] == '') {
            this.selectData[_index][i] = 0;
          }
        });
      });
      console.log(this.selectData);
    },
    spanMethod({ row, column, rowIndex, columnIndex, rows }) {
      if (
        columnIndex == 0 ||
        column.property == "XXXPROP_OVERTIME_real" ||
        column.property == "XXXPROP_OVERTIME_need"
      ) {
        const funSpan = e => e.user_id == row.user_id;
        const spanLength = rows.filter(funSpan).length;
        if (spanLength > 1) {
          if (rows.findIndex(funSpan) == rowIndex) {
            return {
              rowspan: spanLength,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      }
      this.form.rows = rows;
    },
    formatPayloadLeft(payload) {
      return {
        // pageSize: 5,
        // pageIndex: 1,
        orgId: this.accountOrgId,
        monthTime:this.query.monthTime
        // ...payload
      };
    }
    // formatPayload(){
    //     return {
    //         dates:this.dates
    //     }
    // }
  }
};
</script>
<style lang="postcss" scoped>

</style>
<style lang="postcss">
.overtime {
  height: 100%;

  span.red {
    color: red;
  }

  .overtime-checked-edit {
      color: #409eff;
      cursor:pointer;
      min-height:23px;
  }

  .overtime-checked {
    color: #606266;
  }

  td.rest {
    background: rgba(253, 245, 230, 1);
  }

  .dialog-main {
    padding: 25px 45px;
  }

  .dialog-table-title {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    color: rgba(96, 98, 102, 1);
    line-height: 53px;
  }

  .dialog-table-info {
    width: 100%;

    td {
      line-height: 53px;
      text-align: center;

      &:first-child {
        text-align: left;
      }

      &:last-child {
        text-align: right;
      }
    }
  }
  td{
    text-align: center;
    .cell {
      .table-but {
        cursor:pointer;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
          .common-button {
            position: absolute;
            top:0px;
            left: 0px;
            height: 100%;
            width: 100%;
            padding:0;
          }
      }
    }
  }


}
</style>
