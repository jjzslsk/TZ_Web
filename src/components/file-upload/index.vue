<template>
    <div>
        <el-form-item label="文件选择" label-width="120px">
            <el-upload
                class="upload-demo"
                ref="upload"
                :action="schedulingUpload()"
                :before-upload="beforeAvatarUpload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleAvatarSuccess"
                :file-list="fileList"
                :data="uploadParam"
                :limit="1"
                :on-exceed="handleExceed"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <div slot="tip" class="el-upload__tip">只能导入xls/xlsx文件，且不超过2M</div>
            </el-upload>
        </el-form-item>
        <el-form-item v-if="isItem" label="上传时间" label-width="120px">
            <el-date-picker v-model="query.monthTime" format="yyyy-MM" value-format="yyyy-MM" type="month" placeholder="选择月" :picker-options="pickerOptionsYearMonth"></el-date-picker>
        </el-form-item>
        <el-form-item v-if="isItem" label="首席人数" label-width="120px">
          <el-select v-model="query.column" placeholder="请选择">
            <el-option label="0" value="0"></el-option>
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
            <el-option label="4" value="4"></el-option>
            <el-option label="5" value="5"></el-option>
            <el-option label="6" value="6"></el-option>
            <el-option label="7" value="7"></el-option>
            <el-option label="8" value="8"></el-option>
            <el-option label="9" value="9"></el-option>
          </el-select>
        </el-form-item>
    </div>
</template>
<script>
import {
    common,
    witchCommonList,
    withCommonLeftTree
} from '../../views/mixins/index';
export default {
    mixins: [common, witchCommonList, withCommonLeftTree],
    props: {
      queryChild:{
        type:Object,
        default:null
      },
      uploadUrlChild:{
        type:String,
        default:null
      },
      isItem:{
        type:Boolean,
        default:true
      },
    },
    data() {
        return {
            pickerOptionsYearMonth: this.banTime(),
            formItem:{
                fileName:null,
                column:1,
            },
            fileList: [],
            uploadParam:{
                orgId:null,
                monthTime:null,
                column:1,
            },
            query: {
                orgId: '',
                monthTime:'',
                column:1,
            },
            fullscreenLoading: false,
            loginInfo:null,
            loading:null,
        }
    },
    watch:{
        fullscreenLoading(val){
            if(val){
                this.loading = this.$loading({
                lock: true,
                text: '正在导入中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
                });
            }else{
                this.loading.close();
            }
        }
    },
    mounted(){
        const loginInfo = JSON.parse(localStorage.getItem('loginInfo',))
        this.loginInfo = loginInfo
        this.query.monthTime = this.queryChild.monthTime? this.queryChild.monthTime:null
        this.query.typeId = this.queryChild.typeId? this.queryChild.typeId:null
    },
    methods:{
      // 小于当前月分的日期不可选
      banTime() {
        return {
          disabledDate(time) {
            const date = new Date()
            const year = date.getFullYear()
            let month = date.getMonth() + 1
            if (month >= 1 && month <= 9) {
              month = '0' + month
            }
            const currentdate = year.toString() + month.toString()
            const timeyear = time.getFullYear()
            let timemonth = time.getMonth() + 1
            if (timemonth >= 1 && timemonth <= 9) {
              timemonth = '0' + timemonth
            }
            const timedate = timeyear.toString() + timemonth.toString()
            return currentdate > timedate
          }
        }
      },
        parentHandleclick(val){
            this.uploadParam.orgId = this.loginInfo.orgId
            this.$refs.upload.submit();
        },
        uploadInfo(){},
        schedulingUpload(){
            this.uploadParam.monthTime = this.query.monthTime? this.query.monthTime:null
            this.uploadParam.column = this.query.column? this.query.column:null
            this.uploadParam.typeId = this.query.typeId? this.query.typeId:null
            return this.uploadUrlChild
        },
        //文件上传成功时的钩子
        handleAvatarSuccess(res, file) {
        console.log('handleAvatarSuccess:res:',res)
        console.log('handleAvatarSuccess:file:',file)
        // this.imageUrl = URL.createObjectURL(file.raw);
        this.fullscreenLoading = false;
        this.visibleDialogFormItem = false;
        if(res.success){
          this.$message.success(res.message);
        }else{
          this.$message.error(res.message);
        }
        this.formItem = {}
        this.fileList = []
        this.$emit('uploadResults', res,file)
        },

        //上传文件之前的钩子
        beforeAvatarUpload(file) {
        console.log(file)
        console.log(this.uploadParam)
        this.formItem.fileName = file.name
        const isXLS = file.type === 'application/vnd.ms-excel';
        const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isXLS && !isXLSX) {
          this.$message.error('上传文件只能是 xls,xlsx 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 2MB!');
        }
        this.fullscreenLoading = true;
        return (isXLS || isXLSX) && isLt2M;
      },

        //文件列表移除文件时的钩子
      handleRemove1(file, fileList) {
        console.log(file, fileList);
      },
      //点击文件列表中已上传的文件时的钩子
      handlePreview1(file) {
        console.log(file);
      },
      //文件超出个数限制时的钩子
      handleExceed1(files, fileList) {
        // this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      //删除文件之前的钩子
      beforeRemove1(file, fileList) {
        // return this.$confirm(`确定移除 ${ file.name }？`);
      },

      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
    },
}
</script>

<style lang="postcss" scoped>
.upload-demo {
    display: inline-block;
}
.upload-demo {
    .el-upload__tip {
        display: inline;
        margin-left:8px;
    }
}
</style>
