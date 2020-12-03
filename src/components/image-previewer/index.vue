<template>
<div>
    <el-popover ref="image-previewer" placement="top" trigger="hover">
        <el-card :body-style="{ padding: '0px',background:'#eee' }">
            <img :src="src" class="image">
        </el-card>
    </el-popover>
    <el-button type="text" v-show="src" v-popover:image-previewer>查看图片</el-button>
    <el-button type="text" v-show="!src">无图片</el-button>
</div>
</template>
<script>
export default {
    props: ['src']
}
</script>
