<template>
<div class="red-head" :class="type">
    <template v-if="type=='warning'">
        <div class="head">
            <div class="title-big">天气警报</div>
            <div class="publish-left">{{data.publishOrg}}</div>
            <div class="publish-right">流水号：{{dataInner.XXXPROP_RED_HEAD_NO}}</div>
            <div class="split"></div>
        </div>
        <content-weather :form="data" :data="dataInner"></content-weather>
    </template>
    <template v-else>
        <div class="head">
            <div class="title-big">气象灾害预警信号发布通知单</div>
            <div class="sub-title">{{dataInner.XXXPROP_RED_HEAD_NO}}</div>
            <div class="publish-left">{{dataInner.XXXPROP_RED_HEAD_ORGANIZE}}</div>
            <div class="publish-right">{{dataInner.XXXPROP_RED_HEAD_PUB_TIME|transformDate('YYYY年MM月DD日')}}</div>
            <div class="split"></div>
        </div>
        <content-alarm :data="dataInner"></content-alarm>
    </template>
</div>
</template>
<script>
import contentWeather from './content-weather.vue'
import contentAlarm from './content-alarm.vue'
export default {
    components: {
        contentWeather,
        contentAlarm
    },
    props: {
        data: Object,
        form: Object,
        type: String
    },
    computed: {
        dataDefault() {
            return this.type == 'warning' ? {
                XXXPROP_RED_HEAD_NO: "001",
                XXXPROP_RED_HEAD_PUB_TIME: "202002121530",
                XXXPROP_RED_HEAD_TYPE: "寒潮警报和大风警报",
                XXXPROP_RED_HEAD_CONTENT: "北方强冷空气将于今天傍晚起自北而南影响我市。受其影响，全市有一次明显的降温和大风天气过程。日平均气温过程降温幅度大部地区可达10-12度；后天早晨最低气温：北部地区0-2度，有霜冻，其它地区3-5度，局部有霜或暗霜；今天夜里到明天沿海海面和内陆部分地区分别有8-9级和6-7级偏北大风。希有关方面注意。",
                XXXPROP_RED_HEAD_ALL_READY: "目前，天台、仙居已发布寒潮黄色预警信号，天台、椒江、路桥已发布大风黄色预警信号。",
                XXXPROP_RED_HEAD_USER: "贲海荣",
                XXXPROP_RED_HEAD_SEND_TIME: "202002121530"
            } : {
                XXXPROP_RED_HEAD_NO: "[2020]2-A大雾黄",
                XXXPROP_RED_HEAD_ORGANIZE: "台州市气象台",
                XXXPROP_RED_HEAD_PUB_TIME: "202001060858",
                XXXPROP_RED_HEAD_TITLE: "台州气象台2020年01月06日08时58分发布大雾黄色预警信号",
                XXXPROP_RED_HEAD_CONTENT: "台州气象台2020年01月06日08时58分发布大雾黄色预警信号12小时内可能出现能见度小于500米的雾，或者已经出现能见房小于500米、大于等于200米的雾并将持续.",
                XXXPROP_TRACE_ALARM_TYPE: "大雾",
                level: "黄色",
                XXXPROP_RED_HEAD_USER: "当前用户",
                // XXXPROP_RED_HEAD_GUID: [
                //     "相关部门和单位按照职责做好防大雾准各工作；",
                //     "加强交通管理，保障交通安全；",
                //     "驾驶人员注意雾的变化，小心驾驶；",
                //     "户外活动注意安全。"
                // ],
                XXXPROP_RED_HEAD_GUID: `
                            1.相关部门和单位按照职责做好防大雾准备工作；
                            2.加强交通管理，保障交通安全；
                            3.驾驶人员注意雾的变化，小心驾驶；
                            4.户外活动注意安全。
                        `
            }
        },
        dataInner() {
            return this.data || this.dataDefault
        }
    }
}
</script>
<style scoped>
.red-head {
    width: 530px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    /* padding: 0 45px; */
    margin: auto;
    background: rgba(255, 255, 255, 1);

    .head {
        .title-big {
            text-align: center;
            color: rgba(255, 75, 75, 1);
        }

        .publish-left,
        .publish-right {
            font-size: 14px;
            color: rgba(144, 147, 153, 1);
            line-height: 30px;
        }

        .publish-left {
            float: left;
        }

        .publish-right {
            float: right;
        }

        .split {
            height: 5px;
            border: 0 solid #FF4B4B;
            border-top-width: 4px;
            border-bottom-width: 1px;
            clear: both;
        }
    }

    .main {
        padding-top: 40px;
        padding-bottom: 50px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(96, 98, 102, 1);
        line-height: 28px;

        p {
            margin: 0;
            text-indent: 2em;
        }

        .from {
            margin-top: 60px;
        }
    }

    &.warning {
        .title-big {
            font-size: 60px;
            padding-top: 70px;
            margin-bottom: 30px;
        }

        .to {
            margin-bottom: 40px;
        }

        p {
            margin-bottom: 40px;
        }
    }

    &.alarm {
        .title-big {
            padding-top: 90px;
            font-size: 30px;
            margin-bottom: 10px;
        }

        .sub-title {
            font-size: 13px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(96, 98, 102, 1);
            text-align: center;
            margin-bottom: 41px;
        }

        .alarm {
            width: 98px;
            vertical-align: top;
            padding-top: 30px;
            padding-bottom: 20px;
        }

        .sign-info {
            width: 100%;
            margin-top: 60px;
        }

    }
}
</style>
