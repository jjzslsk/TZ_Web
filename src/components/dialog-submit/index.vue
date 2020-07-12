<template>
<c-dialog :title="title" :visible.sync="visibleDialog" :confirmDisabled="confirmDisabled" :primary-text="primaryText" @confirm="onConfirm">
    <div class="main">
        <slot></slot>
    </div>
</c-dialog>
</template>
<script>
import CDialog from '@/components/c-dialog/index.vue'
import * as remote from '@/remote/'
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
        },
        primaryText: String
    },
    data() {
        return {
            visibleDialog: this.visible,
        }
    },
    // computed: {
    //     confirmDisabled() {
    //         return false;
    //     }
    // },
    components: {
        CDialog
    },
    watch: {
        visible(val) {
            this.visibleDialog = val;
        },
        visibleDialog(val) {
            this.$emit('update:visible', val);
        }
    },
    methods: {
        onConfirm() {
            const vm = this;
            const payload = this.getPayload();
            remote[this.remote](payload).then(res => {
                vm.visibleDialog = false;
                res.message && vm.$message.success(res.message);
                vm.$emit("success", res);
            })
        },
    }
}
</script>

<style scoped>
.main {
    padding: 30px;
}
</style>
