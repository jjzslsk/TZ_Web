<template>
  <div class="weather-situation-page">
    <div class="skin" @click="skinClick">换肤</div>
    <div class="wrap-box" :class="skin? 'skinColor':''">
      <div class="left-box">
        <div class="left-top">
          <div ref="collapseDom">
          <el-collapse  v-model="activeNames" @change="handleChange">
          <el-collapse-item name="1">
            <template slot="title">
             <span class="title-content">天气警报</span>
             <span class="more" v-if="!alarmList">无数据</span>
             <!-- <span class="more" v-if="alarmList">{{alarmList.length}}个</span> -->
            </template>
            <div class="weather-forecast forecast-box el-tabs--border-card">
              <div class="content-wrap-box" v-if="alarmList">
                <el-tooltip class="item" :open-delay="800" v-for="item in alarmList.slice(0 , 2)" :key="item.id" effect="light" :content="item.publishOrg+'发布'+item.alarmName" placement="left-start">
                  <div class="content-box border-top"  @click="toMore('天气警报')">
                    <i class="iconfont" :class='item.icon'></i>
                    <div class="item">
                      <div class="title-F56C6C">{{item.publishOrg+'发布'+item.alarmName}}</div>
                      <div class="time">{{item.publishTime}}</div>
                    </div>
                  </div>
                </el-tooltip>
                <div class="count" @click="toMore('天气警报')">更多({{alarmList.length}})</div>
              </div>
              <div class="content-wrap-box" v-if="!alarmList">
                <img class="content-warning-img" src="../../../assets/img/yujing/warning-001.png" alt="" srcset="">
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template slot="title">
             <span class="title-content">市县预警</span>
             <span class="more" v-if="!earlyList">无数据</span>
             <!-- <span class="more" v-if="earlyList">{{earlyList.length}}个</span> -->
            </template>
          <div class="city-forecast forecast-box el-tabs--border-card">
          <div class="content-wrap-box" v-if="earlyList">
            <el-tooltip class="item" :open-delay="800" v-for="item in earlyList.slice(0 , 2)" :key="item.id" effect="light" :content="item.title" placement="left-start">
              <div class="content-box border-top"  @click="toMore('市县预警')">
                <img-alarm class="pic yujing-img" :info="item|alermInfo"></img-alarm>
                <div class="item">
                  <div class="title-F56C6C title-606266">{{item.title}}</div>
                  <div class="time">{{item.publishTime}}</div>
                </div>
              </div>
            </el-tooltip>
            <div class="count"  @click="toMore('市县预警')">更多({{earlyList.length}})</div>
          </div>
          <div class="content-wrap-box" v-if="!earlyList">
            <img class="content-warning-img" src="../../../assets/img/yujing/warning-002.png" alt="" srcset="">
          </div>
        </div>
          </el-collapse-item>
      </el-collapse>
      </div>
        </div>
        <div class="left-bottom" :style="{height:`calc(100% - ${collapseDomHeight}px)`}">
          <div class="short-forecast short-forecast-tab tab-wrap short el-tabs--border-card">
            <div class="tab-top">
              <el-tabs v-model="activeName">
                <el-tab-pane v-for="(item,index) in shortForecas" :label="item.name" :name="item.id" :key="index">
                  <div class="tab-content">
                    <div class="item-text">
                      <el-input class="resizeNone" type="textarea" :readonly='true' v-model="item.content"></el-input>
                  </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
          <div class="short-forecast short-forecast-tab tab-wrap rim el-tabs--border-card">
            <div class="tab-top">
              <el-tabs v-model="activeName2">
                <el-tab-pane v-for="(item,index) in cityByForecasts" :label="item.name" :name="item.id" :key="index">
                  <div class="tab-content">
                    <div class="item-text">
                      <el-input class="resizeNone" type="textarea" :readonly='true' v-model="item.content"></el-input>
                  </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>


      </div>
      <div class="right-box">
        <div class="right-top">
          <div class="top-left el-tabs--border-card">
            <div class="map-wrap">
              <div class="map-left" :class="shiftLeft? 'map-location':'map-location-hide'" :style="shiftLeft? 'width:100%;':'' ">
                <div class="map-item">
                  <!-- <map-box :layerType='"radar"'></map-box> -->
                  <iframe src="../../../../static/html/weatherMap/radar.html" class="inline" style="width:100%;height:100%;" frameborder="0"></iframe>
                </div>
              </div>
              <div class="map-right" :class="shiftRight? 'map-location':'map-location-hide'" :style="shiftRight? 'width:100%;':'' ">
                <div class="map-item">
                  <!-- <map-box :layerType='"cloud"'></map-box> -->
                  <iframe src="../../../../static/html/weatherMap/cloud.html" class="inline" style="width:100%;height:100%;" frameborder="0"></iframe>
                </div>
              </div>
            </div>
            <div class="shift-map" v-if="shiftIsMap" @click="shiftMap()">
              <i class="el-icon-s-promotion"></i>
            </div>
          </div>
          <div class="top-right">
            <div class="short-forecast forecast-box el-tabs--border-card">
              <div class="tab-top ">
                <el-tabs v-model="notice">
                  <el-tab-pane label="通知栏" name="1">
                    <div class="tab-content">
                      <div class="item-text" v-for="(item,index) in noticeList" :key="index">
                        {{item.name}}：<a :href="item.url" target="_blank">{{item.title}}</a> {{item.time}}
                      </div>
                    </div>
                    <!-- <div class="tab-content">
                      <div class="item-text">
                        天气预报：今天多云到阴；明天多云，夜里阴有时有小雨；后天阴有时有小雨
                      </div>
                      <div class="item-text">今天白天最高温度：20-22度；明天早晨最低温度：</div>
                    </div> -->
                  </el-tab-pane>
                  <!-- <el-tab-pane label="天气资讯" name="2">
                    <div class="tab-content">
                      <div class="item-text">今天白天最高温度：20-22度；明天早晨最低温度：</div>
                      <div class="item-text">
                        天气预报：今天多云到阴；明天多云，夜里阴有时有小雨；后天阴有时有小雨
                      </div>
                    </div>
                    <div class="tab-content">
                      <div class="item-text">今天白天最高温度：20-22度；明天早晨最低温度：</div>
                      <div class="item-text">
                        天气预报：今天多云到阴；明天多云，夜里阴有时有小雨；后天阴有时有小雨
                      </div>
                    </div>
                  </el-tab-pane> -->
                </el-tabs>
              </div>
            </div>

            <div class="weather-forecast forecast-box file el-tabs--border-card">
              <div class="title-box">
                <span class="bold-title">省级决策服务材料</span>
                <!-- <span class="more">更多+</span> -->
              </div>
              <div class="content-wrap-box">
              <el-tooltip class="item" :open-delay="800" v-for="(item,index) in uploadFileList" :key="index" effect="light" :content="item.name" placement="left-start">
                  <p class="material" @click="clickItemTxt(item.content)">{{item.name}}</p>
              </el-tooltip>
              </div>
            </div>
            <c-dialog class="pdf-wrap txt" title="内容查看" :visible.sync="visibleDialogFormItemTxt" :primary-text="null" :secondary-text="'关闭'" width="900px">
              <div class="content">
                  <pdf
                    ref="pdf"
                    :src='pdfUrl'>
                  </pdf>
              </div>
          </c-dialog>
          </div>
        </div>
        <div class="right-bottom">
          <div class="bottom-left monitoring">
            <el-tabs tab-position="left" v-model="bottomTab" type="border-card">
              <el-tab-pane label="7天趋势预报" name="7天趋势预报">
                <!-- <div class="title">
                  7天趋势预报
                </div> -->
                <div class="forecast-info tabs-pane">
                  <div class="info-left">
                        <el-radio-group size="mini" v-model="radio1">
                          <el-radio-button label="day">日</el-radio-button>
                          <el-radio-button label="xun">旬</el-radio-button>
                          <el-radio-button label="month">月</el-radio-button>
                        </el-radio-group>
                    <!-- <div class="but-box">
                      <div class="but but-top" >月</div>
                      <div class="but but-centre">旬</div>
                      <div class="but but-bottom">日</div>
                    </div> -->
                  </div>

                  <div class="echarts-box info-right" v-if="radio1 == 'month'" :key="componentKey">
                      <chart-result class="chart-line" :type='radio1' :skin='skin' v-if="chartResult"></chart-result>
                      <!-- <div class="chart-hint">
                          <div class="content">
                            历史最高温度：<span class="color-t"><--</span>
                          </div>
                          <div class="content">
                            历史最低温度：<span class="color-b"><--</span>
                          </div>
                      </div> -->
                  </div>
                  <div class="echarts-box info-right" v-if="radio1 == 'xun'" :key="componentKey">
                      <chart-result class="chart-line" :type='radio1' :skin='skin' v-if="chartResult"></chart-result>
                      <!-- <chart-result v-if="chartResult"></chart-result> -->
                      <!-- <chart-bar class="chart-bar" v-if="chartResult"></chart-bar> -->
                  </div>
                  <div class="echarts-box info-right" v-if="radio1 == 'day'" :key="componentKey">
                      <chart-result class="chart-line" :type='radio1' :skin='skin' v-if="chartResult"></chart-result>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane class="tab-pane-box-pro" label="降水监测" name="降水监测">
                <!-- <div class="title">
                  降水监测
                </div> -->
                <div class="pro-item">
                  <progress-content :skin='skin' :progress='bottomTabList.rainfall'></progress-content>
                </div>
              </el-tab-pane>
              <el-tab-pane class="tab-pane-box-pro" label="风力监测" name="风力监测">
                <!-- <div class="title">
                  风力监测
                </div> -->
                <div class="pro-item">
                  <progress-content :skin='skin' :progress='bottomTabList.wind'></progress-content>
                </div>
              </el-tab-pane>
              <el-tab-pane class="tab-pane-box-pro" label="能见度监测" name="能见度监测">
                <!-- <div class="title">
                  能见度监测
                </div> -->
               <div class="pro-item">
                  <progress-content :skin='skin' :progress='bottomTabList.visibility'></progress-content>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div class="bottom-right picture el-tabs--border-card">
            <div class="short-forecast forecast-box">
              <div class="tab-top">
                <span class="short-title">
                    3天降水图
                  </span>
                <el-tabs v-model="threeRainfall">
                  <el-tab-pane label="第一天" name="1">
                    <div class="tab-content">
                      <div class="img">
                        <img v-if="rainImgs.day1" :src="rainImgs.day1" :onerror="defaultImg" alt="">
                        <p v-else>暂无数据</p>
                      </div>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="第二天" name="2">
                    <div class="tab-content">
                      <div class="img">
                        <img v-if="rainImgs.day2" :src="rainImgs.day2" :onerror="defaultImg" alt="">
                        <p v-else>暂无数据</p>
                      </div>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="第三天" name="3">
                    <div class="tab-content">
                      <div class="img">
                        <img v-if="rainImgs.day3" :src="rainImgs.day3" :onerror="defaultImg" alt="">
                        <p v-else>暂无数据</p>
                      </div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
import chartResult from './../components/chart-result'
import chartBar from './../components/chart-bar'
import progressContent from './../components/progress-content'
import {
    requestWarningAlarm,
    requestWarningEarly,
    requestWarningShort,
    requestWarningemporary,
    requestWarningForecast,
    requestWarningCity,
    requestWarningAroundCity,
    requestWarningObj,
    requestWarningBottomTabList,
    requestWarningMaxRainStation,
    requestWarningDayMaxRainStation,
    requestWarningVisStationNum,
    requestWarningDayMinVisStation,
    requestWarningHour6MinVisStation,
    requestWarningWindStationNum,
    requestWarningDayMaxWindStation,
    requestWarningHourMaxWindStation,
    requestWarningRainStationNum,
    requestWarningNotice,
    requestWarningUploadFileListPdf,
    requestWarning3DayRain
} from "@/remote/";
import {
    transformAlarmsInfo
} from "@/common/tools/"
import {
    common,
    witchCommonList,
    withCommonLeftTree
} from '../../mixins/index';
import echarts from 'echarts';
import mapBox from './../components/map-box';
  export default {
    mixins: [common, witchCommonList, withCommonLeftTree],
    components: {
        chartResult,
        chartBar,
        progressContent,
        pdf,
        mapBox,
    },
    data() {
      return {
        skin:false,
        collapseDomHeight:null,
        activeNames: [],
        imgSource:null,
        defaultImg: 'this.src="' + require('../../../assets/img/noData.png') + '"',
        componentMapKey: 0,
        shiftLeft:true,
        shiftRight:true,
        shiftIsMap:false,
        windowHeight:null,
        componentKey:0,
        uploadFileList:null,
        rainImgs:{day1:null,day2:null,day3:null},
        noticeList:null,
        visibleDialogFormItemTxt:false,
        pdfUrl:null,
        bottomTabList:{
          rainfall:[
            {label:'站点数量',amount:100,content:'暂无数据',status:'success'},
            {label:'今日小时最大雨强',amount:100,content:'暂无数据',status:'success'},
            {label:'日最大降雨量',amount:100,content:'暂无数据',status:'success'},
            {label:'突破历史同期',amount:100,content:'暂无数据',status:'success'},
          ],
          wind:[
            {label:'11级极大风',amount:100,content:'暂无数据',status:'warning'},
            {label:'9级极大风',amount:100,content:'暂无数据',status:'warning'},
            {label:'小时极大风',amount:100,content:'暂无数据',status:'warning'},
            {label:'日极大风',amount:100,content:'暂无数据',status:'warning'},
          ],
          visibility:[
            {label:'200m站点数量',amount:100,content:'暂无数据',status:'exception'},
            {label:'500m站点数量',amount:100,content:'暂无数据',status:'exception'},
            {label:'日最低能见度',amount:100,content:'暂无数据',status:'exception'},
            {label:'近6h最低能见度',amount:100,content:'暂无数据',status:'exception'},
          ],
        },
        bottomTab:'7天趋势预报',
        alarmList:null,
        earlyList:null,
        chartResult:false,
        radio1: 'day',
        threeRainfall:'1',//三天降水
        notice:'1',//通知栏
        activeName: '1',
        activeName2:'1',
        shortForecas:[
          {
            id:'1',
            name:'短临预报',
            content:'暂无数据'
          },
          {
            id:'2',
            name:'短期预报',
            content:'暂无数据'
          }
        ],
        cityByForecasts:[
          {
            id:'1',
            name:'十天预报',
            content:'暂无数据'
          },
          {
            id:'2',
            name:'城市预报',
            content:'暂无数据',
          },
          {
            id:'3',
            name:'周边城市预报',
            content:'暂无数据',
          }
        ],
      }
    },
    watch:{
      bottomTab(val){
        if(val == '7天趋势预报'){
          this.chartResult = !this.chartResult
          setTimeout(() => {
          this.chartResult = !this.chartResult
          }, 300);
        }
      },
      radio1(){
        this.componentKey += 1;
      },
      forceRerender() {
        this.componentMapKey += 1; 
      },
      windowHeight:{
        immediate:true,
        handler:function(val){
        if(val <= 1400){
          this.shiftIsMap = true,
          this.shiftLeft = false,
          this.shiftRight = true
        }else{
          this.shiftIsMap = false,
          this.shiftLeft = true,
          this.shiftRight = true
        }
        }
      },
    },
    mounted(){
      // window.onresize = () => {
      //   return (() => {
      //     this.windowHeight = document.body.clientHeight;
      //   })();
      // };
      this.requestData()
      // window.addEventListener('resize',function() {myChart.resize()});
      
    },
    methods:{
      skinClick(){
        this.chartResult = !this.chartResult
        setTimeout(() => {
        this.chartResult = !this.chartResult
        }, 300);
        this.skin = !this.skin
      },
      handleChange(val) {
        setTimeout(() => {
          this.collapseDomHeight = this.$refs.collapseDom.offsetHeight;  //100
          console.log(this.collapseDomHeight)
        }, 300);
        // console.log(val);
      },
      shiftMap(){
        this.shiftLeft = !this.shiftLeft;
        this.shiftRight = !this.shiftRight;
        this.forceRerender +=1
      },
      clickItemTxt(url){
        // this.visibleDialogFormItemTxt = true
        // this.pdfUrl = `http://image.cache.timepack.cn/nodejs.pdf`
        this.pdfUrl = `http://10.137.4.30:8888/fileservice${url}`
        window.open(this.pdfUrl, '_blank');
    },
    async requestData(){
        this.chartResult = true

                //底部 降水 风力 能见度
        // requestWarningBottomTabList().then(res=>{
        //   this.bottomTabList = res.data
        // })
        //底部 降水  降水监测
        requestWarningRainStationNum().then(res=>{
          if(res.data == null) return
          this.bottomTabList.rainfall[0].amount = res.data.proportion,
          this.bottomTabList.rainfall[0].value = res.data.rainStationNum,
          this.bottomTabList.rainfall[0].content = res.data.countStationNum
        })
        requestWarningMaxRainStation().then(res=>{
          if(res.data == null) return
          this.bottomTabList.rainfall[1].amount = 100,
          this.bottomTabList.rainfall[1].value = `${res.data.rain}mm`,
          this.bottomTabList.rainfall[1].content = res.data.stationName
        })
        requestWarningDayMaxRainStation().then(res=>{
          if(res.data == null) return
          this.bottomTabList.rainfall[2].amount = 100,
          this.bottomTabList.rainfall[2].value = `${res.data.count}mm`,
          this.bottomTabList.rainfall[2].content = res.data.stationName
        })
        //大风监测
        requestWarningWindStationNum({windLevel:'11'}).then(res=>{
          if(res.data == null) return
          this.bottomTabList.wind[0].amount = res.data.proportion,
          this.bottomTabList.wind[0].value = res.data.windStationNum,
          this.bottomTabList.wind[0].content = res.data.countStationNum
        })
         requestWarningWindStationNum({windLevel:'9'}).then(res=>{
           if(res.data == null) return
           this.bottomTabList.wind[1].amount = res.data.proportion,
            this.bottomTabList.wind[1].value = res.data.windStationNum,
            this.bottomTabList.wind[1].content = res.data.countStationNum
          })
        requestWarningHourMaxWindStation().then(res=>{
          if(res.data == null) return
          this.bottomTabList.wind[2].amount = 100,
          this.bottomTabList.wind[2].value = `${res.data.windv}m/s`,
          this.bottomTabList.wind[2].content = res.data.stationName
        })
        requestWarningDayMaxWindStation().then(res=>{
          if(res.data == null) return
          this.bottomTabList.wind[3].amount = 100,
          this.bottomTabList.wind[3].value = `${res.data.windv}m/s`
          this.bottomTabList.wind[3].content = res.data.stationName
        })

        //能见度监测
        requestWarningVisStationNum({visibValue:'200'}).then(res=>{
          if(res.data == null) return
          this.bottomTabList.visibility[0].amount = res.data.proportion,
          this.bottomTabList.visibility[0].value = res.data.visibStationNum,
          this.bottomTabList.visibility[0].content = res.data.countStationNum
        })
        requestWarningVisStationNum({visibValue:'500'}).then(res=>{
          if(res.data == null) return
          this.bottomTabList.visibility[1].amount = res.data.proportion,
          this.bottomTabList.visibility[1].value = res.data.visibStationNum,
          this.bottomTabList.visibility[1].content = res.data.countStationNum
        })
        requestWarningDayMinVisStation().then(res=>{
          if(res.data == null) return
          this.bottomTabList.visibility[2].amount = 100,
          this.bottomTabList.visibility[2].value = `${res.data.visib}m`,
          this.bottomTabList.visibility[2].content = res.data.stationName
        })
        requestWarningHour6MinVisStation().then(res=>{
          if(res.data == null) return
          this.bottomTabList.visibility[3].amount = 100,
          this.bottomTabList.visibility[3].value = `${res.data.visib}m`,
          this.bottomTabList.visibility[3].content = res.data.stationName
        })

        //右侧 通知栏
        requestWarningNotice().then(res=>{
          this.noticeList = res.data
        })
        //右侧 材料pdf list
        requestWarningUploadFileListPdf().then(res=>{
          this.uploadFileList = res.data.list
        })

        //三天降水图
        requestWarning3DayRain().then(res=>{
          this.rainImgs = res.data
          // this.rainImgs.day1 = 'https://img-bss.csdn.net/1606271766185.jpg'
        })

        // 左侧 天气警报
        requestWarningAlarm().then(res=>{
          if(!res.data || res.data.length == 0) return
          this.activeNames.push('1')
          this.alarmList = res.data
          this.alarmList.forEach(element => {
            element.icon = element.alarmCode.split(",")[0]
          });
        })
        //左侧 市县警报
        requestWarningEarly().then(res=>{
          if(!res.data || res.data.length == 0) return
          this.activeNames.push('2')
          this.earlyList = res.data
        })
        
        //左侧 短期 预报
        requestWarningShort().then(res=>{
          let resData = res.data
          JSON.stringify(resData) == "{}"? this.shortForecas[0].content = '暂无数据':this.shortForecas[1].content = resData.content
        })
        //左侧 短临 预报
        requestWarningemporary().then(res=>{
            let resData = res.data
          JSON.stringify(resData) == "{}"? this.shortForecas[0].content = '暂无数据':this.shortForecas[0].content = resData.content
        })
        //左侧 十天预报
        requestWarningForecast().then(res=>{
          let resData = res.data
          JSON.stringify(resData) == "{}"? this.cityByForecasts[0].content = '暂无数据':this.cityByForecasts[0].content = resData.content
        })
        //左侧 城市预报
        requestWarningCity().then(res=>{
            let resData = res.data
          JSON.stringify(resData) == "{}"? this.cityByForecasts[0].content = '暂无数据':this.cityByForecasts[1].content = resData.content
        })
        //左侧 周边城市预报
        await  requestWarningAroundCity().then(res=>{
            let resData = res.data
          JSON.stringify(resData) == "{}"? this.cityByForecasts[0].content = '暂无数据':this.cityByForecasts[2].content = resData.content
        })

        

        this.windowHeight = document.body.clientWidth;
        this.collapseDomHeight = this.$refs.collapseDom.offsetHeight;  //100

      },
      toMore(data){
        //当前页面打开
        // if(data == '天气警报'){this.$router.push({path:'/weather-warning/trace/warning'})}
        // if(data == '市县预警'){this.$router.push({path:'/weather-warning/trace/alarm'})}

        //打开一个新窗口
        let routeData
        if(data == '天气警报'){
          routeData = this.$router.resolve({path:'/weather-warning/trace/warning'})
          window.open(routeData.href, '_blank');
          }
        if(data == '市县预警'){
          routeData = this.$router.resolve({path:'/weather-warning/trace/alarm'})
            window.open(routeData.href, '_blank');
          }
      }
    },
    filters: {
        alermInfo(val) {
            if (val) {
                return transformAlarmsInfo({
                    // type: val.XXXPROP_TRACE_ALARM_TYPE,
                    code: val.code,
                    level: val.level
                })
            }
        }
    }
  }
</script>

<style lang='postcss' scoped>
@media screen and (min-width:1025px) and (max-width:1300px){
  .bottom-left{
    width: calc(100% - 290px) !important;
  }
  .bottom-right {
    width: 290px !important;
  }
}
@media screen and (min-width:10px) and (max-width:1024px){
  .bottom-left{
    width: 100% !important;
  }
  .bottom-right {
    display:none;
  }

  .weather-situation-page .wrap-box .left-box .left-bottom .short {
      margin-bottom: 0px!important;
      height: calc(100% - 2px)!important;
  }
  .weather-situation-page .wrap-box .left-box .left-bottom .rim {
      display: none!important;
  }
}
.weather-situation-page{
  height: 100%;
  .wrap-box{
    display: flex;
    justify-content: space-between;
    background: #fff;
    padding:5px 0 5px 0;
    height: calc(100% - 10px);
    .left-box{
      height: 100%;
      width: 290px;
      .forecast-box{
        .content-wrap-box{
          padding: 0px 25px;
          position: relative;
            .count{
              position: absolute;
              right: 15px;
              bottom: 0px;
              width: 50px;
              height: 20px;
              color: #409eff;
              display: inline-block;
              font-size: 12px;
              cursor:pointer;
            }
          .content-warning-img {
            padding-top: 2rem;
            width: 100%;
            height: 50%;
          }
        }
        .content-box{
          padding: 5px 0px 0px 0px;
          display: flex;
          justify-content: space-between;
          .taifengxiaoxi,
          .taifengjingbao,
          .taifengjinjijingbao,
          .baoyu,
          .daoxue,
          .lengkongqi,
          .qianglengkongqi,
          .hanchao1,
          .jiangwenbaogao,
          .yanhanjingbao,
          .gaowenbaogao,
          .kurejingbao,
          .diwenbaogao01,
          .nongwujingbao,
          .mai,
          .dafengjingbao,
          .leibaojingbao,
            {
              font-size: 28px;
              color:#409EFF;
              margin-right:10px;
            }
          .yujing-img{
            width: 52px;
            height: 45px;
            margin-right:10px;
          }
          .item{
            .title-F56C6C{
              width: 190px;
              font-size:14px;
              font-family:Microsoft YaHei;
              color:rgba(245,108,108,1);
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              word-break: break-all;
              margin-bottom:10px;
            }
            .title-606266{
              color: #606266;
            }
            .time{
              font-size:13px;
              font-family:Microsoft YaHei;
              color:rgba(144,147,153,1);
            }
          }
        }
        .tab-content{
          padding: 5px 20px;
          .item-text{
            font-size:14px;
            font-family:Microsoft YaHei;
            color:rgba(96,98,102,1);
            line-height:22px;
          }
        }
      }
      .ten-days-forecast{
        margin-bottom: 10px;
      }
    }
    .right-box{
      flex: 1;
      margin-left: 5px;
      position: relative;
      .right-top{
        height: calc(100% - 305px);
        display: flex;
        justify-content: space-between;
        .top-left{
          position: relative;
          height: 100%;
          width: calc(100% - 295px);
          .map-wrap{
            display: flex;
            height: 100%;
            position: relative;
            .map-left{
              width: 50%;
              .map-item
              {
                height: 100%;
              }
            }
            .map-right{
              width: 50%;
              .map-item
              {
                height: 100%;
              }
            }
          }
          .map-location-show {
            position: absolute;
            left: 0;
            top: 0;
            z-index:10;
            width:100%;
            height: 100%;
          }
          .map-location-hide {
            position: absolute;
            left: -2000px;
            top: -2000px;
            z-index:0;
            width:100%;
            height: 100%;
          }
          .shift-map{
            bottom:0;
            right: 0;
            position: absolute;
            color: #409eff;
            width:40px;
            height: 40px;
            cursor: pointer;
            font-size: 26px;
            z-index:20;
          }
        }
        .top-right{
          margin-left:5px;
          width: 290px;
          height: 100%;
            .forecast-box{
              height: calc(50%-7px);
              background: #fff;
              border:1px solid rgba(221, 221, 221, 1);
              margin-bottom:5px;
              .tab-top{
                height: 100%;
                .el-tabs--top{
                  height: 100%;
                }
              }
              .content-wrap-box{
                height: calc(100%-50px);
                overflow: auto;
                padding: 0px 25px;
              }
              .content-box{
                padding: 20px 0px 13px 0px;
                display: flex;
                justify-content: space-between;
                .hanchao,.baoxue{
                  font-size: 28px;
                  color:#409EFF;
                  margin-right:10px;
                }
                .yujing-img{
                  width: 52px;
                  height: 45px;
                  margin-right:10px;
                }
                .item{
                  .title-F56C6C{
                    width: 190px;
                    font-size:14px;
                    font-family:Microsoft YaHei;
                    color:rgba(245,108,108,1);
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-all;
                    margin-bottom:10px;
                  }
                  .title-606266{
                    color: #606266;
                  }
                  .time{
                    font-size:13px;
                    font-family:Microsoft YaHei;
                    color:rgba(144,147,153,1);
                  }
                }
              }
              .tab-content{
                padding: 5px 20px;
                .item-text{
                  font-size:14px;
                  font-family:Microsoft YaHei;
                  color:rgba(96,98,102,1);
                  line-height:22px;
                }
              }
            }
           .material{
            outline: 0;
            cursor:pointer;
             font-size: 14px;
            font-family: Microsoft YaHei;
            color: #606266;
            line-height: 22px;
             border-bottom: solid 1px #ccc;
             margin: 8px 0 4px 0;
              display: inline-block;
              white-space: nowrap;
              width: 100%;
              overflow: hidden;
              text-overflow:ellipsis;
           }
           .file{
             margin-bottom: 0px !important;
             height: calc(50% - 2px)!important;
           }
        }
      }
      .right-bottom{
        /* background: cornflowerblue; */
        height: 300px;
        width: 100%;
        margin-top:5px;
        display: flex;
        justify-content: space-between;
        position: absolute;
        left: 0;
        bottom:0;
        .bottom-left{
          width: calc(100%-435px);
          position: relative;
          .el-tabs {
            height: 100% !important;
          }
          .title {
            position: absolute;
          }
          .forecast-info {
            /* background: darkgoldenrod; */
            display: flex;
            justify-content: space-between;
            height: 100%;
            .info-left {
              height: 100% !important;
              display:flex;
              /* width: 100px; */
              justify-content: center;
              .but-box{
                margin: 30px;
                  .but{
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  text-align: content;
                  height: 50px;
                  width:40px;
                  font-size: 14px;
                  /* padding: 7px 15px; */
                  color: #fff;
                  background-color: #409eff;
                  border-color: #409eff;
                  line-height: 1;
                  white-space: nowrap;
                  cursor: pointer;
                  -webkit-appearance: none;
                  text-align: center;
                  -webkit-box-sizing: border-box;
                  box-sizing: border-box;
                  outline: 0;
                  margin: 0;
                  -webkit-transition: .1s;
                  transition: .1s;
                  font-weight: 500;
                }
                .but-top{
                  border-radius: 4px 4px 0 0;
                }
                .but-centre{
                  border-top: 1px #eee solid;
                  border-bottom: 1px #eee solid;
                }
                .but-bottom{
                  border-radius: 0 0 4px 4px;
                }
              }

            }
            .info-right{
              position: relative;
              /* background: darkcyan; */
              width: calc(100%-0px);
              .chart-hint {
                  top: 6px;
                  right: 10px;
                  color:#555;
                  position:absolute;
                  font-size:12px;
                .content{
                  .color-t {
                    color: red;
                  }
                  .color-b {
                    color: green;
                  }
                  margin-bottom:4px;
                  display: block;
                }
              }
            }
          }
        }
        .bottom-right{
          width: 430px;
          margin-left: 5px;
          background: #fff;
          .img{
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            img{
              width: 100%;
              height: 100%;
            }
          }
            .forecast-box{
              background: #fff;
              /* border:1px solid rgba(221, 221, 221, 1); */
              /* margin-bottom:10px; */
              .content-wrap-box{
                padding: 0px 25px;
              }
              .content-box{
                padding: 20px 0px 13px 0px;
                display: flex;
                justify-content: space-between;
                .taifengxiaoxi,
                .taifengjingbao,
                .taifengjinjijingbao,
                .baoyu,
                .daoxue,
                .lengkongqi,
                .qianglengkongqi,
                .hanchao1,
                {
                  font-size: 28px;
                  color:#409EFF;
                  margin-right:10px;
                }
                .yujing-img{
                  width: 52px;
                  height: 45px;
                  margin-right:10px;
                }
                .item{
                  .title-F56C6C{
                    width: 190px;
                    font-size:14px;
                    font-family:Microsoft YaHei;
                    color:rgba(245,108,108,1);
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-all;
                    margin-bottom:10px;
                  }
                  .title-606266{
                    color: #606266;
                  }
                  .time{
                    font-size:13px;
                    font-family:Microsoft YaHei;
                    color:rgba(144,147,153,1);
                  }
                }
              }
              .tab-content{
                padding: 0px 20px 10px 20px;
                height:calc(100% - 20px);
                .item-text{
                  font-size:14px;
                  font-family:Microsoft YaHei;
                  color:rgba(96,98,102,1);
                  line-height:22px;
                }
              }
            }
        }
      }
    }

    .title-box{
      padding: 0 10px 0 20px;
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom:1px solid rgba(221, 221, 221, 1);
      .bold-title{
        font-size:15px;
        font-family:Microsoft YaHei;
        font-weight:bold;
        color:rgba(48,49,51,1);
      }
    }
    .border-top{
      border-top:1px solid rgba(221, 221, 221, 1);
      cursor: pointer;
    }
  }
  .pdf-wrap {
    .content{
      overflow: auto;
      height: 660px;
      background-color: #444;
    }
  }
  .short-forecast-tab {
    .tab-content {
      padding: 0 !important;
    }
    .el-tabs__header {
      margin: 0 0 2px;
    }
    .el-tab-pane {
      height: 140px;
      overflow: auto;
    }
  }
   .wrap-box{
     .border-top:first-of-type  {
     border: 0px;
    }
   } 
  .skin {
      position: fixed;
      right: 0;
      bottom: 20px;
      width: 45px;
      height: 25px;
      border-radius: 25px 0 0 25px;
      background: #409eff;
      color: fff;
      font-size: 14px;
      z-index: 10;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      cursor: pointer;
  }

}
</style>
<style lang='postcss'>
.weather-situation-page{
  .tab-top .el-tabs__nav{
    margin-left: 20px;
 .el-tabs__item.is-top {
      padding:0 5px;
    }
  }
  .el-tabs__item{
    font-size:15px;
    font-family:Microsoft YaHei;
    color:rgba(48,49,51,1);
  }
  .bottom-left {
    .el-tabs__item {
      height: 25% !important;
    }
    .el-radio-button:nth-child(1){
      display: block;
      .el-radio-button__inner{
        border-radius: 4px 4px 0 0;
        height: 50px;
        width:40px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .el-radio-button:nth-child(2){
      display: block;
      .el-radio-button__inner{
        border-radius: 0;
        /* border-left: 1px solid #dcdfe6;
        border-right: 1px solid #dcdfe6; */
        height: 50px;
        width:40px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .el-radio-button:nth-child(3){
      display: block;
      .el-radio-button__inner{
        border-radius: 0 0 4px 4px;
        height: 50px;
        width:40px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .right-bottom {
    .monitoring{
      .el-tabs__content {
      height: 280px !important;
      padding: 15px 0 0 0;
      .el-tab-pane {
      height: 100% !important;
      overflow-y: hidden;
      white-space: nowrap;
      .tabs-pane {
      }
    }
    .tab-pane-box-pro {
      .pro-item{
        display: flex!important;
        align-items: center!important;
        justify-content: center!important;
        position: relative;
        height: 100%;
        width:100%;
        .el-progress {
          margin: 30px;
          .el-progress-circle {
            /* height: 150px!important;
            width: 150px!important; */
          }
        }
      }
      }
    }
    }
    .picture{
      .el-tabs__content {
      height: 244px !important;
      padding-bottom:0;
      .el-tab-pane {
      height: 100% !important;
    }
    }
    }

    .bottom-right{
      position: relative;
      .el-tabs__nav-scroll {
        display: flex;
        justify-content: flex-end;
        margin-right: 20px;
        .el-tabs__nav{
         #tab-1 {

        }
         #tab-2 {

        }
        }
      }
    }
    .short-title {
      position: absolute;
      top: 12px;
      left: 12px;
      font-size: 15px;
      font-family: Microsoft YaHei;
      font-weight: 700;
      color: #303133;
      display: inline;
      padding-top:1px;
    }
  }
  .resizeNone{
   .el-textarea__inner{
         resize: none;
         height: 140px;
         border: 0px solid #263559;
     }
 }
 .short-forecast-tab {
    .el-tabs__header {
      margin: 0 0 2px;
    }
  }
  .skinColor {
    background-color: #02133e !important;
    .el-collapse{
      border-top: 1px #00d0ff solid !important;
    }
    .el-collapse-item__header{
      background-color: #02133e;
      border-left: 1px #00d0ff solid !important;
      border-right: 1px #00d0ff solid !important;
      /* border-bottom: 1px #00d0ff solid !important; */
      color:#fff;
      span{
        color:#1cc0f6 !important;
      }
      .more{
        color:#fff !important;
      }
    }
    .content-wrap-box{
      background-color: #02133e;
    }
    .left-box .forecast-box .content-box .item {
      .title-606266{
        color: #fff !important;
      }
      .time{
        color:#fff !important;
      }
    }
    .el-tabs--border-card{
      background-color: #02133e !important;
      border: 1px #00d0ff solid !important;
      color:#fff !important;
    }
    .el-textarea__inner {
      background-color: #02133e !important;
      border-bottom: 1px #00d0ff solid !important;
      color:#fff !important;
    }
    .el-tabs__nav-wrap:after{
      background-color: #02133e !important;
      border: 1px #00d0ff solid !important;
      color:#fff !important;
    }
    .el-tabs--border-card>.el-tabs__header{
      background-color: #02133e !important;
      /* border: 1px #00d0ff solid !important; */
      color:#fff !important;
    }
    .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active{
      background-color: #409eff !important;
      color: #fff;
    }
    .right-box .right-bottom .bottom-right .forecast-box{
      background-color: #02133e !important;
      /* border: 1px #00d0ff solid !important; */
      color:#fff !important;
    }
    .el-collapse-item__wrap{
      background-color: #02133e !important;
      /* border: 1px #00d0ff solid !important; */
      color:#fff !important;
    }
    .right-box .right-top .top-right .material{
      color:#fff !important;
    }
    .right-box .right-top .top-right .forecast-box .tab-content .item-text{
      color:#fff !important;
    }
    .right-box .right-top .top-right .forecast-box .tab-content .item-text a{
      color:rgb(110, 126, 216) !important;
    }
    .el-tabs__item{
      color: #fff !important;
    }
    .title-box .bold-title{
      color: #fff !important;
    }
    .right-bottom .short-title{
      color: #fff !important;
    }
  }
}
/* 宽度小于 xxx 像素则 */
@media screen and (max-width: 1700px) {
    .pro-item{
      .el-progress {
        margin: 0px 30px !important;
         height: 100%!important;
        .el-progress-circle {
          height: 130px!important;
          width: 130px!important;
        }
      }
    }
    .progress-wrap {
      flex-wrap: wrap !important;
      .progress-item{
        height: 50% !important;
      }
      .content{
        min-width: 130px!important;
      }
      .text{
        margin-bottom: 2px;
      }
      .value{
        font-size:16px !important;
      }
      .label{
        font-size:16px !important;
      }
      .character{
        font-size:16px !important;
      }
    }
}
/* 宽度大于 xxx 像素则 */
@media screen and (min-width: 1700px) {
  .pro-item{
    .el-progress {
      margin: 30px;
      .el-progress-circle {
        height: 150px!important;
        width: 150px!important;
      }
    }
  }
}
.echarts-box {
  position: relative;
  height: 280px;
    #chart_example{
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
      }
  .chart-line {
    /* background: red; */
    /* height: 200px !important; */
    canvas {
      /* height: 200px !important; */
    }
  }
  .chart-bar {
    /* background: blue; */
    height: 200px !important;
  }
   canvas {
      /* height: 200px !important; */
    }
}
.weather-situation-page .wrap-box .right-box .top-right .el-tabs__header {height: 40px !important;margin: 0;}
.weather-situation-page .wrap-box .right-box .top-right .el-tabs__content {height: calc(100% - 40px) !important;overflow: auto;}

/* .weather-situation-page .wrap-box .left-box .forecast-box {margin: 0 !important;} */
/* .weather-situation-page .wrap-box .left-box .left-top {height: 400px;} */
.weather-situation-page .wrap-box .left-box .left-top .forecast-box{height: 140px;margin-bottom:5px;background: #fff;border:1px solid rgba(221, 221, 221, 1);}
/* .weather-situation-page .wrap-box .left-box .left-bottom {height: 100%;} */
.weather-situation-page .wrap-box .left-box .el-collapse-item__content {padding:0}
.weather-situation-page .wrap-box .left-box .title-content {padding-left: 20px;font-size: 15px;font-family: Microsoft YaHei;color: #303133;}
.weather-situation-page .wrap-box .left-box .more {padding-left: 140px;font-size:15px;font-family:Microsoft YaHei;color:rgba(144,147,153,1);cursor: pointer;width: 45px;display: inline-block;text-align: right;}
.weather-situation-page .wrap-box .left-box .left-bottom .tab-wrap {background: #fff;border: 1px solid #ddd;}
.weather-situation-page .wrap-box .left-box .left-bottom .short{margin-bottom: 5px; height: calc(50% - 7px) !important;}
.weather-situation-page .wrap-box .left-box .left-bottom .rim{height: calc(50% - 2px) !important;}
.weather-situation-page .wrap-box .left-box .left-bottom .rim .el-tabs__item{padding: 5px;}
.weather-situation-page .wrap-box .left-box .left-bottom .tab-wrap .tab-top{height: 100%}
.weather-situation-page .wrap-box .left-box .left-bottom .tab-wrap .tab-top .el-tabs{height:100%}
.weather-situation-page .wrap-box .left-box .left-bottom .tab-wrap .tab-top .el-tabs .el-tabs__header{height:40px}
.weather-situation-page {
  .wrap-box{
    .left-box{
      .left-bottom{
        .tab-wrap{
          .tab-top{
            .el-tabs {
              .el-tabs__content {
                height: calc(100% - 40px) !important;
                .el-tab-pane{
                  height: 100%;
                  .tab-content{
                    height: 100%;
                    .item-text{
                      height: 100%;
                      .resizeNone {
                        height: 100%;
                        .el-textarea__inner{
                          height: 100%;
                          border-bottom: 1px solid #ddd;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
/* .weather-situation-page .wrap-box .left-box .left-bottom .tab-wrap .tab-top .el-tabs .el-tabs__content .el-tab-pane{ height: calc(100% - 40px) !important;} */

</style>
