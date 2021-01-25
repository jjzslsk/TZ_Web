<template>
    <div class="progress-box">
        <div class="progress-wrap">
            <template v-for="(item,index) in progress">
                <div class="progress-item" :key="index">
                    <el-progress :status="item.status" :show-text='false' :key="index" type="circle" :percentage="Number(item.amount)"></el-progress>
                    <div class="content" >
                        <div class="text value" :class="item.status + '-color'">{{item.value}}</div>
                        <div class="text label" :style="skin? 'color:#fff;':''">{{item.label}}</div>
                        <div class="text character" :style="skin? 'color:#eee;':''">{{item.content}}</div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    props: ['progress',"skin"],
    methods: {

    },
    mounted(){
        console.log(this.progress)
    },
}
</script>
<style lang="postcss" scoped>
.progress-wrap {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow-y: hidden;
    white-space: nowrap;
    height: 100%;
    width: 100%;
    .progress-item {
    display: inline-block;
        position: relative;
        .content {
            min-width: 150px;
            text-align: center;
            position: absolute;
            top: 30%;
            left: 30px;
            .text {
                display: block;
                overflow: hidden;
                margin-bottom: 8px;
            }
            .value {
                font-size: 24px;
                color: #409EFF;
            }
            .label {
                font-size: 16px;
                color: #303133;
            }
            .character {
                font-size: 16px;
                color: #606266;
            }
            .success-color {color: #13ce66;}
            .warning-color {color: #e6a23c;}
            .exception-color {color: #ff4949;}
        }
    }
    
}
</style>
