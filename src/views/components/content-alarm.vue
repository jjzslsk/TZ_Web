<template>
<div class="main">
    <p>{{dataInner.XXXPROP_RED_HEAD_TITLE}}{{dataInner.XXXPROP_RED_HEAD_CONTENT}}</p>
    <p>图标：<img-alarm class="alarm" :info="dataInner|alermInfo"></img-alarm>
    </p>
    <div>防御指南：</div>

    <!-- <p v-for="(text,index) in dataInner.XXXPROP_RED_HEAD_GUID">{{index+1}}.{{text}}</p> -->
    <p v-for="(text,index) in guids" :key="index">{{text}}</p>
    <!-- <p>1.相关部门和单位按照职责做好防大雾准各工作；</p>
        <p>2.加强交通管理，保障交通安全；</p>
        <p>3.驾驶人员注意雾的变化，小心驾驶；</p>
        <p>4.户外活动注意安全。</p> -->

    <table class="sign-info">
        <tr>
            <td class="pr1em">预报员签名：{{dataInner.XXXPROP_RED_HEAD_USER}}</td>
            <td>签发人签名：许茂利</td>
        </tr>
        <tr>
            <td class="pr1em">制作时间：{{dataInner.XXXPROP_RED_HEAD_PUB_TIME|addDate('-0:5')|transformDate('HH时mm分')}}</td>
            <td>签发时间：{{dataInner.XXXPROP_RED_HEAD_PUB_TIME|addDate('0:5')|transformDate('YYYY年MM月DD日HH时mm分')}}</td>
        </tr>
    </table>
</div>
</template>

<script>
import {
    transformAlarmsInfo
} from "@/common/tools/"
export default {
    props: ['data'],
    computed: {
        dataInner() {
            return this.data || {
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
        guids() {
            const {
                dataInner: {
                    XXXPROP_RED_HEAD_GUID = ""
                }
            } = this;
            return XXXPROP_RED_HEAD_GUID.trim().split("\n")
        }
    },
    filters: {
        alermInfo(val) {
            if (val) {
                return transformAlarmsInfo({
                    code: val.code,
                    type: val.XXXPROP_TRACE_ALARM_TYPE,
                    level: val.level
                })
            }
        }
    }
}
</script>

<style lang="css" scoped>
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
</style>
