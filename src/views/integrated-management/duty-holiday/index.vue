<template>
  <div class="management-holiday">
    <el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>节假日修改</span>
  </div>
      <el-calendar id="calendarBox" v-model="value">
      <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
      <template
        slot="dateCell"
        slot-scope="{date, data}">
        <p @click="inputItem(data)"> <!--这里原本有动态绑定的class，去掉-->
          {{ data.day.split('-').slice(1).join('-') }}<br /> <span class="dealDate">{{dealMyDate(data.day)}}</span> 
        </p>
      </template>
    </el-calendar>
</el-card>

    <dialog-form @success="submitSuccess" class="dialog-box-holiday" title="节假日修改" :visible.sync="visibleDialogFormItem" :getPayload="()=>formItem" :confirmDisabled="!formItem.dataType" remote="requestUpdateVacation" v-if="formItem">
        <template>
            <el-form-item label="类型选择" label-width="120px">
                  <el-radio v-model="formItem.dataType" label="0">工作日</el-radio>
                  <el-radio v-model="formItem.dataType" label="1">休息日</el-radio>
                  <el-radio v-model="formItem.dataType" label="2">节假日</el-radio>
            </el-form-item>
        </template>
    </dialog-form>
  </div>
</template>

<script>
import { requestVacation } from "@/remote/";
import {
    common,
    witchCommonList,
    withCommonLeftTree
} from '../../mixins/index';
export default {
    mixins: [common, witchCommonList, withCommonLeftTree],
    data() {
        return {
          formItem:{
            dataType:null,
            month:null,
          },
          visibleDialogFormItem:false,
          value: new Date(),
            resDate: [
                // {"date":"2020-12-20","content":"休息日"},
            ],
          strDate:null,
        }
    },
    watch:{
      value(val){
        this.strDate = JSON.stringify(val).substring(1,8)
        this.requestData({month:this.strDate})
      }
    },
    methods:{
        dealMyDate(v) {
            // console.log(v)
            let len = this.resDate.length
            let res = ""
            for(let i=0; i<len; i++){
                if(this.resDate[i].date == v) {
                    res = this.resDate[i].content
                    break
                }
            }
            return res
        },
        getFormItemByInputItem(item) {
          let param = {}
          this.resDate.forEach((element)=>{
            if(element.date == item.day){
              param.dataType = JSON.stringify(element.dateType)
              param.time = element.date
            }
          })
            return param
        },
      submitSuccess(){
        this.requestData({month:JSON.stringify(this.value).substring(1,8)})
      },
      requestData(param){
        requestVacation(param).then((res)=>{
          let resData = res.data
          resData.forEach(element => {
            let str = element.dateTime;
            let arr = str.split('');
            arr.splice(4,0,'-');
            arr.splice(7,0,'-');
            str = arr.join('');  //ab-cd-ef
            element.date = str
            if(element.dateType == 0){element.content = ''}
            if(element.dateType == 1){element.content = '休息日'}
            if(element.dateType == 2){element.content = '节假日'}
          });
          this.resDate = resData
        })
      },
    },
    mounted(){
      this.requestData({month:JSON.stringify(new Date()).substring(1,8)})
    },
    
}
</script>

<style lang='postcss' scoped>
.management-holiday{
  display: flex;
  justify-content: center;
  align-items: center;
  .box-card {
    margin-top: 15px;
  }
  .dealDate{
    color: #409eff;
  }
  .calendar-day {
    text-align: center;
    color: #202535;
    line-height: 30px;
    font-size: 12px;
  }
  .is-selected {
    color: #f8a535;
    font-size: 10px;
    margin-top: 5px;
  }
  #calendarBox {
    text-align: center;
    padding: 0 80px;
    margin-top: 15px;
    width: 700px;
  }
    .el-button-group
    > .el-button:not(:first-child):not(:last-child):after {
    content: "当月";
  }
}

</style>
<style lang='postcss'>
#calendarBox {
    .el-calendar-day{
      height: 70px;
    }
}
.dialog-box-holiday{
    .el-dialog{
        width: 700px !important;
    }
}
</style>