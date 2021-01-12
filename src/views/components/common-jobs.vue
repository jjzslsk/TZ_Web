<template>
        <el-dialog
        title="请选择值班岗位"
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="beforeClose">
        <el-radio-group v-model="resource" size="small">
            <el-radio border v-for="i in jobs" :label="i.id" :key="i.id">{{i.name}}</el-radio>
        </el-radio-group>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose('cancel')">直接登录</el-button>
            <el-button type="primary" @click="handleClose('submit')">确 定</el-button>
        </span>
        </el-dialog>
</template>

<script>
import {
  requestProductInfoJobs,
  requestMyUserUpdateDutyJob
} from "@/remote/";
export default {
    props: ['data'],
    data() {
      return {
        dialogVisible: false,
        resource: null,
        jobs:null,
        userJob:null,
        loginInfo:null,
      };
    },
    methods: {
      beforeClose(){
          this.dialogVisible = false
          this.$emit('closeDrawer','close')
      },
      handleClose(state) {
          if(state == 'submit'){
              if(!this.resource){
                  this.$message({
                    message: '请选择值班岗位',
                    type: 'warning'
                  });
                  return
              }
              requestMyUserUpdateDutyJob({userId:this.loginInfo.id,jobId:this.resource}).then((res)=>{
                this.dialogVisible = false
                this.$emit('closeDrawer','submit')
              })
          }else if(state == 'cancel'){
                this.dialogVisible = false
                this.$emit('closeDrawer','cancel')
          }
      }
    },
    mounted() {
        this.loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
        this.userJob = JSON.parse(localStorage.getItem('userJob'))
        this.resource = this.userJob.length > 0 ? this.userJob[0].id:null
        // 获取岗位
        requestProductInfoJobs({orgId:this.loginInfo.orgId}).then(res=>{
            this.jobs = res.data.list
            if(this.jobs){
                this.dialogVisible = true
            }
        })
    },
}
</script>

<style lang="postcss" scoped>
    .el-radio-group{
        .el-radio{
            margin-left: 10px;
            margin-right: 10px;
            margin-bottom: 10px;
        }

    }
</style>
