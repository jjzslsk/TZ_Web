<template>
<el-dialog class="dialog common primary point-selector" :visible.sync="visibleDialog" :close-on-click-modal="false" :showClose="showClose" :width="width">
    <div slot="title" class="header">
        <span class="title">{{title}}</span>
        <span class="sub"></span>
        <div class="iconfont iconshanchu closer el-icon-close" @click="$emit('update:visible', false)"></div>
    </div>
    <slot></slot>
    <div slot="footer" class="dialog-footer">
        <slot name="footer-prepend"></slot>
        <el-button @click="$emit('update:visible', false)" v-if="secondaryText">{{secondaryText}}</el-button>
        <el-button type="primary" :disabled="$attrs.confirmDisabled" @click="$emit('confirm')" v-if="primaryText">{{primaryText}}</el-button>
    </div>
</el-dialog>
</template>

<script>
export default {
    name: 'CDialog',
    props: {
        visible: Boolean,
        showClose: Boolean,
        title: {
            type: String,
            default: ''
        },
        width: String,
        secondaryText: {
            type: String,
            default: '取 消'
        },
        primaryText: {
            type: String,
            default: '确 定'
        }
    },
    watch: {
        visible(val) {
            this.visibleDialog = val;
        },
        visibleDialog(val) {
            this.$emit('update:visible', val);
        }
    },
    data() {
        return {
            visibleDialog: this.visible
        };
    }
}
</script>

<style scoped>
</style>
