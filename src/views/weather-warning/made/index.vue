<template>
<div class="warning-made-home" :class="type">
    <!-- {{form}} -->
    <div class="wrap-box">
        <div class="left-box">
            <div class="top-title">
                <div class="text" v-if="isWarning">天气警报选择</div>
                <div class="text" v-else>预警信号选择</div>
            </div>
            <div class="left-box-main">
                <div class="types-selector weather-types">
                    <table class="line" cellspacing="0" cellpadding="0" border="0" v-for="(line,indexOfLine) in types" :key="indexOfLine">
                        <tr>
                            <td class="label">
                                {{line.label}}
                            </td>
                            <td>
                                <div class="options item flex wrap">
                                    <template v-for="indexOfItem in min(line.items.length,4)">
                                        <div class="item" v-for="item in [line.items[indexOfItem-1]]" :class="{available:item}" :key="indexOfItem" v-if="isWarning">
                                            <div class="inner" v-if="item" :class="{selected:item.selected}" @click="onClickSelectorItem(item)">
                                                <div class="icon-wrapper">
                                                    <c-iconfont :name="item.icon" type="font" class="icon"></c-iconfont>
                                                </div>
                                                <div class="desc">{{item.desc}}</div>
                                            </div>
                                        </div>
                                        <div class="item" v-for="item in [line.items[indexOfItem-1]]" :class="{available:item}" :key="indexOfItem" v-else>
                                            <div class="inner" v-if="item" :class="{selected:item.selected}" @click="onClickSelectorAlarmItem(item)">
                                                <img-alarm class="pic" :info="item"></img-alarm>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>

            <div class="top-title" v-if="isWarning">
                <div class="text">已发预警信号</div>
            </div>
            <div class="left-box-main" v-if="isWarning">
                <div class="alarms">
                    <alarm-item :info="item" v-for="(item,index) in alarms" :key="index" :item="item"></alarm-item>
                    <div class="info text-center" v-if="!alarms||!alarms.length">
                        暂无预警
                    </div>
                </div>
            </div>
            <div class="left-box-main" v-else>
                <div class="flex acitons">
                    <c-iconfont class="item" type="font" name="shezhi"></c-iconfont>
                    <c-iconfont class="item" type="font" name="yujingshengjiangji"></c-iconfont>
                    <c-iconfont class="item" type="font" name="yujingjiechu"></c-iconfont>
                </div>
            </div>
        </div>

        <div class="center-box">
            <div class="top-title">
                <div class="text" v-if="isWarning">天气警报制作</div>
                <div class="text" v-else>预警信号发布</div>
            </div>
            <div class="content-box">
                <el-form label-width="80px">
                    <div class="form-item">
                        <div class="item-content">
                            <div class="text-center" v-if="!isWarning">
                                <div class="alarm-show" v-show="alarmMain.imageType">
                                    <img-alarm class="pic" :info="{imageType:alarmMain.imageType,imageColor:alarmMain.imageColor}"></img-alarm>
                                    <c-iconfont class="help" type="font" name="yiwen"></c-iconfont>
                                </div>
                            </div>
                            <el-row>
                                <el-col :span="8">
                                    <el-form-item label="发布单位">
                                        <!-- <c-select v-model="form.XXX_PROP_WARNING_ORGANIZE" options="organiseType" placeholder="请选择" @label-selected="label=>form.XXX_PROP_WARNING_ORGANIZE_NAME = label"></c-select> -->
                                        <!-- <c-select v-model="form.XXX_PROP_WARNING_ORGANIZE" :options="[{label:accountOrgId,value:accountOrgId}]" :key="accountOrgId" placeholder="请选择"
                                          @label-selected="label=>form.XXX_PROP_WARNING_ORGANIZE_NAME = label"></c-select> -->
                                        <el-select v-model="form.XXX_PROP_WARNING_ORGANIZE" placeholder="请选择">
                                            <el-option v-for="item in organList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="10">
                                    <el-form-item label="发布时间">
                                        <el-date-picker v-model="form.publishTime" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy/MM/dd HH:mm">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="期号">
                                        <el-input v-model="form.issue"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-form-item label="警报类型" v-if="isWarning">
                                <el-input v-model="form.XXX_PROP_WARNING_TYPE"></el-input>
                            </el-form-item>
                            <el-form-item label="警报内容" v-if="isWarning">
                                <el-input v-model="form.alarmContent" type="textarea" :autosize="{ minRows: 6, maxRows: 6}"></el-input>
                            </el-form-item>
                            <el-form-item label="已发警报" v-if="isWarning">
                                <el-input v-model="form.warningContent" type="textarea" :autosize="{ minRows: 3, maxRows: 3}"></el-input>
                            </el-form-item>
                            <el-form-item label="预警标题" v-if="!isWarning">
                                <el-input v-model="form.title"></el-input>
                            </el-form-item>
                            <el-form-item label="预警内容" v-if="!isWarning">
                                <el-input v-model="form.content" type="textarea" :autosize="{ minRows: 2, maxRows: 2}"></el-input>
                            </el-form-item>
                            <el-form-item label="防御指南" v-if="!isWarning">
                                <el-input v-model="form.defense" type="textarea" :autosize="{ minRows: 2, maxRows: 2}"></el-input>
                            </el-form-item>
                            <el-form-item label="影响范围" v-if="!isWarning">
                                <div class="checkbox-box">
                                    <el-checkbox v-model="item.selected" :label="item.label" border v-for="(item,index) in areas" :key="index"></el-checkbox>
                                </div>
                            </el-form-item>
                            <el-form-item label="发布渠道">
                                <div class="checkbox-box">
                                    <el-checkbox v-model="channel.selected" :label="channel.label" border v-for="(channel,index) in channels" :key="index"></el-checkbox>
                                </div>
                            </el-form-item>
                            <el-row>
                            <el-col :span="8">
                                <el-form-item label="制作人" v-if="isWarning">
                                    <el-input v-model="form.makeUser"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">

                                <el-form-item label="签发人" v-if="isWarning">
                                    <el-select v-model="form.checkUser" placeholder="请选择">
                                        <el-option v-for="item in userList" :label="item.name" :value="item.name" :key="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8"></el-col>
                            </el-row>
                            <el-form-item label="区县提醒">
                                <el-col :span="4">
                                    <el-switch v-model="form.XXX_PROP_WARNING_AREA_REMIND" active-text="是" inactive-text="否"></el-switch>
                                </el-col>
                                <el-col :span="18"></el-col>
                            </el-form-item>
                            <el-divider></el-divider>
                        </div>
                        <div class="item-content">
                            <div class="footer">
                                <el-button type="success" @click="preview()">预览</el-button>
                                <el-button type="primary" @click="publish()">发布</el-button>
                            </div>
                        </div>
                    </div>
                </el-form>
            </div>
        </div>
        <div class="right-box">
            <div class="top-title">
                <div class="text" v-if="isWarning">天气警报发布单</div>
                <div class="text" v-else>预警信号发布单</div>
                <div class="actions">
                    <div class="action float-left">
                        <c-iconfont type="font" name="lishitongleifabu"></c-iconfont>
                        历史同类发布
                    </div>
                    <div class="action float-left">
                        <c-iconfont type="font" name="dayin"></c-iconfont>
                        打印
                    </div>
                    <div class="clearfix"></div>
                </div>
            </div>
            <div class="content-box">
                <red-head :type="type" :form="form" :data="dataReadHead" v-if="dataReadHead"></red-head>
                <no-data type="big" v-else>
                    请点击左侧预览按钮
                </no-data>
            </div>
        </div>
    </div>
    <dialog-form @success="submitSuccess" title="天气警报发布" :visible.sync="visibleDialog" :getPayload="formatPayloadSend" :confirmDisabled="false" :remote="remoteDialog" v-if="formDialog">
        <template>
            <el-tabs v-model="tabsListValue1" type="card" @tab-click='tabClick'>
                <el-tab-pane :key="item.value" v-for="(item, index) in channelsSelected" :label="item.label" :name="item.value">
                    <div class="consult">
                        <el-row :gutter="10">
                            <el-col :span="18">
                                <div class="consult-right">
                                    <div class="top">
                                        <div class="select-all">发布内容</div>
                                    </div>
                                    <div class="consult-list">
                                        <!-- <content-weather :data="dataReadHeadSync" v-if="isWarning"></content-weather>
                                        <content-alarm :data="dataReadHeadSync" v-else></content-alarm> -->
                                        <el-input v-model="contentTabRoot[item.value]" type="textarea" :autosize="{ minRows: 3, maxRows: 20}"></el-input>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="consult-left">
                                    <div class="top">
                                        <div class="select-all">服务用户</div>
                                    </div>
                                    <template >
                                    <div class="tree" v-for="i in tabTree" :key="i.id">
                                        <el-tree v-if="i.channel == item.value" :data="i.children" ref="tree" :ref="`tree-${item.value}`" show-checkbox node-key="id"  highlight-current :props="defaultProps"></el-tree>
                                    </div>
                                    </template>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </template>
    </dialog-form>
</div>
</template>

<script>
import moment from 'moment'
import {
    mapGetters
} from 'vuex'
import {
    requestGetAlarms,
    requestOrganList,
    requestAllUserList,
    requestChannelList,
    requestGetIssue,
    requestProductUserList,
    requestSelectorList,
    requestSelectorListAlarm
} from '@/remote/'
import {
    mapFrontMapper
} from '@/common/mapper'
import {
    mapFrontOptions
} from '@/common/options'
import {
    transformAlarmsInfo
} from "@/common/tools/"
import {
    transformDate,
    addDate,
    transformRedHead
} from "@/common/filter"
import AlarmItem from '../../components/alarm-item/index.vue'
import redHead from '../../components/red-head.vue'
import contentWeather from '../../components/content-weather.vue'
import contentAlarm from '../../components/content-alarm.vue'
const generateTypesOfWarning = () => [{
    "label": "台风",
    "items": [{
        "icon": "taifengxiaoxi",
        "desc": "台风消息",
        "selected": false
    }, {
        "icon": "taifengjingbao",
        "desc": "台风警报",
        "selected": false
    }, {
        "icon": "taifengjinjijingbao",
        "desc": "台风紧急警报",
        "selected": false
    }]
}, {
    "label": "降水类",
    "items": [{
        "icon": "baoyu",
        "desc": "暴雨警报",
        "selected": false
    }, {
        "icon": "daoxue",
        "desc": "大雪警报",
        "selected": false
    }, {
        "icon": "baoxue",
        "desc": "暴雪警报",
        "selected": false
    }]
}, {
    "label": "气温类",
    "items": [{
        "icon": "lengkongqi",
        "desc": "冷空气消息",
        "selected": false
    }, {
        "icon": "qianglengkongqi",
        "desc": "强冷空气消息",
        "selected": false
    }, {
        "icon": "hanchao1",
        "desc": "寒潮警报",
        "selected": false
    }, {
        "icon": "jiangwenbaogao",
        "desc": "降温报告",
        "selected": false
    }, {
        "icon": "yanhanjingbao",
        "desc": "严寒警报",
        "selected": false
    }, {
        "icon": "gaowenbaogao",
        "desc": "高温报告",
        "selected": false
    }, {
        "icon": "kurejingbao",
        "desc": "酷热警报",
        "selected": false
    }, {
        "icon": "diwenbaogao01",
        "desc": "低温报告",
        "selected": false
    }]
}, {
    "label": "雾霾类",
    "items": [{
        "icon": "nongwujingbao",
        "desc": "浓雾警报",
        "selected": false
    }, {
        "icon": "mai",
        "desc": "霾警报",
        "selected": false
    }]
}, {
    "label": "其他类",
    "items": [{
        "icon": "dafengjingbao",
        "desc": "大风警报",
        "selected": false
    }, {
        "icon": "leibaojingbao",
        "desc": "雷暴警报",
        "selected": false
    }]
}];
const getInitData = () => {
    const publishTime = moment().format("YYYY/MM/DD HH:mm");
    return {
        form: {
            orgName:'',
            issue:'',
            makeUser:null,//制作人
            checkUser:null,//签发人
            publishTime,
            XXX_PROP_WARNING_TYPE: "",
            alarmContent: "",
            warningContent: "",
            title: "",
            content: "",
            defense: "",
            XXX_PROP_WARNING_ORGANIZE: "",
            XXX_PROP_WARNING_ORGANIZE_NAME: "",
            XXX_PROP_WARNING_ORGANIZE_USERID: ""
        },
        alarmMain: {
            imageType: null,
            imageColor: null
        },
        visibleDialog: false,
        dataReadHead: null,
    }
};
export default {
    components: {
        AlarmItem,
        redHead,
        contentWeather,
        contentAlarm,
    },
    data() {
        return {
            checkedUserArr:[],
            userList:[],
            loginInfo:null,
            wayTpye: [],
            channels:[],
            organList:null,
            ...getInitData(),
            // types: null,
            typesOfAlarm: null,
            typesOfWarning: null,
            alarms: [],
            areas: null,
            formDialog: {},

            tabsListValue1: "FAX",
            defaultProps: {
                children: "children",
                label: "label"
            },
            tabTree: [],
            contentTabRoot: {}
            // end of data
        };
    },
    computed: {
        types() {
            const {
                isWarning,
                typesOfAlarm,
                typesOfWarning
            } = this;
            return isWarning ? typesOfWarning : typesOfAlarm;
        },
        warningTypesLeft() {
            const val = this.types;
            if (!val) {
                return ""
            }
            return val.map(e => e.items.filter(e => e.selected).map(e => e.desc).join("和")).filter(e => e).join("和")
        },
        dataReadHeadSync() {
            const {
                form,
                alarmMain,
                accountName,
                isWarning
            } = this;
            return transformRedHead({
                accountName,
                ...form,
                ...alarmMain
            }, isWarning)
        },
        type() {
            return this.$route.params.type
        },
        isWarning() {
            return this.type == 'warning'
        },
        channelsSelected() {
            return this.channels.filter(e => e.selected);
        },
        remoteDialog() {
            return this.isWarning ? 'requestDialogFormWeatherSend' : 'requestDialogFormAlarmSend'
        },
        // end of computed
        ...mapGetters(['accountName', 'accountOrgId']),
        ...mapFrontMapper(['weatherWarningType']),
        // ...mapFrontOptions(['areas', 'channels'])
        ...mapFrontOptions(['areas']),
    },
    watch: {
        'form.XXX_PROP_WARNING_ORGANIZE'(val){
            if(this.organList){
                this.organList.forEach(i=>{
                    if(i.id==val){this.form.orgName = i.name}
                })
                console.log(this.form.orgName)
            }else{
                requestOrganList().then(res =>{
                    this.organList = res.data.list
                    this.organList.forEach(i=>{
                        if(i.id==val){this.form.orgName = i.name}
                    })
                console.log(this.form.orgName)
                })
            }
        },

        warningTypesLeft(val, old) {
            if (val != old) {
                let str = val.replace("和","、")　
                str = str.replace(/和/g,"、")
                str = str.replace(/(.*)、/,'$1和');
                this.form.XXX_PROP_WARNING_TYPE = str
            }
        },
        accountOrgId: {
            handler(val) {
                this.form.XXX_PROP_WARNING_ORGANIZE = val;
                this.form.XXX_PROP_WARNING_ORGANIZE_NAME = val;


            },
            immediate: true
        },
        isWarning() {
            Object.assign(this, getInitData());
        }
    },
    mounted() {
        const {
            isWarning
        } = this;

        const loginInfo = JSON.parse(localStorage.getItem('loginInfo',))
        this.loginInfo = loginInfo
        this.form.makeUser = this.loginInfo.username

        requestProductUserList({orgId:this.loginInfo.orgId}).then(res => {
            this.tabTree = res.data;
            function changeName(tree) {
                tree.map(item => {
                    item.label = item.name
                    item.value = item.channel
                    item.code = item.channel
                    item.selected = true
                    if (item.children) {
                        changeName(item.children)
                    }
                })
            }
            changeName(this.tabTree)
        });
        
        requestOrganList().then(res =>{
            this.organList = res.data.list
            // this.organList.unshift({
            //     name:'顶级',
            //     id:'0'
            // })
        })
        requestAllUserList({orgId:this.loginInfo.orgId}).then(res =>{
            this.userList = res.data.list

        })

      //获取发布渠道
      requestChannelList().then(res=>{
        this.wayTpye = res.data
        this.wayTpye.forEach(i=>{
            i.label = i.name,
            i.value = i.code,
            i.selected = false
        })
        this.channels = JSON.parse(JSON.stringify(this.wayTpye));
      })

      requestGetIssue().then(res=>{
          this.form.issue = res.data
      })

        requestGetAlarms().then(res => {
            this.alarms = res.data.list.map(e => ({
                ...transformAlarmsInfo({
                    code: e.code,
                    type: e.XXXPROP_ALARMS_TYPE,
                    level: e.level
                }),
                content: e.XXXPROP_ALARMS_CONTENT,
                time: e.XXXPROP_ALARMS_TIME,
                ...e
            }))
            this.form.warningContent = res.data.desc
        })

        // this.typesOfWarning = generateTypesOfWarning();
        requestSelectorList().then(res => {
            this.typesOfWarning = res.data.list;
        });

        this.areas = JSON.parse(JSON.stringify(this.areasOptions));
        requestSelectorListAlarm().then(res => {
            this.typesOfAlarm = res.data.list.map(line => {
                line.items = line.items.map(e => ({
                    ...transformAlarmsInfo({
                        code: e.code,
                        level: e.imageColor
                    }),
                    ...e
                }))
                return line
            })
        });
    },
    beforeRouteUpdate(to, from, next) {
        this.dataReadHead = null;
        // Object.keys(this.form).forEach(e => this.form[e] = undefined)
        // Object.keys(this.alarmMain).forEach(e => this.alarmMain[e] = undefined)
        next()
    },
    methods: {
    getKeys(){
        let keys = this.$refs.trees.getCheckedKeys()
        return keys
    },
      getNodes(){
        let nodes = this.$refs.trees.getCheckedNodes()
        return nodes
      },
      setKeys(data){
          this.$refs.trees.setCheckedKeys(data);
      },
        tabClick(tab, event){
            console.log(tab.name)
        },
        onClickSelectorItem(item) {
            item.selected = !item.selected
            if (item.selected) {
                if (this.form.alarmContent == null) {
                    this.form.alarmContent = ''
                }
                this.form.alarmContent += item.remark;
            }
        },
        onClickSelectorAlarmItem(item) {
            this.alarmMain = item
            this.form.content = item.content;
            this.form.defense = item.defense;
        },
        handleClick(tab, event) {
            console.log(tab, event);
        },
        min(val, min) {
            return val < min ? min : val
        },
        submitSuccess() {

        },
        preview() {
            this.dataReadHead = this.dataReadHeadSync;
        },
        publish() {
            let publishChannels = []
            const {
                channelsSelected,
                dataReadHeadSync,
                isWarning,
                form
            } = this;
            const [first] = channelsSelected;
            if (!first) {
                this.$message.warning("请选择发布渠道")
                return
            }
            if (!form.checkUser) {
                this.$message.warning("请填写签发人")
                return
            }
            if (!form.XXX_PROP_WARNING_TYPE) {
                this.$message.warning("请填写警报类型")
                return
            }
            if (!form.alarmContent) {
                this.$message.warning("请填写警报内容")
                return
            }
            if (!form.issue) {
                this.$message.warning("请填写期号")
                return
            }
            if (!isWarning) {
                // [2020]1-A
                const m = /\[(\d+)\](\d+)-(\w+)/.exec(form.issue)
                if (!m) {
                    this.$message.warning("请填写正确的期号")
                    return
                }
                const [, issueYear, issueNumber, issueLetter] = m;
                Object.assign(form, {
                    issueYear,
                    issueNumber,
                    issueLetter
                })
            }
            const contentTabRoot = {};
            const dataInner = dataReadHeadSync;
            const selectText = isWarning ? `台州电视台、广播电台：
\t${this.form.orgName}${transformDate(dataInner.XXXPROP_RED_HEAD_PUB_TIME,"YYYY年MM月DD日HH时mm分")}发布${dataInner.XXXPROP_RED_HEAD_TYPE}，请在收到此通知单后15分钟内在电视节目中播出${dataInner.XXXPROP_RED_HEAD_TYPE}，并滚动播出以下内容：

${dataInner.XXXPROP_RED_HEAD_CONTENT}${dataInner.XXXPROP_RED_HEAD_ALL_READY}


${this.form.orgName}
制 作 人：${this.form.makeUser}
签 发 人：${this.form.checkUser}
发送时间：${transformDate(dataInner.XXXPROP_RED_HEAD_SEND_TIME,"YYYY年MM月DD日HH时mm")}` : `${dataInner.XXXPROP_RED_HEAD_TITLE}${dataInner.XXXPROP_RED_HEAD_CONTENT}

图标：
\t\t{图标}

防御指南：
	${dataInner.XXXPROP_RED_HEAD_GUID}


预报员签名：${dataInner.XXXPROP_RED_HEAD_USER} \t 签发人姓名：许茂利
制作时间：${transformDate(addDate(dataInner.XXXPROP_RED_HEAD_PUB_TIME,'-0:5'),"YYYY年MM月DD日HH时mm分")} \t 签发时间：${transformDate(addDate(dataInner.XXXPROP_RED_HEAD_PUB_TIME,'0:5'),"YYYY年MM月DD日HH时mm分")}`;
            channelsSelected.forEach(e => contentTabRoot[e.value] = selectText);
            this.contentTabRoot = contentTabRoot;
            this.tabsListValue1 = first.value;
            this.visibleDialog = true
        },
        formatPayloadSend() {
            const {
                form,
                contentTabRoot,
                channelsSelected,
                alarmMain,
                isWarning
            } = this;
            const typesSelected = this.types.reduce((p, c) => {
                p.push(...c.items);
                return p;
            }, []).filter(e => e.selected);
            const areasSelected = this.areas.filter(e => e.selected);
            const channelContent = JSON.stringify(contentTabRoot);
            const list = [];
            channelsSelected.forEach(e => {
                const serviceUserList = [];
                this.$refs[`tree-${e.value}`][0].getCheckedNodes().forEach(item => {
                    console.log(item)
                    if (item.type == "user") {
                        serviceUserList.push({
                            id: item.id,
                            address: item.address,
                            name: item.label
                        });
                    }
                });
                const map = {
                    serviceUserList,
                    publishChannel: e.value
                };
                list.push(map);
                console.log(list)
            })
            // [{ "serviceUserList":[{"id":"U30001","name":"张三","address":"1234@qq.com"},{"id":"U30002","name":"李四","address":"12345@qq.com"}], "publishId":"1" , "publishChannel":"1" },{ "serviceUserList":[{"id":"U30003","name":"张三2","address":"123456@qq.com"},{"id":"U30004","name":"李四2","address":"1234567@qq.com"}], "publishId":"2" , "publishChannel":"3" }]
            // http://localhost:9813/ssd/warning/ssd-early-alarm-publish/add?alarmCode=6&alarmName=6&publishOrg=6&publishUser=6&publishTime=2020/01/06 17:16&issue=6&alarmContent=6&makeUser=6&makeTime=2020/01/05&status=1&publish=0&finish=0
            return isWarning ? {
                alarmCode: typesSelected.map(e => e.icon).join(","),
                // alarmName: typesSelected.map(e => e.desc).join(","),
                alarmName: this.form.XXX_PROP_WARNING_TYPE,
                publishOrg: this.accountOrgId,
                publishUser: this.accountName,
                makeUser: this.accountName,
                status: 1,
                publish: 0,
                finish: 0,
                channelContent,
                list,
                makeTime: form.publishTime,
                ...form
            } : {
                code: alarmMain.code,
                level: alarmMain.imageColor,
                effectArea: areasSelected.map(e => e.value).join(","),
                effectAreaName: areasSelected.map(e => e.label).join(","),
                publishOrg: this.accountOrgId,
                publishUser: this.accountName,
                makeUser: this.accountName,
                type: 0,
                effective: 24,
                status: 6,
                publish: 0,
                finish: 0,
                channelContent,
                list,
                makeTime: form.publishTime,
                ...form
            }
        }
        // end of methods
    }
};
</script>

<style scoped>
.warning-made-home {
    background: #f6f6f6;
    padding: 15px 20px 0 15px;
    height: 100%;
    box-sizing: border-box;

    .wrap-box {
        display: flex;
        justify-content: space-between;

        .left-box {
            width: 420px;
            position: relative;
            background: #fff;

            .left-box-main .alarms {
                height: calc(100vh - 852px);
                min-height: 100px;
                overflow: auto;
            }

            .content-box {
                padding: 10px 20px 0;

                .tree-box {
                    margin-top: 23px;
                }
            }

            .warning-tool {
                margin-top: 14px;
            }
        }
    }

    .center-box {
        flex: 1;
        background: #fff;
        margin-left: 18px;

        .content-box {
            padding: 0 30px 33px;

            .item-title {
                padding: 20px 0;
                font-size: 16px;
            }

            .item-content {
                padding: 20px 20px;
                font-size: 14px;

                .checkbox-box {
                    .el-checkbox {
                        margin: 5px 5px !important;
                    }
                }

                .footer {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
    }

    .right-box {
        /* flex: 0.5; */
        width: 620px;
        background: #fff;
        margin-left: 22px;

        .content-box {
            padding: 10px 20px 0 20px;
        }
    }
}

.top-title {
    padding: 20px;
    border-bottom: 1px solid rgba(228, 231, 237, 1);
    display: flex;
    justify-content: space-between;

    .text {
        font-size: 18px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(48, 49, 51, 1);
    }

    .actions {
        text-align: right;

        .action,
        .iconfont {
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(144, 147, 153, 1);
        }

        .action {
            margin-left: 22px;
        }
    }
}

.no-border {
    border-bottom: none;
}

.title {
    font-size: 14px;
    font-family: Microsoft YaHei;
    color: rgba(96, 98, 102, 1);
}

.consult {
    .top {
        background: rgba(246, 247, 251, 1);
        border: 1px solid rgba(228, 231, 237, 1);
        border-radius: 5px 5px 0 0;

        .select-all {
            font-size: 13px;
            padding: 14px;
        }
    }
    .el-tree {
        height: 600px;
        overflow: auto;
    }
}

.acitons {
    padding: 0 60px;

    .item {
        text-align: center;
        font-size: 27px;
        color: rgba(192, 196, 204, 1);
        line-height: 2;
        cursor: pointer;
    }
}

.alarm-show {
    position: relative;
    margin-bottom: 10px;

    .pic {
        height: 80px;
    }

    .help {
        position: absolute;
        top: 0;
        margin-left: 4px;
        font-size: 20px;
        color: rgba(192, 196, 204, 1);
        cursor: pointer;
    }
}
</style>
<style>
.warning-made-home {
    .left-box {
        .el-input__inner {
            border-radius: 16px;
        }
    }

    .red-head {
        &.warning {
            .head .title-big {
                padding-top: 10px;
            }
        }

        &.alarm {
            .head .title-big {
                padding-top: 10px;
            }
        }
    }
}
</style>
