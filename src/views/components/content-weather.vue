<template>
<div class="main">
    <div class="to">台州电视台、广播电台：</div>
    <p>{{form.orgName}}{{dataInner.XXXPROP_RED_HEAD_PUB_TIME|transformDate("YYYY年MM月DD日HH时mm分")}}发布{{dataInner.XXXPROP_RED_HEAD_TYPE}}，请在收到此通知单后15分钟内在电视节目中播出{{dataInner.XXXPROP_RED_HEAD_TYPE}}，并滚动播出以下内容： </p>
    <p>{{dataInner.XXXPROP_RED_HEAD_CONTENT}}{{dataInner.XXXPROP_RED_HEAD_ALL_READY}}</p>
    <div class="from">
        <div>{{form.orgName}}</div>
        <!-- <div>制 作 人：{{dataInner.XXXPROP_RED_HEAD_USER}}</div>
        <div>签 发 人：翁之梅</div> -->
        <div>制 作 人：{{form.makeUser}}</div>
        <div>签 发 人：{{form.checkUser}}</div>
        <div>发送时间：{{dataInner.XXXPROP_RED_HEAD_SEND_TIME|transformDate("YYYY年MM月DD日HH时mm分")}}</div>
    </div>
</div>
</template>

<script>
export default {
    props: ['data','form'],
    computed: {
        dataInner() {
            return this.data || {
                XXXPROP_RED_HEAD_NO: "001",
                XXXPROP_RED_HEAD_PUB_TIME: "202002121530",
                XXXPROP_RED_HEAD_TYPE: "寒潮警报和大风警报",
                XXXPROP_RED_HEAD_CONTENT: "北方强冷空气将于今天傍晚起自北而南影响我市。受其影响，全市有一次明显的降温和大风天气过程。日平均气温过程降温幅度大部地区可达10-12度；后天早晨最低气温：北部地区0-2度，有霜冻，其它地区3-5度，局部有霜或暗霜；今天夜里到明天沿海海面和内陆部分地区分别有8-9级和6-7级偏北大风。希有关方面注意。",
                XXXPROP_RED_HEAD_ALL_READY: "目前，天台、仙居已发布寒潮黄色预警信号，天台、椒江、路桥已发布大风黄色预警信号。",
                XXXPROP_RED_HEAD_USER: "贲海荣",
                XXXPROP_RED_HEAD_SEND_TIME: "202002121530"
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
</style>
