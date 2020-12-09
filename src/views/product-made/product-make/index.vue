<template>
  <div class="product-made-home product-made-make">
<!-- 宽mainWidth：{{mainWidth}}，中isDirection：{{isDirection}}，导isEditAlive：{{isEditAlive}}，右isRight：{{isRight}}，右刷isEditAlive：{{isEditAlive}}，中刷isRouterAlive：{{isRouterAlive}}， -->
    <!-- {{tabsList}} -->
    <!-- {{leftData}} -->
    <div class="wrap-box">
      <div class="left-box" v-if="isNav">
        <div class="hidden-nav" @click="hiddenNav()">
            <i class="el-icon-d-arrow-left"></i>
        </div>
        <el-tabs v-model="navTab" slot="border-card" type="border-card" class="product-tab-tree">
          <el-tab-pane label="制作流程" name="制作流程">
            <el-radio-group
              class="button-tab"
              v-model="optionsValue"
              size="mini"
              style="margin-bottom: 20px;"
            >
              <el-radio-button
                v-for="item in optionsType"
                :key="item.id"
                :label="item"
              >{{item.name}}</el-radio-button>
            </el-radio-group>
            <el-timeline v-if="activities.length > 0">
              <el-timeline-item
                v-for="(activity, index) in activities"
                style='cursor:pointer'
                :key="index"
                :icon="activity.icon"
                :type="activity.type"
                :color="activity.color"
                :size="activity.size"
                :timestamp="activity.timestamp"
                @click.native="timelineClick(activity)"
                :class="activity.range=='早晨'? 'el-timeline-item-red':'' || activity.range=='上午'? 'el-timeline-item-green':'' || activity.range=='下午'? 'el-timeline-item-blue':'' || activity.range=='夜间'? 'el-timeline-item-yellow':''"
              >
              {{activity.content}}
              <span class="timeFrame" :style="activity._zcIndex == 1? `top:${activity._zc*56/2}px`:''" v-if="activity._zcIndex == 1">{{activity.range}}</span>
              <span class="timeFrame" :style="activity._swIndex == 1? `top:${activity._sw*56/2}px`:''" v-if="activity._swIndex == 1">{{activity.range}}</span>
              <span class="timeFrame" :style="activity._xwIndex == 1? `top:${activity._xw*56/2}px`:''" v-if="activity._xwIndex == 1">{{activity.range}}</span>
              <span class="timeFrame" :style="activity._yjIndex == 1? `top:${activity._yj*56/2}px`:''" v-if="activity._yjIndex == 1">{{activity.range}}</span>
              <div class="timeline-event" @click.stop="timelineEvent(activity)"></div>
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
            </el-timeline>
            <div class="text" v-else>
              暂无记录
            </div>
          </el-tab-pane>
          <el-tab-pane label="产品导航" name="产品导航">
            <common-left-tree
              @success="submitSuccess"
              :isHeader="false"
              title="产品导航"
              :data="treeData"
              @click-item="onTreeClickItem"
              :defaultExpandAll="false"
              :searchText="searchText"
            >
              <div slot="head-search" class="head-search">
                <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchText"></el-input>
              </div>
              <!-- <div slot="append" class="">
              <div>
              <span class="title">分类操作：</span><common-left-tree-actions @success="submitSuccess" :lastItemClicked="lastItemClicked" @append="onTreeAppend" @edit="onTreeEdit" @delete="onTreeDelete('requestProductClassTreeDel')"></common-left-tree-actions>
              </div>
              <div>
              <span class="title">产品操作：</span><common-left-tree-actions @success="submitSuccess" :lastItemClicked="lastItemClicked" @append="onTreeAppendMinor" @edit="onTreeEditMinor" @delete="onTreeDeleteMinor('requestProductClassTreeDelMinor')"></common-left-tree-actions>
              </div>
              </div>-->
            </common-left-tree>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- <div class="left-box">
        <div class="top-title">
          <div class="text">产品导航</div>
        </div>
        <div class="content-box">
            <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchText"></el-input>
            <div class="tree-box">
              <el-tree ref="tree" :data="treeData" @node-click="handleNodeClick" default-expand-all :filter-node-method="filterNode"></el-tree>
            </div>
        </div>
        <div class="tool-box">
          <div class="line-interval"></div>
          <div class="classify-tool">
            <span class="title">分类操作</span>
            <div class="icon-box">
            </div>
          </div>
          <div class="classify-tool product-tool">
            <span class="title">产品操作</span>
            <div class="icon-box">
              <i class="iconfont bianji"></i>
              <i class="iconfont shanchu"></i>
            </div>
          </div>
        </div>
      </div>-->

      <div class="main">
        <!-- 中间路由 -->
        <div class="center-box item-wrap" ref="mainDom" v-if='isDirection' :style="isRight? ``:'width: calc(100% - 18px);'">
          <div class="nested" v-if="mainWidth" :style="mainWidth? `width:${mainWidth}px`:''">
          <div class="top-title no-border">
            <div class="text">{{topTitle || '参考资料'}}
              <!-- <span class="link" style="cursor:pointer" @click="inputItem()">显示编辑</span> -->
              </div>
            <!-- <el-button type="primary" size="small" @click="saveModule()">保存模板</el-button> -->
          </div>
          <!-- <div v-if="isIframe" class="iframe-content-box">
            <page-office :url="docPath" id="products"></page-office>
          </div>
          <div v-else class="content-box">
            <div class="weather-forecast-box">
              <div class="forecast-title">天气预报</div>
              <div class="line-thick"></div>
              <div class="line-thin"></div>
              <div class="forecast-text">
                <div v-for="(item,index) in forecastList" :key="index" class="item-list">{{item.text}}</div>
              </div>
            </div>
          </div>-->
          <template>
            <el-tabs v-model="tabsListValue" @tab-click="handleClick">
              <el-tab-pane
                v-for="(item, index) in tabsList"
                :key="index"
                :label="item.title"
                :item="item"
              >
              </el-tab-pane>
            </el-tabs>
            <router-view class="router-wrap" v-if="isRouterAlive" v-on:dialogEmit="dialogEmit" @emitPhraes='clickPhraes' :viewData='lastItemClicked'></router-view>
          </template>
          <div class="direction-icon-r" @click="directionRight()"  v-if="isRight">
          <i class="el-icon-arrow-left"></i>
          </div>
          </div>
        </div>

        <div class="direction-icon-edit" @click="directionRightEdit()" v-if="!isRight">
          <i class="el-icon-arrow-left"></i>
          </div>




        <!-- 右侧 -->
        <div class="right-box item-wrap" :class="isDirection? '':''" v-if="isRight">
          <div class="direction-icon-l" v-if='!isDirection' @click="directionLeft()">
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="top-title">
            <div class="text">产品制作</div> <span v-if="isDirection" @click="rightClose()" style="color: #409eff;font-size: 18px;cursor: pointer;"><i class="el-icon-d-arrow-right"></i></span>
          </div>

          <!-- 多个产品编辑 -->
          <template v-if="productTabList && isEditAlive">
            <el-tabs  :style="mainWidth? `width:${mainWidth}px`:''" v-model="productTabProductInfoId" @tab-click="handleTabClick" :type="productTabList? 'border-card':''" :class="isDirection? '':'el-tabs--border-card-max'">
              <el-tab-pane :label="item.name" :name="item.productInfoId" v-for="(item,index) in productTabList" :key="index">
                <div class="content-box" v-if="productTabList && isEditAlive">
                  <el-form ref="form" label-width="90px" size="small">
                          <div class="item-input">
                          <el-form-item label="制作时次">
                            <el-tag class="date-num" size="small" v-for="(makeItem,makeIndex) in item.makeTimes" :key="makeIndex" v-bind:class="{ 'activeThree1': makeItem.makeMode == 1? true:false,'activeThree2': makeItem.makeMode == 2? true:false,'activeThree3': makeItem.makeMode == 3? true:false,'activeThree4': makeItem.makeTime == productTabList[index].makeTime ? true:false, }" @click="channelDate(makeItem,item,index)">{{makeItem.makeTime}}</el-tag>
                          </el-form-item>
                        </div>
                        <div class="item-input">
                          <!-- <el-form-item label="制作期号">
                            <el-input
                              type="number"
                              v-model="productTabList[index].issue"
                              @click.native="handleInput"
                              placeholder="请输入期号"
                            ></el-input>
                          </el-form-item> -->

                        </div>
                  <div class="item-input">
                    <el-form-item label="数据来源">
                      <span class="title">{{productTabList[index].source? productTabList[index].source:"无"}}</span>
                    </el-form-item>
                    <el-form-item label="数据时间">
                      <span class="title">{{productTabList[index].dateTime}}</span>
                    </el-form-item>
                  </div>
                    <div class="change-single">
                          <el-form-item label="产品名称">
                            <el-input
                              size="mini"
                              class="file-name-input"
                              v-model="productTabList[index].fileName"
                              @click.native="handleInput"
                              placeholder="请输入名称"
                            ></el-input>
                          </el-form-item>


                            <!-- <el-checkbox class="select-time" v-model="productTabList[index].reserve" size="small" label="预约发布" border></el-checkbox>
                            <el-time-select
                              class="select-time"
                              style="width:100px;"
                              size="small"
                              :disabled="productTabList[index].reserve? false:true"
                              v-model="productTabList[index].reserveTime"
                              :picker-options="{start: '08:30',step: '00:15',end: '18:30'}"
                              placeholder="时间"
                            ></el-time-select> -->
                        <!-- <el-button type="success" size="mini" @click="onSave(productTabList[index],index,function(){})">保存</el-button>
                        <el-button type="primary" size="mini" @click="onConsult(productTabList[index],index,'fast')">快速发布</el-button>
                        <el-button type="primary" size="mini" @click="onConsult(productTabList[index],index,'')">发布</el-button> -->
                    </div>
                    <div class="edit-but">
                      <div class="time-box">
                        <el-form-item label="预约时间">
                          <el-date-picker
                            size="mini"
                            :popper-class="'currentDatePickerClass'"
                            format="yyyy-MM-dd HH:mm"
                            value-format="yyyy-MM-dd HH:mm"
                            v-model="productTabList[index].timingDate"
                            type="datetime"
                            placeholder="选择日期时间">
                          </el-date-picker>
                        </el-form-item>
                      </div>
                      <div class="buts">
                        <el-button type="success" size="mini" @click="getLasts(productTabList[index],index)">最新发布</el-button>
                        <el-button type="success" size="mini" @click="onSave(productTabList[index],index,function(){})">保存</el-button>
                        <el-button type="primary" size="mini" @click="onConsult(productTabList[index],index,'fast')">保存并快速发布</el-button>
                        <el-button type="primary" size="mini" @click="onConsult(productTabList[index],index,'')">保存并发布</el-button>
                       </div>
                      </div>
                    <div v-if="isIframe" class="iframe-content-box">
                      <page-office :url="docPath" ref="iframe" id="products"></page-office>
                    </div>
                    <div v-else class="form-txt items">
                      <el-input
                        id="mytextareas"
                        type="textarea"
                        @click.native="handleInput"
                        :rows="28"
                        placeholder="请输入内容"
                        v-model="productTabList[index].content"
                        show-word-limit
                        @input="suggestInput(productTabList[index])"
                      ></el-input>
                      <span class="words">{{productTabList[index].content? getSemiangleLength(productTabList[index].content,JSON.stringify(productTabList[index].wordtype)):'0'}}/{{productTabList[index].limitnumber? productTabList[index].limitnumber:'n'}}</span>
                    </div>
                  </el-form>
                </div>
              </el-tab-pane>
            </el-tabs>
          </template>

          <!-- //单个产品编辑 -->
          <div class="content-box edit-one" v-if="!productTabList">
            <el-form ref="form" label-width="90px" size="small">
                  <div class="item-input">
                    <el-form-item label="制作时次">
                      <el-tag class="date-num" size="small" v-for="(makeItem,index) in makeTimes" :key="index" v-bind:class="{ 'activeThree1': makeItem.makeMode == 1? true:false,'activeThree2': makeItem.makeMode == 2? true:false,'activeThree3': makeItem.makeMode == 3? true:false,'activeThree4': makeItem.makeTime == productMade.makeTime ? true:false, }" @click="channelDate(makeItem,false,false)">{{makeItem.makeTime}}</el-tag>
                    </el-form-item>
                  </div>
                  <div class="item-input">
                    <el-form-item label="数据来源">
                      <span class="title">{{productMade.source? productMade.source:"无"}}</span>
                    </el-form-item>
                    <el-form-item label="数据时间">
                      <span class="title">{{productMade.dateTime}}</span>
                    </el-form-item>
                  </div>
                  <div class="item-input form-item-input">
                    <!-- <el-form-item label="制作期号">
                      <el-input
                        type="number"
                        v-model="productMade.issue"
                        @click.native="handleInput"
                        placeholder="请输入期号"
                      ></el-input>
                    </el-form-item> -->
                    <el-form-item label="产品名称">
                      <el-input
                        class="file-name-input"
                        size="mini"
                        v-model="productMade.fileName"
                        @click.native="handleInput"
                        placeholder="请输入名称"
                      ></el-input>
                    </el-form-item>

                  </div>

                  <div class="edit-but">
                      <div class="time-box">
                        <el-form-item label="预约时间">
                          <el-date-picker
                            size="mini"
                            :popper-class="'currentDatePickerClass'"
                            format="yyyy-MM-dd HH:mm"
                            value-format="yyyy-MM-dd HH:mm"
                            v-model="productMade.timingDate"
                            type="datetime"
                            placeholder="选择日期时间">
                          </el-date-picker>
                        </el-form-item>
                      </div>
                      <div class="buts">
                        <el-button type="success" size="mini" @click="getLast(productMade,false,function(){})">最新发布</el-button>
                        <el-button type="success" size="mini" @click="onSave(productMade,false,function(){})">保存</el-button>
                        <el-button type="primary" size="mini" @click="onConsult(productMade,false,'fast')">保存并快速发布</el-button>
                        <el-button type="primary" size="mini" @click="onConsult(productMade,false,'')">保存并发布</el-button>
                      </div>
                  </div>
                      <!-- <el-checkbox class="select-time" v-model="productMade.reserve" size="small" label="预约发布" border></el-checkbox>
                      <el-time-select
                        class="select-time"
                        style="width:100px;"
                        size="small"
                        :disabled="productMade.reserve? false:true"
                        v-model="productMade.reserveTime"
                        :picker-options="{start: '08:30',step: '00:15',end: '18:30'}"
                        placeholder="时间"
                      ></el-time-select> -->

                  <!-- </el-row> -->
              <div v-if="isIframe" class="iframe-content-box">
                <page-office :url="docPath" ref="iframe" id="products"></page-office>
              </div>
              <div v-else class="form-txt">
                <div class="text-editor" v-if="inputs">
                  <el-row class="change-multiple">
                    <el-col :span="8">
                      <el-input
                        ref="formTxt"
                        id="mytextarea"
                        :focus="focusEvent()"
                        type="textarea"
                        @click.native="handleInput"
                        placeholder="请输入内容"
                        v-model="productMade.content"
                        show-word-limit
                        @input="suggestInput(productMade)"
                        @blur="onInputBlur"
                      ></el-input>
                    </el-col>
                    <el-col :span="8">
                      <el-input
                        ref="formTxt"
                        id="mytextarea"
                        :focus="focusEvent()"
                        type="textarea"
                        @click.native="handleInput"
                        v-model="tvText"
                        :disabled="true"
                        show-word-limit
                      ></el-input>
                    </el-col>
                    <el-col :span="8">
                      <el-input
                        ref="formTxt"
                        id="mytextarea"
                        :focus="focusEvent()"
                        type="textarea"
                        @click.native="handleInput"
                        v-model="cityData"
                        :disabled="true"
                        show-word-limit
                      ></el-input>
                    </el-col>
                  </el-row>
                </div>
                <div class="text-editor" v-else>
                    <el-input
                    ref="formTxt"
                    id="mytextarea"
                    :focus="focusEvent()"
                    type="textarea"
                    @click.native="handleInput"
                    placeholder="请输入内容"
                    v-model="productMade.content"
                    :show-word-limit="true"
                    @input="suggestInput(productMade)"
                  ></el-input>
                  <span class="words">{{productMade.content? getSemiangleLength(productMade.content,JSON.stringify(productMade.wordtype)):'0'}}/{{productMade.limitnumber? productMade.limitnumber:'n'}}</span>
                </div>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </div>

      <!-- 提示语编辑弹窗 -->
      <dialog-form
        @success="submitAlert"
        title="提示语编辑"
        :visible.sync="visibleDialogAlert"
        :getPayload="()=>formAlertSave()"
        :confirmDisabled="!this.alertTextarea"
        remote="requestProductMakeAlertPageSave"
        v-if="formAlert"
      >
        <template>
          <div class="consult">
            <el-row :gutter="10">
              <el-col :span="6">
                <div class="consult-left">
                  <div class="top">
                    <div class="select-all">编辑区域</div>
                  </div>
                  <div class="tree">
                    <el-input
                      type="textarea"
                      :rows="20"
                      placeholder="请输入内容"
                      v-model="alertTextarea"
                    ></el-input>
                  </div>
                </div>
              </el-col>
              <el-col :span="18">
                <div class="consult-right">
                  <div class="top">
                    <div class="select-all">历史修改记录</div>
                  </div>
                  <div class="consult-list">
                    <template>
                      <el-table :height="500" :data="alertList" style="width: 100%">
                        <el-table-column prop="updateDate" label="时间" width="180"></el-table-column>
                        <el-table-column prop="updateUser" label="修改人" width="180"></el-table-column>
                        <el-table-column prop="content" label="内容"></el-table-column>
                      </el-table>
                    </template>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </template>
      </dialog-form>


      <!-- 产品保存发布弹窗 -->
      <dialog-form
        @success="submitSuccess"
        title="发布产品"
        :visible.sync="visibleDialogConsult"
        :getPayload="()=>function3()"
        :confirmDisabled="false"
        v-if="formConsult"
      >
        <template>
          <el-tabs v-model="tabsListValue1" type="card" @tab-click>
            <el-tab-pane
              :key="item.id"
              v-for="(item, index) in tabsList1"
              :label="item.name"
              :name="item.channel"
            >
              <div class="consult">
                <el-row :gutter="10">
                  <el-col :span="18">
                    <div class="consult-right">
                      <div class="top">
                        <div class="select-all">发布内容</div>
                      </div>
                      <!-- {{formConsult}} -->
                      <div class="consult-list">
                        <!-- <el-input type="textarea" :rows="20" placeholder="请输入内容" v-model="formConsult['content'+item.channel]"></el-input> -->
                        <el-input
                          type="textarea"
                          :rows="20"
                          placeholder="请输入内容"
                          v-model="contentTabRoot[item.channel]"
                        ></el-input>
                        <!-- <template>
                          <el-table :data="tableData" style="width: 100%">
                            <el-table-column prop="name" label="素材名称" width="180"></el-table-column>
                            <el-table-column prop="material" label="素材编号" width="180"></el-table-column>
                            <el-table-column prop="type" label="素材类型"></el-table-column>
                            <el-table-column prop="num" label="显示顺序" width="100"></el-table-column>
                            <el-table-column fixed="right" label="操作" width="100">
                              <template slot-scope="scope">
                                <i class="el-icon-bottom"></i>
                                <i class="el-icon-top"></i>
                                <i class="el-icon-delete"></i>
                              </template>
                            </el-table-column>
                          </el-table>
                        </template>-->
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="consult-left">
                      <div class="top">
                        <div class="select-all">服务客户</div>
                      </div>
                      <div class="tree product-made-home-tree">
                        <el-tree
                          :data="item.children"
                          show-checkbox
                          node-key="id"
                          ref="treeUser"
                          highlight-current
                          :props="defaultProps"
                        ></el-tree>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
          </el-tabs>
        </template>
      </dialog-form>

      <dialog-form @success="submitSuccess" title="参考资料显示配置" :visible.sync="visibleDialogFormItem" :getPayload="()=>allocation()" remote="requestProductReferenceUpdate">
        <div>
          <c-transfer class="c-transfer" :leftData="leftData" :rightData="rightData" :titles="['未拥有', '已拥有']" @transfer="handleTransfer" @handleSort="handleSort">
          </c-transfer>
        </div>
      </dialog-form>
        <div class="direction-side" v-if="!isNav" @click="directionSide()">
          导航
        </div>


  </div>
</template>

<script>
import {
  requestProductClassTreeDel,
  requestProductClassTreeList,
  requestProductReferenceTabsList,
  requestProductInfoIds,
  requestProducInfos,
  requestProducInfo,
  requestProducTreleaseSave,
  requestProductUserList,
  requestProductInfoTpyeTreeList,
  requestProducTreleaseDoPublish,
  requestProducDoQuickPublish,
  requestIntegratedHoneOption,
  requestProductTaskList,
  requestProductCityData,
  requestProductMakeAlertPageList,
  requestProductTvTextByCode,
  requestProductDoFinish,
  requestProductReference,
  requestProductMakeHistoryList
} from "@/remote/";
import PageOffice from "@/components/page-office/";
import CTransfer from '@/components/c-transfer/index.vue'
import {
  common,
  witchCommonList,
  withCommonLeftTree
} from "../../mixins/index";
import { mapActions, mapGetters } from "vuex";
export default {
  mixins: [common, witchCommonList, withCommonLeftTree],
  components: {
    PageOffice,
    CTransfer,
  },
  data() {
    return {
      mainWidth:null,//中间宽度
      activityObj:null,
      isNav:true,
      leftData: [],
      rightData: [],
      activityItem:{
        productInfoId:null,
        name:null
      },
      visible: false,
      cityData:null,
      tvText:null,
      inputs:false,
      isRouterAlive:true,//刷新中间路由
      isEditAlive:true,//刷新右侧编辑
      saveProducId:null,
      navTab:'制作流程',
      routeObj:{},
      optionsTypeValue:null,
      // makeTimeData:null,//点击时段选中
      makeTimes:null,
      productTabList:null,
      productTabProductInfoId:null,
      isDirection:true,//展开
      isRight:true,//右侧
      valueDate: new Date(),
      optionsType: [],
      optionsValue: null,
      paramInfo: null,
      contentState: false,
      contentTabRoot: {},
      formConsult: {},
      loginInfo: null,
      userJob:null,
      alertTextarea: null,
      alertList: null,
      productMade: {},
      activities: [
        {
          content: "短时临近预报修改",
          timestamp: "2018-04-12 20:46",
          size: "large",
          type: "primary",
          icon: "el-icon-check",
          color: "#409EFF"
        },
        {
          content: "周边城市预报",
          timestamp: "2018-04-03 20:46",
          color: "#67C241",
          icon: "el-icon-bell"
        },
        {
          content: "周边城市报文",
          timestamp: "2018-04-03 20:46",
          size: "large"
        },
        {
          content: "城市预报气象网",
          timestamp: "2018-04-03 20:46"
        },
        {
          content: "周边城市报文",
          timestamp: "2018-04-03 20:46",
          size: "large"
        },
        {
          content: "城市预报气象网",
          timestamp: "2018-04-03 20:46"
        },
        {
          content: "周边城市报文",
          timestamp: "2018-04-03 20:46",
          size: "large"
        },
        {
          content: "查看智能网格预报业务平台",
          timestamp: "2018-04-03 20:46"
        }
      ],
      defaultProps: {
        children: "children",
        label: "name"
      },
      tabTree: [],
      menuData: [],
      userOrgId: null,
      visibleDialogFormItemClassify: false,
      visibleDialogFormItemProduct: false,
      visibleDialogEditTab:false,
      formItem: null,
      radioType: "word",
      checkList: ["值班记录", "每日预报产品"],
      isIframe: false,
      topTitle: "",
      docPath: "", // 文档的地址
      searchText: "",
      tabsListValue1: "邮件",
      tabsListValue: "0",
      tabsList: [], //已拥有的菜单
      editoAllMenu:[],//编辑菜单里的所有菜单
      notMenu:false,// false未配置菜单，turn已配置
      tabsList1: [],
      treeData: [],
      forecastList: [
        {
          text: "Weather_Content"
        },
        {
          text: "明天早晨最低气温：TaiZhou_MinTemp"
        },
        {
          text: "明天白天最高气温：TaiZhou_Max"
        },
        {
          text: "Weather_Content"
        },
        {
          text: "Weather_Content"
        }
      ],
      treeDataList: []
    };
  },
  computed: {
  classObject: function (data) {
    console.log(data)
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  },
  options(){
      return this.tabsList;
  }
},
  watch: {
    isDirection(){
      this.isRouterAlive = false;
      this.isEditAlive = false;
      this.$nextTick(() => {
        this.isEditAlive = true;
        this.mainWidth = this.$refs.mainDom.offsetWidth
        this.isRouterAlive = true;
      })
    },
    isNav(){
      this.isRouterAlive = false;
      this.isEditAlive = false;
      this.$nextTick(() => {
        this.isEditAlive = true;
        this.mainWidth = this.$refs.mainDom.offsetWidth
        this.isRouterAlive = true;
      })
    },
    isRight(){
      this.isRouterAlive = false;
      this.isEditAlive = false;
      setTimeout(() => {
        this.$nextTick(() => {
        this.isEditAlive = true;
        this.mainWidth = this.$refs.mainDom.offsetWidth
        this.isRouterAlive = true;
      })
      }, 300);
    },

    optionsValue(vla) {
      console.log(vla);
      // 发布流程信息
      requestProductTaskList({ userId: this.loginInfo.id, jobId: vla.id }).then(
        res => {
          this.substep(res)
        }
      );
    },
    treeDataList(val){
      if(this.optionsTypeValue != null){
          this.treeDataList.forEach(item=>{
            if(item.id === this.routeObj.productInfoId){
              console.log(item.label)
              this.lastItemClicked = item
            }
          })
          requestProducInfo({
          productInfoId: this.lastItemClicked.id,
          isReload: false
          }).then(res => {
            if(typeof(res.data)=="object"){
              this.productTabList = null;
              this.productMade = null;
              this.productMade = {
                ...res.data,
              }
              this.makeTimes = res.data.makeTimes
              // this.makeTimes.forEach(i=>{
              //   if(i.makeMode == 2){
                  // this.productMade.makeTime = i.makeTime
                // }
              // })
              this.productMade.makeTime = res.data.makeTime
              console.log(this.productMade);
            }
          });

      }
    },
    searchText(val) {
      this.$refs.tree.filter(val);
    },
    visibleDialogConsult(val) {
      if (!val) {
        this.formConsult = {};
      }
    },
    // "productMade.reserve": function(val) {
    //   if (!val) {
    //     this.productMade.reserveTime = null;
    //   } else {
    //     // this.productMade.reserveTime = this.lastItemClicked.reserveTime
    //   }
    // }
  },
  mounted() {
    this.requestData();

    this.mainWidth = this.$refs.mainDom.offsetWidth

      // 从综合管理首页进来
      if(this.$route.query.data){
        this.routeObj=this.$route.query.data
        this.optionsTypeValue=this.$route.query.optionsTypeValue
        this.navTab = '制作流程'
        console.log('routeObj:',this.routeObj)
      }
    // this.$router.replace({ name: "product-make-images" });
    // this.$router.replace({ name: this.tabsList[0].name});

    //获取 tab 类型数据
    requestIntegratedHoneOption({
      orgId: this.loginInfo.orgId,
      isUse: "1"
    }).then(res => {
      this.optionsType = res.data.list;
      //判断 用户userJob所在的岗位，设置tab岗位选中
      if(!this.userJob){
        this.optionsValue =this.optionsType[0]
      }
      if(!this.optionsTypeValue){ //不是从综合首页进来 执行
        if(!this.userJob){
          this.optionsValue = res.data.list[0]
        }else if(this.userJob.length == 0){
          this.optionsValue = res.data.list[0]
        }else if(this.userJob.length > 0){
          this.optionsValue = this.findFn(this.userJob[0],res.data.list)
          this.optionsValue = this.optionsValue||res.data.list[0]
        }
      }

      if(!this.optionsTypeValue) return //从综合首页进来 执行
      this.optionsType.forEach(item=>{
          if(item.id == this.optionsTypeValue.id){
            this.optionsValue = item
          }
        })
      console.log('optionsValue:',this.optionsValue)
    })
    // 发布流程信息
    requestProductTaskList({userId:this.loginInfo.id,name1:this.optionsValue,dutyMonth:this.paramObj.dutyMonth}).then(res => {
      this.substep(res)
    })

  },
  methods: {
    //数组对象过滤id
    findFn(contrastObj,arrs){
      return arrs.find((item)=>{
          return item.id == contrastObj.id
      })
    },
    //获取字符串长度  val:字符串   全角、半角  type为0时,汉字计算为2个字符
     getSemiangleLength(val,type) {
        var len = 0.0;
        if(type!='' && type==0){
            for (var i = 0; i < val.length; i++) {
              var a = val.charAt(i);
                if (a.match(/[^\x00-\xff]/ig) != null && type == '0') {
                  len += 2;
                }
                else {
                  len += 1;
                }
            }
        }else {
            len=val.length;
        }
        return len;
    },
    suggestInput(data) {
      console.log(data)
      // :maxlength='productMade.wordtype == 0 ? productMade.limitnumber * 2 : productMade.limitnumber'
      if (
        !this.lastItemClicked ||
        !this.productMade.fileName ||
        !this.productMade.issue ||
        !this.productMade.content
      ) {
        this.$message.error("选择产品，并填写完整信息!");
        return;
      }
      if(data.content.length > data.limitnumber ){
        this.$message({
          message: '已超字数',
          type: 'warning'
        });
      }
    },
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

    //穿梭框
    allocation(){
      let menu = []
      this.rightData.forEach(element => {
        menu.push(element.content)
      });
      return {reference:menu.toString()}
    },
    editTab(){
      this.visibleDialogEditTab = true
    },
        handleTransfer(type, data, callback) {
      if (type == 'left') {
        this.rightData = this.rightData.concat(this.leftData[data]);
      } else {
        this.leftData = this.leftData.concat(this.rightData[data])
      }
      this[type + 'Data'].splice(data, 1);
      callback(type);
    },
    handleSort(type, sortType, data, callback) {
      if (!sortType || sortType == 'right') {
        if (type == 'up') {
          this.rightData = this.swapItems(this.rightData, data[1], data[1] - 1)
          callback(sortType, [data[0], data[1] - 1]);
        } else {
          this.rightData = this.swapItems(this.rightData, data[1], data[1] + 1)
          callback(sortType, [data[0], data[1] + 1])
        }
      } else if (sortType == 'left') {
        if (type == 'up') {
          this.leftData = this.swapItems(this.leftData, data[0], data[0] - 1)
          callback(sortType, [data[0] - 1, data[1]]);
        } else {
          this.leftData = this.swapItems(this.leftData, data[0], data[0] + 1)
          callback(sortType, [data[0] + 1, data[1]])
        }
      } else if (sortType == 'both') {
        if (type == 'up') {
          data[0] == 0 ? '' : this.leftData = this.swapItems(this.leftData, data[0], data[0] - 1)
          data[1] == 0 ? '' : this.rightData = this.swapItems(this.rightData, data[1], data[1] - 1)
          callback(sortType, [data[0] == 0 ? data[0] : (data[0] - 1), data[1] == 0 ?  data[1] : (data[1] - 1)]);
        } else {
          data[0] == (this.leftData.length - 1) ? '' : this.leftData = this.swapItems(this.leftData, data[0], data[0] + 1)
          data[1] == (this.rightData.length - 1) ? '' : this.rightData = this.swapItems(this.rightData, data[1], data[1] + 1)
          callback(sortType, [data[0] == (this.leftData.length - 1) ? data[0] : (data[0] + 1), data[1] == (this.rightData.length - 1) ? data[1] : (data[1] + 1)])
        }
      }
    },
    swapItems(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },
    addText(myValue){
      function insertAtCursor(myField, myValue) {

        //IE 浏览器
        if (document.selection) {
          myField.focus();
          sel = document.selection.createRange();
          sel.text = myValue;
          sel.select();
        }

        //FireFox、Chrome等
        else if (myField.selectionStart || myField.selectionStart == '0') {
          var startPos = myField.selectionStart;
          var endPos = myField.selectionEnd;

          // 保存滚动条
          var restoreTop = myField.scrollTop;
          myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);

          if (restoreTop > 0) {
            myField.scrollTop = restoreTop;
          }

          myField.focus();
          myField.selectionStart = startPos + myValue.length;
          myField.selectionEnd = startPos + myValue.length;
        } else {
          myField.value += myValue;
          myField.focus();
        }
      }
      //穿梭框 end

      if(this.productTabProductInfoId != null && this.productTabList.length > 0){
        var myField = document.getElementById("mytextareas");
        insertAtCursor(myField,myValue)
            this.productTabList.forEach((item,index)=>{
              if(item.productInfoId == this.productTabProductInfoId){
                console.log(myField.valuee)
                this.productTabList[index].content = myField.value
              }
            })
      }else{
        var myField = document.getElementById("mytextarea");
        insertAtCursor(myField,myValue)
        this.productMade.content = myField.value
      }

    },
    emitPhraes(){},
    timelineClick(data){
      this.handleNodeClick(data)

      if(data.productInfoId == null || data.productInfoId == ''){
          window.open(data.productAttr, '_blank');
          this.$message.warning("非产品，不在系统内制作")
          return
        }
          this.treeDataList.forEach(item=>{
            if(item.id === data.productInfoId){
              this.onTreeClickItem(item)
            }
          })
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
          requestProductTaskList({ userId: this.loginInfo.id, jobId: this.optionsValue.id }).then(
            res => {
              this.substep(res)
            }
          );
        })
    },

    //点击制作时次
    channelDate(makeItem,tabItem,tabIndex){
      console.log('makeItem',makeItem)
      console.log('tabItem',tabItem)
      console.log('tabIndex',tabIndex)
              if(tabIndex===false){
                console.log('单个')
                requestProducInfo({
                  productInfoId: this.lastItemClicked.id,
                  isReload: false,
                  makeTime:makeItem.makeTime
                  }).then(res => {
                        if(typeof(res.data)=="object"){
                        this.productTabList = null;
                        this.productMade = {};
                        this.productMade = {
                          ...res.data,
                        }
                        // this.productMade.makeTime = res.data.makeTime
                        // res.data.makeTimes.forEach(i=>{
                        //   if(i.makeMode == 2){
                        //     this.productMade.makeTime = i.makeTime
                        //   }
                        // })


                        this.makeTimes = res.data.makeTimes
                      }
                });
              }else{
                console.log('多个')
                requestProducInfo({
                    productInfoId: tabItem.productInfoId,
                    isReload: false,
                    makeTime:makeItem.makeTime
                    }).then(res => {
                          if(typeof(res.data)=="object"){
                          this.productMade = {};
                          this.productTabList.map((item,index)=>{//修改下标为tabIndex的对象
                            tabIndex == index ? (this.productTabList[index].makeTime = res.data.makeTime) : (this.productTabList[index].makeTime = this.productTabList[index].makeTime)
                            // tabIndex == index ? (this.productTabList[index].content = makeItem.content) : (this.productTabList[index].content = this.productTabList[index].content)
                            tabIndex == index ? (this.productTabList[index].content = res.data.content) : (this.productTabList[index].content = this.productTabList[index].content)
                            tabIndex == index ? (this.productTabList[index].fileName = res.data.fileName) : (this.productTabList[index].fileName = this.productTabList[index].fileName)
                            tabIndex == index ? (this.productTabList[index].makeTimes = res.data.makeTimes) : (this.productTabList[index].makeTimes = this.productTabList[index].makeTimes)
                          })
                          // this.makeTimeData = makeItem.makeTime //????????????????????????
                        }
                  });
              }
    },
    hiddenNav(){
      this.isNav = false
    },
    directionSide(){
      this.isNav = true

      this.isRouterAlive = false;
      this.isEditAlive = false;
      setTimeout(() => {
        this.$nextTick(() => {
        this.isEditAlive = true;
        this.mainWidth = this.$refs.mainDom.offsetWidth
        this.isRouterAlive = true;
      })
      }, 300);

      if(!this.isRight){
      setTimeout(() => {
        this.mainWidth = this.$refs.mainDom.offsetWidth - 112
        this.directionRightEdit()
      }, 300);
      }

    },
    directionLeft(){
      this.isDirection = true

      this.isRouterAlive = false;
      this.isEditAlive = false;
      setTimeout(() => {
        this.$nextTick(() => {
        this.isEditAlive = true;
        this.mainWidth = this.$refs.mainDom.offsetWidth
        this.isRouterAlive = true;
      })
      }, 300);

    },
    rightClose(){
      this.isRight = false
    },
    directionRight(){
      this.isDirection = false
    },
    directionRightEdit(){
      this.isRight = true


      this.isRouterAlive = false;
      this.isEditAlive = false;
      setTimeout(() => {
        this.$nextTick(() => {
        this.isEditAlive = true;
        this.mainWidth = this.$refs.mainDom.offsetWidth - 112
        this.isRouterAlive = true;
      })
      }, 300);


      // this.isDirection = false
      // this.isDirection = true
      // this.isRouterAlive = false;
      // this.$nextTick( () => {//刷新中间理由
      //   this.isRouterAlive = true;
      // })
    },
    handleClickTab(tab, event) {
      console.log(tab, event);
    },
    //input 失去焦点触发
    onInputBlur(data){
      this.tvText = null
      requestProductTvTextByCode({content:this.productMade.content}).then(res=>{
        this.tvText = res.data
      })
    },
    handleInput(data) {
      console.log(data)
      // if(!this.productMade){
      //     this.$message.error("请选择需要编辑的产品");
      // }
    },
    focusEvent(data){
      // console.log(data)
    },
    function3() {
      // if (
        // !this.lastItemClicked ||
        // !this.productMade.fileName ||
        // !this.productMade.issue ||
      //   !this.productMade.content
      // ) {
      //   this.$message.error("选择产品，并填写完整信息!");
      //   return;
      // }
        this.formConsultData(this.saveProducId);
    },
    formConsultData(id) {
      let param = {
        publishId: id,
        publishUser: this.loginInfo.name,
        channelList: [],
        timingDate: this.activityObj.timingDate
      };

      let channels = [];
      this.tabsList1.forEach((i, index) => {
        channels.push({
          channel: i.channel,
          // content:this.formConsult['content'+i.channel],
          content: this.contentTabRoot[i.channel],
          users: this.userArr(i)
        });
      });

      param.channelList = channels;
      this.paramInfo = {
        ...param
      };

      requestProducTreleaseDoPublish(param).then(res => {
        this.visibleDialogConsult = false;
        this.formConsult = null;
        if (res.success) {
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      });

      return param;
    },
    userArr(data) {
      let channelUser = []; //勾选的用户
      this.$refs.treeUser.forEach((i, index) => {
        if (this.$refs.treeUser[index].getCheckedNodes().length > 0) {
          this.$refs.treeUser[index].getCheckedNodes().forEach(element => {
            if (element.type != "type") {
              channelUser.push(element);
            }
          });
        }
      });
      let paramObj = [];
      channelUser.forEach(item => {
        if (item.channel == data.channel) {
          paramObj.push({
            id: item.id,
            name: item.name,
            address: item.address,
            sendName: item.sendName == null? '':item.sendName && item.sendName == undefined? '':item.sendName
          });
        }
      });
      return paramObj;
    },
    getLast(item,index,callback){
      console.log('getLast-item:',item)
      console.log('getLast-lastItemClicked:',item)
      if (
        !this.lastItemClicked
      ) {
        this.$message.error("请先选择产品");
        return;
      }
      requestProductMakeHistoryList({productInfoId:this.lastItemClicked.id}).then(res=>{
        this.productMade.content = res.data[0].content
      })
    },
    getLasts(item,index){
      requestProductMakeHistoryList({productInfoId:item.productInfoId}).then(res=>{
        this.productTabList[index].content = res.data[0].content
      })
    },

    //保存
    onSave(item,index,callback) {
      this.$refs.iframe.iframeClick(this.lastItemClicked);
      console.log('onSave-item:',item)
      console.log('onSave-lastItemClicked:',item)
      if (
        !this.lastItemClicked ||
        !item.fileName ||
        !item.issue ||
        !item.content
      ) {
        this.$message.error("选择产品，并填写完整信息!");
        return;
      }
      if(item.content.length > item.limitnumber ){
        this.$message({
          message: '已超字数',
          type: 'warning'
        });
        return;
      }

      let param = {
        orgId: this.loginInfo.orgId,
        id: item.id,
        productInfoId: index === false? this.lastItemClicked.id:item.productInfoId,
        productInfoName: index === false? this.lastItemClicked.label:item.name,
        issue: item.issue,
        // reserve: item.reserve ? "1" : "0",
        // reserveTime: item.reserveTime,
        // reserveTime: '0',
        createUser: this.loginInfo.name,
        content: item.content,
        fileName: item.fileName,
        makeTime: item.makeTime,
        // timingDate: item.timingDate,
      };
      requestProducTreleaseSave(param).then(res => {
        this.saveProducId = res.data.id
        if(index === false){
          this.productMade = null;
          this.productMade = {
            ...res.data,
            makeTime: item.makeTime,
            timingDate: item.timingDate,

          };
          if (res.success) {
            this.$message.success(res.message);
            this.contentTabRoot = {};
          } else {
            this.$message.error(res.message);
            this.contentTabRoot = {};
          }
        callback(item,index)
        }else{
          this.productTabList[index].channelContent = res.data.channelContent;
          this.productTabList[index].fileName = res.data.fileName;
          this.productTabList[index].id = res.data.id;
          console.log('productTabList[index]:',this.productTabList[index])
          callback(item,index)
          if (res.success) {
            this.$message.success(res.message);
            this.contentTabRoot = {};
          } else {
            this.$message.error(res.message);
            this.contentTabRoot = {};
          }
        }
      });
    },

    onConsult(item,index,fast) {
      let _this = this
      if (
        !this.lastItemClicked ||
        // !item.fileName ||
        // !item.issue ||
        !item.content
      ) {
        this.$message.error("选择产品，并填写完整信息!");
        return;
      }

      if(item.content.length > item.limitnumber ){
        this.$message({
          message: '已超字数',
          type: 'warning'
        });
        return
      }

      this.visibleDialogConsult = fast == 'fast' ? false:true
      if(fast == 'fast'){
        //快速发布

        _this.onSave(item,index,function(item,index){
          let param = {
            publishId: index === false ? _this.productMade.id:_this.productTabList[index].id,
            publishUser: _this.loginInfo.name,
            timingDate:item.timingDate
          };
          requestProducDoQuickPublish(param).then(res=>{
            if (res.success) {
            _this.$message.success(res.message);
            } else {
              _this.$message.error(res.message);
            }
          })
        })

        return
      }

        //普通发布
        _this.onSave(item,index,function(item,index){
          console.log('普通发布：item',item)
          console.log('普通发布：index',index)
            _this.activityObj = item //当前项
            requestProductUserList({
                  orgId: _this.loginInfo.orgId,
                  productInfoId: index === false? _this.lastItemClicked.id:item.productInfoId,
                }).then(res => {
                  _this.tabsList1 = res.data;
                  let checkeds = []; //已选中

                  function treeOfLists(tree) {
                    tree.map(item => {
                      if (item.checked == true) {
                        checkeds.push(item.id);
                      }
                      if (item.children) {
                        treeOfLists(item.children);
                      }
                    });
                  }

                  res.data.forEach(i => {
                    if (i.children) {
                      treeOfLists(i.children);
                    }
                  });

                  _this.$nextTick(() => {
                    //默认勾选
                    if (_this.$refs.treeUser) {
                      _this.$refs.treeUser.forEach((i, index) => {
                        _this.$refs.treeUser[index].setCheckedKeys(checkeds);
                      });
                    }
                  });

                  _this.tabsListValue1 = res.data[0].channel;

                  if(index === false){
                    let contentTabRoot = {};
                    _this.productMade.channelContent = JSON.parse(
                      _this.productMade.channelContent
                    );
                    _this.tabsList1.forEach(
                      e =>
                        (contentTabRoot[e.channel] = _this.productMade.channelContent[e.channel])
                    );
                    _this.contentTabRoot = contentTabRoot;
                  }else{
                    let contentTabRoot = {};
                    _this.productTabList[index].channelContent = JSON.parse(
                      _this.productTabList[index].channelContent
                    );
                    _this.tabsList1.forEach(
                      e =>
                        (contentTabRoot[e.channel] = _this.productTabList[index].channelContent[e.channel])
                    );
                    _this.contentTabRoot = contentTabRoot;
                  }
                });

              });

          },
    handleTabClick(tab, event) {
      console.log(tab, event);
      // console.log("id:",tab.$vnode.key)
      // this.$router.replace({ name: tab.$attrs.item.name });
      // requestProducInfo({
      //   productInfoId: this.lastItemClicked.id,
      //   isReload: false
      // }).then(res => {
      //   this.productMade = null;
      //   this.productMade = {
      //     ...res.data,
      //     id: res.data.id
      //   };
      //   console.log(this.productMade);
      // });
    },
    onTreeClickItem(item) {
        this.handleNodeClick(item)

        this.cityData = null
        this.tvText = null

      // this.makeTimeData = null
      this.productTabProductInfoId = null
      console.log("click-tree-item1", item);
      this.isRouterAlive = false;
      this.$nextTick( () => {//刷新中间理由
        this.isRouterAlive = true;
      })

        this.lastItemClicked = item;
      if(item.treeType == 'productType'){
        requestProducInfos({
            productTypeId: this.lastItemClicked.id,
          }).then(res => {
            let tabsList = res.data.list
            let ids = []
            res.data.list.forEach(i=>{
              ids.push(i.id)
            })
            requestProductInfoIds({productInfoIds:ids.toString()}).then(res=>{
              this.productTabList = res.data.list
                res.data.list.forEach((item,index)=>{
                  tabsList.forEach(i=>{
                    if(i.id == item.productInfoId){
                      this.productTabList[index].name = i.name
                    }
                  })
                })
                this.productTabProductInfoId = this.productTabList[0].productInfoId
                this.productTabList.forEach((element,_index)=>{
                    // element.makeTimes.forEach(data=>{
                    //   if(data.makeMode == 2){
                    //     element.makeTime = data.makeTime
                    //   }else{
                    //   }
                    // })
                  })
            })
          });
      }else if(item.treeType == 'product'){
      requestProducInfo({
          productInfoId: this.lastItemClicked.id,
          isReload: false
          }).then(res => {
            if(typeof(res.data)=="object"){
              this.productTabList = null;
              this.productMade = null;
              this.productMade = {
                ...res.data,
              }
              this.makeTimes = res.data.makeTimes
              // this.makeTimes.forEach(i=>{
              //   if(i.makeMode == 2){
              //     this.productMade.makeTime = i.makeTime
              //   }
              // })

              console.log('productMade:',this.productMade);
            }
          });
      }

      if(item.code == 'dstqyb'){
        this.inputs = true
        this.directionRight()
          this.cityData = null
        requestProductCityData().then(res=>{
          this.cityData = res.data.content
        })
      }else{
        this.inputs = false
      }

    },
    formAlertSave(){
      return {
        content:this.alertTextarea,
        updateUser:this.alertList[0].updateUser
      }
    },
    dialogEmit(data) {
      console.log(data);
      if (data == "onAlert") {
        this.formAlert = true;
        requestProductMakeAlertPageList().then(res=>{
          this.alertList = res.data
          this.alertTextarea = res.data[0].content
        })
        this.visibleDialogAlert = true;
      }
    },
    submitAlert(){
      this.isRouterAlive = false;
      this.$nextTick( () => {
        this.isRouterAlive = true;
      })
    },
    clickPhraes(val){
      this.addText(val)
    },
    handleClick(tab, event) {
      console.log(tab, event);
      this.$router.replace({ name: tab.$attrs.item.name });
    },
    //初始化页面数据
    async requestData() {
      const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
      this.loginInfo = loginInfo;
      this.userJob = JSON.parse(localStorage.getItem('userJob'))
      // requestProductClassTreeList().then(res => {
      //   this.treeData = res.data.list;
      //   this.treeDataList = [];
      //   this.treeOfList(res.data.list);
      // });

      //获取所有TAB菜单
      await requestProductReferenceTabsList().then(res => {
        this.tabsList = res.data.list;
        this.$router.replace({ name: this.tabsList[0].name});
        this.tabsListValue = '0'

        //默认所有菜单编辑
        this.editoAllMenu = res.data.list
        this.editoAllMenu.forEach(element => {
          element.titleName = element.title
        });
      });

      //获取该用户TAB菜单
      requestProductReference().then(res=>{
        //过滤拥有的菜单
        if(res.success){
          this.notMenu = true
          let menu = []
          res.data.split(",").forEach(item => {
            this.tabsList.forEach(element => {
              if(item == element.content){
                menu.push(element)
              }
            });
          });
          this.tabsList = menu
          this.$router.replace({ name: this.tabsList[0].name});

        }else{
          this.notMenu = false
        }
      })


      //获取导航树
     await requestProductInfoTpyeTreeList({ orgId: this.loginInfo.orgId }).then(
        res => {
          this.treeData = res.data.list;
          this.treeDataList = [];
          this.treeOfList(res.data.list);
        }
      );

    },
    submitSuccess(res) {
      this.requestData();
    },
    ...mapActions(["gotAccountInfo", "getAccountInfo", "getMenuInfo"]),
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    treeOfList(tree) {
      tree.map(item => {
        this.treeDataList.push(item);
        if (item.children) {
          this.treeOfList(item.children);
        }
      });
    },
    saveModule() {},
    handleNodeClick(data) {
      let vm = this;
      console.log(data);
      vm.formItem = data;
      vm.topTitle = "";
      vm.topTitle = data.label;
      if (data.type == 'word' || data.type == 'excel') {
        vm.isIframe = true;
        //vm.docPath = `http://222.216.5.171:8891/gxims//railway/showWordForecastMonth.action?productId=20200228164618013583871`;
        vm.docPath = `/ssd-page-office/openProductOffice?productInfoId=`+data.id;
      } else {
        vm.isIframe = false;
      }
    },
    getFormItemByInputItemClassify(item = {}) {
      this.getAccountInfo().then(res => {
        //获取当前用户机构id
        if (res.success && res.data) {
          this.formItem.orgId = res.data.orgId;
        }
      });
      const { lastItemClicked } = this;
      const lastKeyItemClicked = lastItemClicked && lastItemClicked.id;
      console.log(lastItemClicked);
      return {
        // "XXXPROP_ORGAN_id": "",
        remark: "123",
        pid: "",
        name: "",
        sort: "",
        orgId: ""
        // "XXXPROP_ORGAN_4": lastItemClicked && (lastItemClicked.XXXPROP_ORGAN_4 || 0) + 1 + "",
        // "XXXPROP_ORGAN_5": lastKeyItemClicked,
        // lastItemClicked,
        // ...item
      };
    },
    getFormItemLeftByInputItem(item) {
      const { lastItemClicked } = this;
      console.log("lastItemClicked:", lastItemClicked);
      console.log("item:", item);
      return item
        ? {
            id: item.id,
            name: item.label,
            sort: item.sort,
            pid: item.parentId,
            orgId: item.userOrgId
          }
        : {
            name: "",
            sort: "",
            pid: lastItemClicked.pid,
            orgId: this.userOrgId
            // remark:"",
          };
    },
    getFormItemLeftByInputItemMinor(item) {
      const { lastItemClicked } = this;
      console.log("lastItemClicked:", lastItemClicked);
      console.log("item:", item);
      return item
        ? {
            name: item.label,
            sort: item.sort,
            pid: item.parentId,
            orgId: this.userOrgId
          }
        : {
            name: "",
            sort: "",
            pid: lastItemClicked.pid,
            orgId: this.userOrgId
          };
    },
    getFormItemByInputItemProduct(item = {}) {
      const { lastItemClicked } = this;
      const lastKeyItemClicked = lastItemClicked && lastItemClicked.id;
      return {
        // "XXXPROP_ORGAN_id": "",
        XXXPROP_ORGAN_1: "",
        XXXPROP_ORGAN_2: "",
        XXXPROP_ORGAN_3: "",
        XXXPROP_ORGAN_4:
          lastItemClicked && (lastItemClicked.XXXPROP_ORGAN_4 || 0) + 1 + "",
        XXXPROP_ORGAN_5: lastKeyItemClicked,
        XXXPROP_ORGAN_6: "",
        lastItemClicked,
        ...item
      };
    },
        getFormItemByInputItem() {
          this.requestData().then(()=>{
            this.rightData = [] //已拥有
            this.leftData = [] //未拥有
            this.tabsList.forEach(element => {//过滤拥有的
              this.rightData.push({name:element.title,id:element.id,content:element.content,title:element.title})
            });

            //过滤未拥有的
            this.leftData = this.editoAllMenu
            this.rightData.forEach((element,_index) => {
              this.editoAllMenu.forEach((i,index) => {
                if(element.id == i.id){
                  this.leftData.splice(index, 1);
                }
              });
            });

            //标题名称属性
            this.leftData.forEach(item => {
              item.titleName = item.title
            });
            //标题名称属性
            this.rightData.forEach(item => {
              item.titleName = item.title
            });

            return {name:'123'}
          })
          if(!this.notMenu){
            this.rightData = this.editoAllMenu
          }
        },
  }
};
</script>

<style lang='postcss' scoped>
.product-made-home {
  background: #f6f6f6;
  padding: 15px 20px 0 0;
  height: 100%;
  box-sizing: border-box;
  .wrap-box {
    display: flex;
    justify-content: space-between;
    min-height: 100%;
    .left-box {
      width: 280px;
      position: relative;
      background: #fff;
      .hidden-nav {
        position: absolute;
        right: 10px;
        top:10px;
        z-index: 99;
        color: #409eff;
        font-size: 18px;
        cursor:pointer;
      }
      .content-box {
        padding: 10px 20px 0;
        .tree-box {
          margin-top: 23px;
        }
      }
      .tool-box {
        padding: 30px 20px;
        position: relative;
        bottom: 0px;
        .line-interval {
          width: 100%;
          height: 1px;
          background: #e4e7ed;
          margin-bottom: 30px;
        }
        .classify-tool {
          display: flex;
          justify-content: space-between;
          height: 35px;
          line-height: 35px;
          .title {
            font-size: 14px;
            font-family: Microsoft YaHei;
            color: rgba(96, 98, 102, 1);
          }
          .icon-box {
            border: 1px solid rgba(235, 238, 245, 1);
            border-radius: 6px;
            width: 165px;
            .iconfont {
              display: inline-block;
              width: 30%;
              text-align: center;
              font-size: 15px;
              border-right: 1px solid #ebeef5;
            }
            .iconfont:last-child {
              border-right: none;
            }
            .tianjia {
              color: #67c241;
            }
            .bianji {
              color: #409eff;
            }
            .shanchu {
              color: #f46d6a;
            }
          }
        }
        .product-tool {
          margin-top: 14px;
        }
      }
    }

    .main{
      display: flex;
      flex: 1;
      .item-wrap {
        flex: 1;
      }
      .center-box {
      background: rgb(255, 255, 255);
      margin-left: 18px;
      width: calc(50% - 18px);
      position: relative;
      .nested{
        display: flex;
        flex-direction:column;
        height: 100%;
      }

      .direction-icon-r {
        font-size: 26px;
        right: -22px;
        top: 50%;
        position: absolute;
        width: 15px;
        height: 60px;
        color:#409eff;
        background: #dae9ff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .content-box {
        padding: 0 30px 33px;
        .weather-forecast-box {
          background: rgba(242, 246, 252, 1);
          border: 1px solid rgba(204, 204, 204, 1);
          border-radius: 4px;
          padding: 0 99px;
          .forecast-title {
            font-size: 24px;
            font-family: Microsoft YaHei;
            color: rgba(64, 158, 255, 1);
            padding: 68px 20px 0px;
            text-align: center;
          }
          .line-thick {
            height: 3px;
            background: rgba(64, 158, 255, 1);
            margin-top: 20px;
          }
          .line-thin {
            height: 1px;
            background: rgba(64, 158, 255, 1);
            margin-top: 4px;
          }
          .forecast-text {
            margin-top: 43px;
            .item-list {
              font-size: 16px;
              font-family: Microsoft YaHei;
              color: rgba(48, 49, 51, 1);
              margin-bottom: 10px;
            }
          }
        }
      }
      .el-tabs {
        padding: 0px 20px;
      }
    }
    .right-box {
      background: rgb(255, 255, 255);
      width: calc(50%-22px);
      margin-left: 22px;
      position: relative;

      .direction-icon-l {
        top: 50%;
        left: -15px;
        position: absolute;
        width: 15px;
        height: 60px;
        color: #409eff;
        font-size:26px;
        background: #dae9ff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .edit-one{
          padding-top: 10px;
          height: calc(100% - 71px) !important;
          .text-editor{
            padding: 0 15px;
            /* margin-bottom: 15px; */
            /* height: calc(100% - 15px)!important; */
            width: calc(100% - 30px);
            .words{
              position: absolute;
              right: 40px;
              bottom: 8px;
              color: #909399;
              font-size: 13px;
            }
          }
      }
      .content-box {
        height: calc(100%);
        min-width: 100%;
        .el-form{
          height: 100%;
        }
        .item-input {
          display: flex;
          .form-item-input {
            display: inline-block;
          }
          .title{
            color: #909399;
            font-size: 13px;
          }
          .el-form-item{
            margin-bottom: 2px;
          }
        }
        .select-time {
          margin-right: 10px;
        }
        .tab {
        }
        .iframe-content-box {
          width: 100%;
          height: 60vh;
          margin: 20px 0;
        }
        .form-txt {
          height: calc(100% - 172px);
          position: absolute;
          bottom:73px;
          width: 100%;
          .el-textarea {
            height: 100%;
            textarea{
              height: 100%;
            }
          }
          .text-editor{
            height: 100%;
            position: relative;
            .el-textarea{
              height: 100%;
              overflow: hidden;
            }
          }
        }
      }
      .el-tabs--border-card {
        /* background: #409eff; */
        /* width: 524px; */
        width: 100%;
      }
      .el-tabs--border-card-max {
        width: 100% !important;
        height: calc(100% - 63px);
      }
    }
    }


  }
      .direction-side {
      top: 341px;
      left: 0;
      position: fixed;
      color: #409eff;
      width: 30px;
      height: 18px;
      line-height: 18px;
      font-size: 12px;
      background-color: #dae9ff;
      margin: 0 auto;
      text-align: center;
      padding: 3px 4px;
      border-radius: 0 25px 25px 0;
      z-index: 3;
    }
  .top-title {
    padding: 20px;
    border-bottom: 1px solid #e4e7ed;
    display: flex;
    justify-content: space-between;
    .text {
      font-size: 18px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(48, 49, 51, 1);
      .link{
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #409eff;
      }
    }
  }
  .iframe-content-box {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-left: 15px;
    height: calc(100%-58px);
  }
  .no-border {
    border-bottom: none;
  }
  .router-wrap {
    display: flex;
    flex-direction:column;
    height: 100%;
    padding: 0 20px 20px 20px;
    background: #fff;
    }

}

.title {
  font-size: 14px;
  font-family: Microsoft YaHei;
  color: rgba(96, 98, 102, 1);
}
.common-left {
  width: 100% !important;
  margin-right: 0;
  height: 100%;
}

.common-left-tree-actions {
  display: inline-block;
  text-align: center;
  padding: 1em 0;
}
.left-box .text {
  margin-top: 15px;
}
.content-box-max {
  width: 100% !important;
  flex: 1 !important;
}
</style>
<style lang='postcss'>
.product-made-make {
  .wrap-box {
    height: 100%;
  }
  .left-box {
    height: 100%;
    .el-input__inner {
      border-radius: 16px;
    }
    .product-tab-tree {
      height: calc(100%-2px);
      .el-tab-pane{
        height: calc(100%+15px);
        position: relative;
        .el-timeline {
          width: calc(100% - 0px);
          position: absolute;
          top: 26px;
          left: 0;
          overflow: auto;
          padding-top: 4px;
          padding-left: 0;
          height: calc(100% - 26px);
          .el-timeline-item__tail{
            left: 44px;
          }
          .el-timeline-item__node{
            left: 38px;
          }
          .el-timeline-item__wrapper{
            left: 15px;
            width: calc(100% - 54px);
            .el-timeline-item__content{
              padding-top: 4px;
              height: 32px;
              letter-spacing: 0;
              overflow: hidden;
              display: -webkit-box;
              text-overflow: ellipsis;
              -webkit-line-clamp: 2;  /*要显示的行数*/
              -webkit-box-orient: vertical;
            }
            .el-timeline-item__timestamp{
              margin-top: 0px;
            }
          }
        }
      }
      .is-top {
        /* height: 100%;
        background: red; */
      }
      .el-tree::-webkit-scrollbar {
        display: none;
      }
      .button-tab {
        width: 100%;
        text-align: center;
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
    .el-tabs__content {
      padding: 15px 0;
      height: calc(100%-69px);
      .el-tab-pane{
        .el-radio-button{
        width: 25%;
        .el-radio-button__inner {
          width: 100%;
          border-radius:0;
        }
      }

      .common-left {
          .el-card {
            height: 100%;
            border: 0px solid #ebeef5;
            .el-card__body{
              height: calc(100%-40px);
              position: relative;
              .text {
              position: absolute;
              top:60px;
              left: 0;
              height: calc(100% - 100px);
              width:calc(100% - 40px);
                .tree{
                  height: 100%;
                  .tree-item{
                    height: 100%;
                      .el-tree {
                        height: 100%;
                        overflow-x: hidden;
                        overflow-y: auto;
                    }
                  }
                }
              }
            }
          }
      }
      }

    }
    .el-timeline-item {
      .el-timeline-item__wrapper {
        .timeFrame{
          position: absolute;
          color: red;
          z-index: 99;
          left: -30px;
        }
        .timeline-event{
          width: 25px !important;
          height: 25px !important;
          position: absolute;
          top: 0px;
          left: -5px;
        }
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
  .main {
    .el-tabs--border-card-max {
      .el-tabs__content {
        height: calc(100% - 69px);
        .el-tab-pane {
          height: 100%;
        }
      }
    }
    .nested {
      .el-tabs__nav {
        .el-tabs__item {
          padding: 0 10px;
          height: 35px;
        }
      }
      .el-tabs__nav-next, .el-tabs__nav-prev {
        /* line-height: 44px;
        */
        line-height: 41px;
        font-size: 22px;
        color: red;
      }
    }
  }
  .right-box{
    .edit-but{
      margin-right:15px;
      button{
        margin-left: 5px;
        padding: 7px 8px;
      }
    }

    .el-tabs{
      height: calc(100% - 63px);
      .el-tabs__content{
        height: calc(100% - 69px);
        .el-tab-pane{
          height: 100%;
        }
      }
    }
  }
  .date-num {
    font-weight: 600!important;
    margin-right: 3px;
  }
  .activeThree1 {
    color: rgb(0, 233, 31) !important;
  }
  .activeThree2 {
    color: red!important;
  }
  .activeThree3 {
    color: #858585!important;
  }
  .activeThree4 {
    background: #cdcdce!important;
    color: red!important;
  }
  .change-multiple {
      display: flex;
      height: 100%;
  }
  textarea{
    height: 100%;
    font-size: 1rem;
    resize:none;
  }

  .el-form{
    position: relative;
    .edit-but{
      display: block;
      width: 100%;
      position: absolute;
      bottom:0;
      margin-bottom:10px;
      .time-box{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .el-form-item{
          margin-bottom: 2px;

        }
      }
      .buts{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }


}
.consult {
  .consult-left {
    .top {
      background: rgba(246, 247, 251, 1);
      border: 1px solid rgba(228, 231, 237, 1);
      border-radius: 5px 5px 0 0;
      .select-all {
        font-size: 13px;
        padding: 14px;
      }
    }
    .tree {
      border: 1px solid rgba(228, 231, 237, 1);
      border-radius: 0 0 5px 5px;
      padding: 14px;
    }
    .product-made-home-tree {
      height: 400px;
      overflow-x: hidden;
      overflow-y: scroll;
    }
    .product-made-home-tree::-webkit-scrollbar {
      display: none;
    }
  }
  .consult-right {
    .top {
      background: rgba(246, 247, 251, 1);
      border: 1px solid rgba(228, 231, 237, 1);
      border-radius: 5px 5px 0 0;
      .select-all {
        font-size: 13px;
        padding: 14px;
      }
    }
    .consult-list {
      .el-table {
        .el-icon-bottom,
        .el-icon-top {
          color: #409eff;
          padding-right: 6px;
        }
        .el-icon-delete {
          color: #f56c6c;
          padding-right: 6px;
        }
      }
    }
  }

}
  .form-txt {
    .text-editor {
      .el-textarea.is-disabled {
          .el-textarea__inner{
            background: #fff;
            color:#606266;
            cursor: text;
          }
      }
    }
  }

    .items{
      position: relative;
      .words{
        position: absolute;
        right: 40px;
        bottom: 8px;
        color: #909399;
        font-size: 13px;
      }
    }

  .direction-icon-edit {
      position: fixed;
      font-size: 26px;
      right: 0px;
      top: 50%;
      width: 15px;
      height: 60px;
      color:#409eff;
      background: #dae9ff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .file-name-input{
      min-width: 12.5rem;
    }

.currentDatePickerClass > .el-picker-panel__footer > .el-button--text:first-child{
      display: none;
}
</style>
