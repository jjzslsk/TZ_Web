<template>
<dialog-submit :title="title" :visible.sync="visibleDialog" :confirmDisabled="confirmDisabled" :remote="remote" :getPayload="getPayload" @success="res=>$emit('success', res)">
    <el-form>
        <slot></slot>
    </el-form>
</dialog-submit>
</template>
<script>
import DialogSubmit from '@/components/dialog-submit/index.vue'
export default {
    props: {
        'value': Object,
        'visible': Boolean,
        'confirmDisabled': Boolean,
        'remote': String,
        'getPayload': Function,
        'title': {
            type: String,
            default: '请输入必要的数据'
        }
    },
    data() {
        return {
            visibleDialog: this.visible,
        }
    },
    components: {
        DialogSubmit
    },
    watch: {
        visible(val) {
            this.visibleDialog = val;
        },
        visibleDialog(val) {
            this.$emit('update:visible', val);
        }
    }
}
</script>

<style scoped>
.main {
    padding: 30px;
}
</style>
