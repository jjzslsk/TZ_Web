<template>
    <div class="form-wrapper input">
        <el-form ref="form" label-width="120px">
            <slot :form="form"></slot>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">提交</el-button>
                <el-button @click="navigateBack">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import * as remote from '@/remote/'
export default {
    props: {
        'remoteGetDetail': String,
        'remotePostUpdate': String,
        'remotePostCreate': String,
        'formatPayload': {
            default: function() {
                return data => data
            }
        }
    },
    data(){
        return  {
            form: {}
        }
    },
        methods: {
        navigateBack() {
            this.$router.go(-1)
        },
        onSubmit() {
            if(!this.form.id){
                remote[this.remotePostCreate](this.form).then(res => {
                    if(res.success){
                        this.$message.success("新增成功");
                        this.navigateBack();
                    }else if(!res.success){
                        this.$message.error('新增失败');
                    }
                });
            }else if (this.form.id){
                remote[this.remotePostUpdate](this.form).then(res => {
                    if(res.success){
                        this.$message.success("编辑成功");
                        this.navigateBack();
                    }else if(!res.success){
                        this.$message.error('编辑失败');
                    }
                });
            }
        },
    },
    mounted() {
        const vm = this;
        const payload = this.formatPayload({
            ...this.$route.query,
            ...this.$route.params
        });
        if (payload.id) {
            remote[this.remoteGetDetail](payload).then(res => {
                const data = res.data[0];
                if (data) {
                    vm.form = {
                        ...data,
                    }
                }
            });
        }
    }
}
</script>

<style scoped>
</style>
