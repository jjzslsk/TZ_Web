<template>
  <div class="management-home-page">
    <div class="wrap-box">
      <div class="left-box">
        <div class="left-top-box">
          <div class="shifting-duty-wrap-box">
            <div class="title-text-box">
              <div class="bold-text">交接班</div>
              <router-link to="/integrated-management/duty-management/history">
                <div class="small-text" >历史交接班记录</div>
              </router-link>
            </div>
            <div class="step-box">
              <div class="left-date">
                <el-tabs tab-position="left" style="height: 200px;" v-model="activeName" @tab-click="handleClick">
                  <el-tab-pane :label="item.name" v-for="item in optionsType" :name="item.id" :key="item.id">
                      <div class="step-warp" v-for="(item,index) in stepList" :key="index">
                        <div class="name">
                          <span v-if="item.name.length > 0">
                            {{item.name}}
                          </span>
                          <span v-else>
                            &nbsp
                          </span>
                        </div>
                        <div class="br">
                          <div class="dot" :class="item.success? 'br-dot':''"></div>
                        </div>
                        <div class="date">
                          <span>
                            {{item.date}}
                          </span>
                        </div>
                        <div class="week">
                          <span>
                            {{item.week}}
                          </span>
                        </div>
                      </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
              <div class="right-icon" @click="inputItem()">
                <i class="iconfont jiaoban"></i>
                <div class="jiaoban-text" >交班</div>
              </div>
            </div>
            <div class="table-box">
              <div class="table-title">交接班任务</div>
              <el-table :data="tableData" border style="width: 100%" :show-header="false">
                <el-table-column type="index" label="" width="40"></el-table-column>
                <el-table-column label="">
                  <template slot-scope="scope">
                    <div class="cell-box">
                      <span class="text">{{scope.row.content}}</span>
                      <div>
                      <span class="text">{{scope.row.title}}</span>
                        <!-- <el-button round size="small" class="color-F46D6A">应急title</el-button>
                        <el-button round size="small" class="color-E6A23D">重大</el-button> -->
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="" width="180">
                  <template slot-scope="scope">
                    <div class="cell-box">
                      <span class="text">{{scope.row.time}}</span>
                      <div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="duty-roster-wrap-box">
            <div class="title-text-box">
              <div class="bold-text">值班表</div>
              <router-link to="/integrated-management/duty-management/scheduling">
                <div class="small-text">值班管理</div>
              </router-link>
            </div>
              <el-calendar>
                <template class="calendar-wrap"
                  slot="dateCell"
                  slot-scope="{date, data}">
                  <p :class="data.isSelected ? 'is-selected' : ''" @mouseover="allcalendar(data.day,$event)" @mouseout="dutyTablePopEvl()">
                    {{ data.day.split('-').slice(2).join('-') }} {{ data.isSelected ? '' : ''}}
                  </p>
                  <!-- <div v-for="(item,index) in calendarData" :key="index" >
                    <div v-if="(item.month).indexOf(data.day.split('-').slice(1)[0])!=-1">
                      <div v-if="(item.date).indexOf(data.day.split('-').slice(2).join('-'))!=-1">
                            <div class="item" effect="dark" :content="item.userName" placement="right">
                                <div class="name-style">{{item.userName}}</div>
                            </div>
                        </div>
                      <div v-else></div>
                    </div>
                    <div v-else></div>
                  </div> -->
                  <div v-for="(item,index) in calendarData" :key="index" @mouseover="allcalendar(data.day,$event)" @mouseout="dutyTablePopEvl()">
                   <div v-if="(item.month).indexOf(data.day.split('-').slice(1)[0])!=-1">
                     <div v-if="(item.date).indexOf(data.day.split('-').slice(2).join('-'))!=-1">
                          <!-- <el-tooltip class="item" effect="dark" :content="item.userName" placement="right"> -->
                               <div class="is-selected calendar-text">{{item.userName}}</div>
                          <!-- </el-tooltip> -->
                       </div>
                    <div v-else></div>
                   </div>
               <div v-else></div>
             </div>
                </template>
              </el-calendar>
          </div>
        </div>
        <div class="left-bottom-box">
          <div class="title-text-box">
            <div class="bold-text">综合管理</div>
          </div>
          <ul class="border-box">
              <li>
                <div class="title-text">值班管理</div>
                <div class="item-list">
                  <div class="icon-box" v-for="(item,index) in dutyList" :key="index" @click="addJobs()">
                    <router-link :to="item.url">
                      <i class="iconfont" :class="item.icon" :style="{'color':item.color}"></i>
                      <div class="icon-text">{{item.text}}</div>
                    </router-link>
                  </div>
                </div>
              </li>
              <li>
                <div class="title-text">值班流程配置</div>
                <div class="item-list">
                  <div class="icon-box" v-for="(item,index) in process" :key="index" @click="addJobs()">
                    <router-link :to="item.url">
                      <i class="iconfont" :class="item.icon" :style="{'color':item.color}"></i>
                      <div class="icon-text">{{item.text}}</div>
                    </router-link>
                  </div>
                </div>
              </li>
              <li>
                <div class="title-text">临时任务单</div>
                <div class="item-list">
                  <div class="icon-box" v-for="(item,index) in task" :key="index" @click="addJobs()">
                    <router-link :to="item.url">
                      <i class="iconfont" :class="item.icon" :style="{'color':item.color}"></i>
                      <div class="icon-text">{{item.text}}</div>
                    </router-link>
                  </div>
                </div>
              </li>
              <li>
                <div class="title-text">工作留痕</div>
                <div class="item-list">
                  <div class="icon-box" v-for="(item,index) in remains" :key="index" @click="addJobs()">
                    <router-link :to="item.url">
                      <i class="iconfont" :class="item.icon" :style="{'color':item.color}"></i>
                      <div class="icon-text">{{item.text}}</div>
                    </router-link>
                  </div>
                </div>
              </li>
            </ul>
        </div>
      </div>
      <div class="right-box">
        <div class="title-text-box monitoring-title-box">
          <div class="bold-text">值班流程监控提醒</div>
          <div class="small-text">
            <router-link tag='span' to="/integrated-management/duty-process/scheduling">管理</router-link>
          </div>
        </div>
          <el-radio-group
              class="button-tab"
              v-model="optionsTypeValue"
              size="mini"
              style="margin-bottom: 20px;"
            >
              <el-radio-button
                v-for="item in optionsType"
                :key="item.id"
                :label="item"
              >{{item.name}}</el-radio-button>
            </el-radio-group>
        <div class="block">
          <el-timeline v-if="activities.length > 0">
            <!-- <el-tooltip v-for="(activity, index) in activities" :key="index" placement="top" effect="light" content="编辑产品?"> -->
            <el-timeline-item
              style='cursor:pointer'
              v-for="(activity, index) in activities"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
              @click.native="timelineClick(activity)"
              :timestamp="activity.timestamp"
              :class="activity.range=='早晨'? 'el-timeline-item-red':'' || activity.range=='上午'? 'el-timeline-item-green':'' || activity.range=='下午'? 'el-timeline-item-blue':'' || activity.range=='夜间'? 'el-timeline-item-yellow':''" 
              >
              <!-- <el-tooltip class="item" effect="light" content="操作为完成?" placement="top">
                <div class="timeline-event" @click.stop="timelineEvent(activity)"></div>
              </el-tooltip> -->
              <!-- <div class="activity-content" @mouseover="mouseOver(index)" @mouseleave="mouseLeave(index)"> -->
                <span>{{activity.content}}</span>
              <span class="timeFrame" :style="activity._zcIndex == 1? `top:${activity._zc*56/2}px`:''" v-if="activity._zcIndex == 1">{{activity.range}}</span>
              <span class="timeFrame" :style="activity._swIndex == 1? `top:${activity._sw*56/2}px`:''" v-if="activity._swIndex == 1">{{activity.range}}</span>
              <span class="timeFrame" :style="activity._xwIndex == 1? `top:${activity._xw*56/2}px`:''" v-if="activity._xwIndex == 1">{{activity.range}}</span>
              <span class="timeFrame" :style="activity._yjIndex == 1? `top:${activity._yj*56/2}px`:''" v-if="activity._yjIndex == 1">{{activity.range}}</span>
                <!-- <span class="edit"><i class="el-icon-edit-outline activity-edit" v-show="seen&&index==current" :class="activityColor"></i></span> -->
              <!-- </div> -->
              <!-- <el-popover
                v-if="activityItem.id == activity.id"
                placement="top"
                width="60"
                v-model="visible">
                <p>确定完成吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click.stop="visible = false">取消</el-button>
                  <el-button type="primary" size="mini" @click.stop='popoverClick(activity.id)'>确定</el-button>
                </div>
              </el-popover> -->
            </el-timeline-item>
            <!-- </el-tooltip> -->
          </el-timeline>
          <div class="text" v-else>
            暂无记录
          </div>
        </div>
      </div>
    </div>
    <!-- 交接班弹窗 -->
        <dialog-form @success="submitSuccess" title="交接班" :visible.sync="visibleDialogFormItem" :getPayload="()=>formItem" :confirmDisabled="!formItem.content||!formItem.title||!formItem.time" remote="requestIntegratedHoneHistoryAdd" v-if="formItem">
        <!-- <template v-slot:default="{ form }"> -->
        <template>
            <el-form-item label="交接类型" label-width="120px">
                <el-select v-model="formItem.title" placeholder="请选择">
                    <el-option label="交班" value="交班"></el-option>
                    <el-option label="临时待办事项" value="临时待办事项"></el-option>
                    <el-option label="应急响应" value="应急响应"></el-option>
                    <el-option label="重大活动" value="重大活动"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="交接时间" label-width="120px">
                <el-date-picker
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  v-model="formItem.time"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="交接内容" label-width="120px">
                <el-input v-model="formItem.content" autocomplete="off" type="textarea"></el-input>
            </el-form-item>
        </template>
    </dialog-form>
    <!-- 临时任务新增 -->
        <dialog-form @success="submitSuccess" title="临时任务" :visible.sync="visibleDialogFormLeftTree" :getPayload="()=>formLeftTree" :confirmDisabled="!formLeftTree.name" remote="requestDialogFormDutySchedulingItemInput" v-if="formLeftTree">
        <template>
            <el-dialog class="popover-box" :modal='false' :visible.sync="visibleTask">
                <el-popover
                placement="top-start"
                width="400"
                v-model="visibleTask"
                trigger="click">
                    <el-tree show-checkbox node-key="id" ref="tree" :check-strictly="true" :data="treeDataList" :props="defaultProps" @check="setSelectedNode" @node-click="handleNodeClickPop"></el-tree>
                </el-popover>
            </el-dialog>
            <el-form-item label="任务来源" label-width="120px">
                <el-select v-model="formLeftTree.source" placeholder="请选择">
                    <el-option label="岗位" value="0"></el-option>
                    <el-option label="个人" value="1"></el-option>
                    <el-option label="临时派发" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="岗位选择" label-width="120px">
                <el-select v-model="formLeftTree.jobId" placeholder="请选择">
                    <el-option v-for="item in postList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="任务名称" label-width="120px">
                <el-input v-model="formLeftTree.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="任务说明" label-width="120px">
                <el-input v-model="formLeftTree.remark" autocomplete="off"></el-input>
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
                <c-switch v-model="formLeftTree.remind"></c-switch>
            </el-form-item>
            <el-form-item label="是否为产品" label-width="120px">
                <c-switch v-model="formLeftTree.product"></c-switch>
            </el-form-item>
            <el-form-item label="产品选择" label-width="120px" v-if="formLeftTree.product">
               <el-input v-model="formLeftTree.productInfoName" @click.native="inputEvent(formLeftTree)" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="是否完成" label-width="120px">
                <c-switch v-model="formLeftTree.finish"></c-switch>
            </el-form-item>
        </template>
    </dialog-form>
    <!-- 值班表弹窗 -->
    <div class="duty-table-pop" v-show="dutyTablePop" ref="textPop">
       <el-table :data="popDutyList" border style="width: 100%" :show-header="false">
          <el-table-column prop="jobName" label=""  align="center"></el-table-column>
          <el-table-column prop="userName" label="" align="center"></el-table-column>
        </el-table>
    </div>
  </div>
</template>

<script>
import {
requestIntegratedHoneDutyList,
requestIntegratedHoneDutyTaskList,
requestIntegratedHoneHistoryList,
requestIntegratedHoneOption,
requestIntegratedHoneWeeks,
requestProductTaskList,
requestProductDoFinish,
requestPostList,
requestProductInfoTpyeTreeList,
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
        current:0,
        seen:false,
        activityColor:null,
        visible:null,
        userJob:null,
        formLeftTree:{
          startTime:'',
          endTime:''
        },
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        formItemTimeRange: [],
        treeDataList:null,
        postList:null,
        visibleTask: false,
        formItem:{},
        activityItem:{
          productInfoId:null,
          name:null
        },
        presentMonth:'',//当前月
        loginInfo:null,
        paramObj:{
          dutyMonth:null
        },
        popDutyList:null,
        tableData: [],
        dutyList:[
          {
            icon:"gangweiguanli",
            text:"岗位管理",
            color:"#5CAAE6",
            url:"/integrated-management/duty-management/post"
          },
          // {
          //   icon:"jiaoseguanli",
          //   text:"人员管理",
          //   color:"#7085E0",
          //   url:"/integrated-management/duty-management/personnel"
          // },
          {
            icon:"paibanguanli",
            text:"排班管理",
            color:"#4DBFB5",
            url:"/integrated-management/duty-management/scheduling"
          },
          {
            icon:"lishijiaojieban",
            text:"历史交接班",
            color:"#F5B562",
            url:"/integrated-management/duty-management/history"
          }
        ],
        process:[
          {
            icon:"renwupeizhi",
            text:"任务配置",
            color:"#50A5E6",
            url:"/integrated-management/duty-process/post",
          },
          {
            icon:"liuchengtixinghejiankong",
            text:"流程提醒和监控",
            color:"#F5B562",
            url:"/integrated-management/duty-process/scheduling",
          }
        ],
        task:[
          {
            icon:"yingjixiangying",
            text:"应急响应",
            color:"#F58462",
            url:"",
          },
          {
            icon:"zhongdahuodong",
            text:"重大活动",
            color:"#7085E0",
            url:"",
          },
          {
            icon:"linshidaibanshixiang",
            text:"临时待办事项",
            color:"#4DBFB5",
            url:"",
          }
        ],
        remains:[
          {
            icon:"gongzuoliuhen",
            text:"工作留痕",
            color:"#5CAAE6",
            url:"",
          }
        ],
        activities: [
        //   {
        //   content: '短时临近预报修改',
        //   timestamp: '2018-04-12 20:46',
        //   size: 'large',
        //   type: 'primary',
        //   icon: 'el-icon-check',
        //   color:"#409EFF"
        //   }, {
        //     content: '周边城市预报',
        //     timestamp: '2018-04-03 20:46',
        //     color: '#67C241',
        //     icon:"el-icon-bell"
        //   }, {
        //     content: '周边城市报文',
        //     timestamp: '2018-04-03 20:46',
        //     size: 'large'
        //   }, {
        //     content: '城市预报气象网',
        //     timestamp: '2018-04-03 20:46'
        //   }, {
        //     content: '周边城市报文',
        //     timestamp: '2018-04-03 20:46',
        //     size: 'large'
        //   }, {
        //     content: '城市预报气象网',
        //     timestamp: '2018-04-03 20:46'
        //   }, {
        //     content: '周边城市报文',
        //     timestamp: '2018-04-03 20:46',
        //     size: 'large'
        //   }, {
        //     content: '查看智能网格预报业务平台',
        //     timestamp: '2018-04-03 20:46'
        // }
        ],
        recordPop:false,
        dutyTablePop:false,
        scrollTop:"",
        valueDate: new Date(),
        calendarData: [],
        stepList:[],
        optionsType: [],
        optionsValue: '',
        optionsTypeValue:null,
        activeName:null,
      }
    },
    watch:{
      'formItem.product'(val){
            if(!val){
                this.formItem.productInfoName = null
                this.formItem.productInfoId = null
            }
        },
      formItemTimeRange(val) {
            if(!val.length > 0) return
            this.formLeftTree.startTime = val && val[0];
            this.formLeftTree.endTime = val && val[1];
        },
      optionsValue(vla){
        requestIntegratedHoneWeeks({jobId:vla}).then(res => {
          this.stepList = res.data
        })
      },
      optionsTypeValue(vla) {
      console.log(vla);
      // 发布流程信息
      requestProductTaskList({ userId: this.loginInfo.id, jobId: vla.id }).then(
        res => {
          this.substep(res)
        }
      );
    },
    },
    methods: {
    //刷新分步导航
    async substep(res){
      let finishIcon
      let finishColor
      let finishType
      let finishSize
      if(!res.data || !Array.isArray(res.data) ){}
      this.activities = res.data
      this.activities.forEach(i=>{
      //状态：0 未完成；1 完成；2 进行中
        if (i.state == '未制作') {
          finishIcon = "el-icon-bell";
          finishColor = "#eee";
          finishType = "primary";
          finishSize = "large";
        } else if (i.state == '可制作') {
          finishIcon = "el-icon-edit";
          finishColor = "#409EFF";
          finishType = "";
          finishSize = "";
        } else if (i.state == '已发布') {
        finishIcon = "el-icon-check";
        finishColor = "#67C241";
        finishType = "";
        finishSize = "";
        } else if (i.state == '已过期') {
        finishIcon = 'el-icon-circle-close'
        finishColor = 'red'
        finishType = ''
        finishSize = 'large'
        }
        var range = Number(i.stime.split(':').join(''));
        if(range <= 800 && range >= 0){i.range = "早晨"}
        else if(range <= 1200 && range >= 801){i.range = "上午"}
        else if(range <= 1800 && range >= 1201){i.range = "下午"}
        else if(range <= 2359 && range >= 1801){i.range = "夜间"}
        i.content=i.name,
        i.timestamp=i.stime+'-'+i.etime,
        i.size=finishSize,
        i.type=finishType,
        i.icon=finishIcon,
        i.color=finishColor
      })
      let _zc = 0,_sw = 0,_xw = 0,_yj = 0
        this.activities.forEach(element => {
          element.range === "早晨"? _zc = _zc + 1 : _zc = _zc + 0;
          if(_zc == 1 && element.range === "早晨"){element._zcIndex = 1} 
          element.range === "上午"? _sw = _sw + 1 : _sw = _sw + 0;
          if(_sw == 1 && element.range === "上午"){element._swIndex = 1} 
          element.range === "下午"? _xw = _xw + 1 : _xw = _xw + 0;
          if(_xw == 1 && element.range === "下午"){element._xwIndex = 1} 
          element.range === "夜间"? _yj = _yj + 1 : _yj = _yj + 0;
          if(_yj == 1 && element.range === "夜间"){element._yjIndex = 1} 
        });
        this.activities.forEach(element => {
          element._zc = _zc
          element._sw = _sw
          element._xw = _xw
          element._yj = _yj
        });
    },
    

      mouseOver(index){
        this.seen = true;
        this.current = index;
      },
      mouseLeave(){
        // this.activityColor = 'activityColor-black'
        this.seen = false;
        this.current = null;
      },
      getFormItemByInputItem(item){
        return {
              // title:item? item.text : null,
              title:'交班',
              orgId:this.loginInfo.orgId,
              createUser:this.loginInfo.id,
            }
      },
      setSelectedNode(data){
          console.log(data)
          this.$refs.tree.setCheckedNodes([data])
          this.formLeftTree.productInfoId = data.id
          this.formLeftTree.productInfoName = data.label
          this.formLeftTree.product_attr = data.treeType == 'product' ? 'info':'type'
      },
      handleNodeClickPop(data) {
                this.$refs.tree.setCheckedNodes([data])
                this.formLeftTree.productInfoId = data.id
                this.formLeftTree.productInfoName = data.label
                this.formLeftTree.product_attr = data.treeType == 'product' ? 'info':'type'
        },
      addJobs(){
        this.formItemTimeRange = ['20:00','22:00']
        this.visibleDialogFormLeftTree = true;
      },
      inputEvent(){
            this.visibleTask = !this.visibleTask
      },
      requestData(){
        requestPostList({orgId:this.loginInfo.orgId,pageIndex:'1',pageSize:'20'}).then(res =>{
            this.postList = res.data.list
        })
        requestProductInfoTpyeTreeList().then(res =>{
          this.treeDataList = res.data.list;
        })
      },
      timelineClick(data){ 
      // window.open("http://www.baidu.com", '_blank');
        if(data.productInfoId == null){
          this.$message.warning("非产品，不在系统内制作")
          return
        }
          this.$router.push({path:'/product-made/product-make/product-make-images',query: {data:data,optionsTypeValue:this.optionsTypeValue}})
      },
    timelineEvent(data){
      console.log(data)
      // if(data.productInfoId == null){
      //     this.$message.warning("非产品，不在系统内制作")
      //     return
      //   }
        this.activityItem = data
        this.visible = true
    },
    popoverClick(id){
        this.visible = false
        requestProductDoFinish({id}).then(res=>{
           // 发布流程信息
          requestProductTaskList({ userId: this.loginInfo.id, jobId: this.optionsTypeValue.id }).then(
            res => {
              this.substep(res)
            }
          );
        })
    },
      handleClick(tab, event){
        console.log(tab, event);
        requestIntegratedHoneWeeks({jobId:tab.$vnode.key}).then(res => {
          this.stepList = res.data
        })
      },
        submitSuccess(res){
            // this.treeDataList = []
            // this.onConfirmUpdate()
            // this.requestData()
            requestIntegratedHoneHistoryList({orgId:this.loginInfo.orgId}).then(res => {
              this.tableData = res.data.list
            })
        },
      linkClick(i){
        if(i.text == '工作留痕'){
          this.$message.warning("正在开发中")
        }
        if(i.text == '应急响应'){
          this.inputItem(i)
        }
        if(i.text == '重大活动'){
          this.inputItem(i)
        }
        if(i.text == '临时待办事项'){
          this.inputItem(i)
        }
      },
      dutyTablePopEvl(){
        // setTimeout(() => {
        //   //  this.dutyTablePop=!this.dutyTablePop 
        //    this.dutyTablePop=false
        //    alert('2')
        // }, 1000);
           this.dutyTablePop=false
      },
      allcalendar(day,e) {
        // console.log('day:',day)
        let vm = this;
        vm.popDutyList = []
        vm.calendarData.forEach(i=>{
          if(i.month+'-'+i.date == day.substring(5)){
            // console.log(i.dutyList)
            vm.popDutyList = i.dutyList
          }else{
            // vm.popDutyList = []
          }
        })
        this.dutyTablePop = true
        this.$refs.textPop.style.left = e.clientX + 50 + "px";
        this.$refs.textPop.style.top = e.clientY + -80 + "px";
      },
      handleScroll(e) {
        //监听滚动的距离
        this.scrollTop = e.target.scrollTop;
      },
    },
    mounted(){
      let vm = this;
       vm.loginInfo = JSON.parse(localStorage.getItem('loginInfo',))
       vm.userJob = JSON.parse(localStorage.getItem('userJob'))
      this.requestData()
      this.$nextTick(() => {
          // 点击前一个月
          let prevBtn = document.querySelector(
              '.el-calendar__button-group .el-button-group>button:nth-child(1)');
          prevBtn.addEventListener('click', () => {
            function addo(n){
              if(n < 10) {
              return '0' + n;  
              }else{
              return n;
              }
            }
            if(this.presentMonth == 1){
              this.presentMonth = 12
            }else{
              this.presentMonth --
            }
            this.presentMonth = addo(this.presentMonth)
            console.log(this.valueDate.getFullYear())
            requestIntegratedHoneDutyList({orgId:vm.loginInfo.orgId,dutyMonth:this.valueDate.getFullYear()+'-'+this.presentMonth}).then(res => {
              this.calendarData = res.data
            })
          })
      })

      this.$nextTick(() => {
          // 点击今天
          let prevBtn = document.querySelector(
              '.el-calendar__button-group .el-button-group>button:nth-child(2)');
          prevBtn.addEventListener('click', () => {
            requestIntegratedHoneDutyList({orgId:vm.loginInfo.orgId}).then(res => {
              // this.presentMonth = res.data[0].month
              this.calendarData = res.data
            })
              // console.log(res.data[0].month);
              // console.log(this.valueDate.getMonth());
          })
      })

      this.$nextTick(() => {
          // 点击后一个月
          let prevBtn = document.querySelector(
              '.el-calendar__button-group .el-button-group>button:last-child');
          prevBtn.addEventListener('click', () => {
            function addo(n){
              if(n < 10) {
              return '0' + n;  
              }else{
              return n;
              }
            }
            if(this.presentMonth == 12){
              this.presentMonth = 1
            }else{
              this.presentMonth ++
            }
            this.presentMonth = addo(this.presentMonth)
            requestIntegratedHoneDutyList({orgId:vm.loginInfo.orgId,dutyMonth:this.valueDate.getFullYear()+'-'+this.presentMonth}).then(res => {
              this.calendarData = res.data
            })
          })
      })

      // 首页 值班表
      requestIntegratedHoneDutyList({orgId:vm.loginInfo.orgId}).then(res => {
        this.calendarData = res.data
        this.presentMonth = res.data[0].month
      })
      // 首页 值班流程信息
      requestIntegratedHoneDutyTaskList({userId:vm.loginInfo.id,dutyMonth:vm.paramObj.dutyMonth}).then(res => {
        let finishIcon
        let finishColor
        let finishType
        let finishSize
        if(!res.data || !Array.isArray(res.data) ){return}
        this.activities = res.data
        this.activities.forEach(i=>{
        //状态：0 未完成；1 完成；2 进行中
        if(i.finish == 1){ 
          finishIcon = 'el-icon-check'
          finishColor = '#409EFF'
          finishType = 'primary'
          finishSize = 'large'
        }else if(i.finish == 2){
          finishIcon = 'el-icon-bell'
          finishColor = '#67C241'
          finishType = ''
          finishSize = ''
        }else if(i.finish == 0){
          finishIcon = 'el-icon-bell'
          finishColor = ''
          finishType = ''
          finishSize = 'large'
        }
          i.content=i.name,
          i.timestamp=i.stime+'-'+i.etime,
          i.size=finishSize,
          i.type=finishType,
          i.icon=finishIcon,
          i.color=finishColor
        })
        console.log(res)
      })
      // 历史交接班任务列表 历史交接班展示-只查看当天的交接班信息
      requestIntegratedHoneHistoryList({orgId:vm.loginInfo.orgId}).then(res => {
        this.tableData = res.data.list
      })
      //获取岗位列表
      requestIntegratedHoneOption({orgId:this.loginInfo.orgId,isUse:'1'}).then(res => {
        this.optionsType = res.data.list
        if(this.userJob == null){
          this.activeName = res.data.list[0].id
            requestIntegratedHoneWeeks({jobId:res.data.list[0].id}).then(res => {
              this.stepList = res.data
            })
          this.optionsTypeValue = res.data.list[0]
          return
        }

        if(this.userJob.length == 0){
          this.activeName = res.data.list[0].id
            requestIntegratedHoneWeeks({jobId:res.data.list[0].id}).then(res => {
              this.stepList = res.data
            })
          this.optionsTypeValue = res.data.list[0]
          return
        }else if(this.userJob.length > 0){
            res.data.list.forEach(item =>{
            if(item.id==this.userJob[0].id){
                this.optionsTypeValue = item
              }
            })
            this.activeName = this.userJob[0].id
            requestIntegratedHoneWeeks({jobId:this.optionsType[0].id}).then(res => {
              this.stepList = res.data
            })
        }
      })
      // window.addEventListener("scroll", this.handleScroll, true);
    }
  }
</script>

<style lang='postcss' scoped>
a{
  text-decoration: none;
}
.br-dot{
  background: rgb(33, 194, 33) !important;
}
.activity-edit{color: #409eff;}
.management-home-page{
  height: 100%;
  .wrap-box{
    display: flex;
    justify-content: space-between;
    background: #F6F6F6;
    height: calc(100% - 40px);
    padding:20px 15px 0 15px;
    .left-box{
      flex: 1;
      position: relative;
      .left-top-box{
        display: flex;
        margin-bottom:15px;
        height: calc(100% - 283px);
        .shifting-duty-wrap-box{
          flex: 1;
          margin-right: 15px;
          background: #fff;
          height: calc(100%-44px);
          padding: 22px 21px;
          .step-box{
            margin-top: 30px;
            display: flex;
            .left-date {
              width: calc(100% - 82px);
              display: block;
              text-align: center;
              
            }
            .step-big-box{
              flex: 1;
              margin-top: 10px;
            }
            .right-icon{
              /* margin-left: 20px; */
              margin-top:30px;
              width: 62px;
              height: 62px;
              border-radius: 50%;
              background: #409EFF;
              color: #fff;
              text-align: center;
              cursor: pointer;
              .jiaoban{
                font-size: 32px;
              }
              .jiaoban-text{
                font-size: 14px;
              }
            }
            .step-warp {
                display: inline-block;
                width: 12%;
              .name {
                font-size: 14px;
              }
              .br {
                height: 2px;
                background: rgb(170, 170, 170);
                /* margin:0 3px; */
                position: relative;
                margin: 8px 0;
                .dot{
                  background: rgb(170, 170, 170);;
                  position: absolute;
                  width: 10px;
                  height: 10px;
                  border-radius: 15px;
                  left: calc(50% - 4px);
                  top: calc(50% - 4px);
                }
              }
              .date {
                font-size: 14px;
                margin: 4px 0;
              }
              .week {
                font-size: 15px;
                margin: 4px 0 14px 0;
                font-weight: 600;
              }
            }
          }
          .table-box{
            height: calc(100%-210px);
            margin-top: 0px;
            .table-title{
              height: 20px;
              font-size:16px;
              font-family:Microsoft YaHei;
              font-weight:300;
              color:rgba(72,72,72,1);
              text-align: center;
              margin-bottom:10px;
            }
            .el-table{height: calc(100%-30px)!important;}
            .cell-box{
              display: flex;
              justify-content: space-between;
              .text{
                font-size: 14px;
                flex: 1;
                margin-right: 10px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                display: inline-block;
                height: 25px;
              }

            }
          }
        }
        .duty-roster-wrap-box{
          flex: 1;
          background: #fff;
          height: calc(100%-44px);
          padding: 22px 21px;
          overflow: hidden;
          .item{
            font-size:14px;
            color:#606266;
            /* margin-top:45px; */
          }
         .name-style {
            position: relative !important;
            top: -30px !important;
         }
         .calendar-text {
           font-size: 12px;
           color: #606266;
           font-weight: 500;
          white-space: nowrap;
          cursor: pointer;
         }
        }
      }
      .left-bottom-box{
        width: calc(100% - 42px);
        display: block;
        position: absolute;
        left: 0;
        bottom: 0;
        height: 246px;
        background: #fff;
        padding: 22px 21px 0 21px;
        .border-box{
          padding: 0;
          margin:0;
          border: 1px solid #ddd;
          border-radius:4px;
          margin-top:15px;
          display: flex;
          justify-content: space-between;
          li{
            list-style: none;
            width: 25%;
            border-right: 1px solid #ddd;
            .title-text{
              height: 60px;
              line-height: 60px;
              border-bottom: 1px solid #ddd;
              text-align: center;
            }
            .item-list{
              display: flex;
              flex-wrap: wrap;
              padding: 22px 15px 0px 15px;
              .icon-box{
                width: 33.3%;
                text-align: center;
                .iconfont{
                  font-size: 32px;
                }
                .icon-text{
                  font-size:14px;
                  font-family:Microsoft YaHei;
                  font-weight:400;
                  color:rgba(144,147,153,1);
                  margin-top:10px;
                }
              }
              .icon-box:nth-child(3n){
                margin-bottom:40px;
              }
            }
          }
          li:last-child{
            border-right: none;
          }
        }
      }
    }
    .right-box{
      width: 280px;
      height: 100%;
      background: #fff;
      margin-left: 15px;
      .block{
        height: calc(100%-106px);
        .el-timeline {
          height: 100%;
          overflow-x: hidden;
          overflow-y: scroll;
          padding: 0;
        }
        .el-timeline::-webkit-scrollbar { 
          /* display: none; */
          }
        .text {
          text-align: center;
          padding: 20px;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #909399;
          cursor: pointer;
        }
      }
    }
  }
  .title-text-box{
    display: flex;
    height: 20px;
    line-height: 20px;
    justify-content: space-between;
    .bold-text{
      font-size:18px;
      font-family:Microsoft YaHei;
      font-weight:bold;
      color:rgba(72,72,72,1);
    }
    .small-text{
      font-size:14px;
      font-family:Microsoft YaHei;
      font-weight:400;
      color:rgba(144,147,153,1);
      cursor: pointer;
    }
  }
  .monitoring-title-box{
    padding:20px 13px 20px 21px;
    border: 1px solid #EBEEF5;
    border-bottom: 0px;
    margin-bottom:0px;
    height: 30px;
  }
  .color-F46D6A{
    border-color:#F46D6A!important;
    color: #F46D6A!important; 
    padding: 5px 10px;
  }
  .color-E6A23D{
    border-color:#E6A23D!important;
    color: #E6A23D!important; 
    padding: 5px 10px;
  }
  .duty-table-pop{
    position: absolute;
    z-index: 2;
    background: #fff;
    width: 240px;
    border:1px solid rgba(64, 158, 255, 1); 
    padding: 30px 20px;
  }
}

</style>
<style lang='postcss'>
  .management-home-page{
    .duty-roster-wrap-box{
      .el-calendar{
        height: 100%;
        .el-calendar__header{
          height: 28px;
        }
        .el-calendar__body {
          padding: 0px 0px;
          height: calc(100% - 53px);
            .el-calendar-table{
              height: 100%;
              display: block;
              thead{
                height: 42px;
                width:100%;
                display:inline-block;
                th{
                  display:inline-block;
                  width:calc(100% / 7)
                }
              }
              tbody{
                width: 100%;
                height: calc(100% - 42px);
                overflow:auto;
                display: block;
                tr{
                  height: calc(100% / 6);
                  width:100%;
                  display: inline-block;
                  td{
                    width: calc((100% - 8px) / 7 );
                    height: 100%;
                    display: inline-block;
                  }
                }
              }
          }
        }
      }
    }

    .right-box {
      .el-timeline-item__wrapper {
        top: 0px !important;
        left: 20px;
        padding-right:20px;
      }
        .el-radio-button{
          width: 25%;
          .el-radio-button__inner {
            width: 100%;
            border-radius:0;
          }
        }
        .el-radio-group{
          height: 30px;
          padding-bottom:5px ;
          margin-bottom:0!important;
          width: 100%;
          .el-radio-button {
            height: 30px;
          }
        }
        .el-timeline-item {
          .el-timeline-item__wrapper {
            .timeFrame{
              position: absolute;
              color: red;
              z-index: 1;
              left: -30px;
            }
            .timeline-event{
              z-index: 9;
              width: 25px !important;
              height: 25px !important;
              position: absolute;
              top: 0px;
              left: -5px;
            }
          }
          .el-timeline-item__timestamp{

          }
        }
        .el-timeline-item-red{
          padding-left: 20px;
          background-color:hsl(0, 100%, 94%);
        }
        .el-timeline-item-green{
          padding-left: 20px;
          background-color:#dcf7d0;
        }
        .el-timeline-item-blue{
          padding-left: 20px;
          background-color:#d4eaff;
        }
        .el-timeline-item-yellow{
          padding-left: 20px;
          background-color:#f9fac4;
        }
    }
    .el-step__icon{
      width: 10px;
      height: 10px;
      background: #ddd;
      border-color: #ddd;
    }
    .el-step__icon-inner{
      color: #ddd;
    }
    .el-step__description{
      position: relative;
      top: -55px;
    }
    .el-step__head.is-success{
      color: #ddd;
      border-color: #ddd;
    }
    .el-step__title {
      line-height: 18px;
      font-size: 14px;
    }
    .el-step__title.is-success {
      color: #ddd;
    }
    .el-step__title.is-process,.el-step__description.is-process{
       color: #67C241;
    }
    .is-process .el-step__icon{
      background: #67C241;
      border-color: #67C241;
    }
    .is-process .el-step__icon-inner{
      color: #67C241;
    }
    .el-step__description.is-success{
      color: #606266;
    }
    .el-timeline-item__tail {
      left: 50px;
    }
    .el-timeline-item__node {
      left: 44px;
    }
    .el-timeline-item__node--large {
      /* width: 20px;
      height: 20px; */
    }
    .el-timeline-item__node--normal {
      left: -4px;
      width: 20px;
      height: 20px;
    }
    .el-calendar-table .el-calendar-day{
      display:flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 0px;
    }
    .el-calendar-table .el-calendar-day p{
      margin: 0;
      padding:0;
      font-size: 18px;
      display: inline-block;
      /* height: 100%; */
      /* width: 100%; */
      text-align: center;
    }
    .el-calendar-table td.is-today {
      color: #606266;
      background: #F5F7FA;
    }
    .el-timeline-item{
      margin-left: 0;
    }
    .el-timeline-item__timestamp {
      position: relative;
      left: 0;
      top: 0px;
    }
    .shifting-duty-wrap-box .step-box {
      height: 160px;
       .left-date {
         .el-tabs__item{
           height: 30px !important;
         }
         .el-tabs__content {
            margin-top: 30px !important;
          }
          .el-tabs__nav-wrap {
            height: auto !important;
          }
          .el-tabs--left {
            height: 160px!important;
          }
       }
    }
  }
</style>