<template>
    <div class="progress-box">
        <div class="progress-wrap">
            <template v-for="(item,index) in progress">
                <div class="progress-item" :key="index">
                    <el-progress :show-text='false' :key="index" type="circle" :percentage="item.amount"></el-progress>
                    <div class="content" >
                        <div class="text label">{{item.label}}</div>
                        <div class="text amount">{{item.amount}}</div>
                        <div class="text character">{{item.content}}</div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    props: ['progress'],
    methods: {

    }
}
</script>
<style lang="css" scoped>
.progress-wrap {
    display: flex;
    .progress-item {
        position: relative;
        .content {
            text-align: center;
            position: absolute;
            top: 38%;
            left: 30%;
            .text {
                display: block;
                overflow: hidden;
                margin-bottom: 12px;
            }
        }
    }
}
</style>
