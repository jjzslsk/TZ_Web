<template>
<div class="content" v-if="isShow">
  <!-- <el-tabs class="tab-wrap" v-model="activeName" @tab-click="handleClick">
    <el-tab-pane v-for="(item,index) in station" :label="item.stationName" :key="index" :name='item.stationName'></el-tab-pane>
  </el-tabs> -->
  <div class="item-wrap">
    <div class="date-option">
      <el-row>
        <span class="date-title">时间选择</span>
        <el-date-picker 
          class="form-day"
          v-model="forecastTime.dateOption"
          type="date"
          size="mini"
          value-format="yyyy-MM-dd"
          :clearable='false'
          placeholder="选择日期">
        </el-date-picker>
        <el-select class="form-time" v-model="forecastTime.formTime" size="mini" placeholder="请选择时段">
          <el-option label="08时" value="08"></el-option>
          <el-option label="20时" value="20"></el-option>
        </el-select>
      </el-row>
    </div>
    <div class="but-box">
      <el-tag size="small" style="cursor:pointer" :effect="tagHit == index ? 'dark':'plain'"  :type="tagHit == index ? '':'info'" @click="channelHit(item,index)" v-for="(item,index) in station" :key="index">{{item.stationName}}</el-tag>
    </div>
    <div class="page-box" v-if="isShow">
          <temperature :data='resData.temp' :value='resData.Yaxis' v-if="resData.temp"></temperature>
          <rain :data='resData.rain' v-if="resData.rain"></rain>
          <list :data='resData.table' v-if="resData.table"></list>
      </div>
  </div>
  </div>
</template>
<script>
import {
  requestProductForecaseStation,
  requestProductDay7List
} from "@/remote/";
import temperature from "./components/temperature";
import rain from "./components/rain";
import list from "./components/list";
export default {
    components:{
        temperature,
        rain,
        list
    },
  data() {
    return {
      forecastTime:{
        dateOption: JSON.stringify(new Date()).substring(1,11),
        formTime:'08',
      },
      // activeName:'椒江口',
      isShow:false,
      station:null,//所有站点
      tagHit:'0',//默认选中站点
      resData:{
        temp:null,
        rain:null,
        table:null
      },
    };
  },
  watch:{
    forecastTime:{
      handler(val, oldVal){
                console.log("dateOption--formTime: "+val.dateOption, oldVal.formTime);
                this.isShow = false
                requestProductDay7List({stationNum:this.station[0].stationNum,forecastTime:`${this.forecastTime.dateOption.split('-').join('')}${this.forecastTime.formTime}`}).then(res=>{
                  this.resData = res.data
                  this.isShow = true
                })
            },
            deep:true
    }
  },
  methods:{
    channelHit(item,index){
      this.tagHit = index
      this.isShow = false
      requestProductDay7List({stationNum:this.station[index].stationNum,forecastTime:`${this.forecastTime.dateOption.split('-').join('')}${this.forecastTime.formTime}`}).then(res=>{
        this.resData = res.data
        this.isShow = true
      })
    },

  },

  mounted(){
    requestProductForecaseStation().then(res=>{
      if (res.success) {
        this.station = res.data
        this.isShow = false
        requestProductDay7List({stationNum:this.station[0].stationNum}).then(res=>{
          this.resData = res.data
          this.isShow = true
        })
      } else {
        alert('站点获取失败，请联系管理员！')
      }
    })
  },
};
</script>
<style lang='postcss' scoped>
.content {
  height: calc(100% - 129px)!important;
  .item-wrap{
    /* min-height: 800px; */
    overflow: auto;
    .date-option {
      .date-title{
        text-align: right;
        vertical-align: middle;
        font-size: 14px;
        color: #606266;
        line-height: 40px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
      }
      .form-time {
        width: 4.6rem;
      }
      .form-day{
        width: 10.8em;
      }
    }
    .but-box{
    text-align: left;
    margin-bottom:15px;
    .el-tag{
      margin: 4px;
    }
    .active-tag {
      background: red;
      color: black;
    }
  }
  .tab-wrap{
    display: inline-block;
    width: 600px;
  }
  }
}
</style>
