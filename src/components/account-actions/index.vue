<template>
<div class="actions">
    <!-- <el-button type="text" icon="iconfont iconxiugaimima">{{accountName}}</el-button> -->
    <auth-block info="SYSTEM_ROOT" activity="system">
        <el-button type="text" icon="iconfont iconxitongguanli" key="system" v-show="$route.params.activityId != 'system'" @click="$router.push({name:'activity-list',params: { activityId: 'system' }})">系统管理</el-button>
    </auth-block>
    <auth-block info="ACTIVITY_LIST2">
        <el-button type="text" icon="iconfont iconxitongguanli" @click="$router.push({name:'activity-list'})">测试无权限</el-button>
    </auth-block>
    <!-- <el-button type="text" icon="iconfont iconxitongguanli" key="activities" v-show="$route.name != 'welcome'" @click="$router.push({name:'welcome'})">选择活动</el-button> -->
    <!-- <auth-block info="CHANGE_PASSWORD">
        <el-button type="text" icon="iconfont iconmima1" @click="onClickChangePass">修改密码</el-button>
    </auth-block> -->
    <!-- <el-button type="text" class="menu-tools" icon="iconfont el-icon-s-unfold" @click="isTools"></el-button> -->
    <i class="el-icon-user-solid menu-pass icon-clock" @click="isTools"></i>
    <el-tooltip class="item" effect="light" :content="clockState? '打卡完毕':'点击打卡?'" placement="top">
      <!-- <div class="timeline-event" @click.stop="timelineEvent(activity)"></div> -->
      <el-button type="text" class="menu-pass" :class="clockState? 'success-clock':''" @click="signClick">
          {{accountName}}
      </el-button>
    </el-tooltip>
    <el-button type="text" class="menu-logout" icon="iconfont el-icon-right" @click="onLogout"></el-button>
    <c-dialog title="修改密码" :visible.sync="visibleDialog" :confirmDisabled="confirmDisabled" @confirm="onConfirm">
        <div class="main password-box">
            <el-form class="form" ref="form" v-model="form">
                <el-form-item>
                    <el-input class="input-login" ref="passwordOld" prefix-icon="iconfont iconmima" type="password" v-model="form.passwordOld" placeholder="请输入现在密码" @keyup.native.enter="$refs.password.focus()"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input class="input-login" ref="password" prefix-icon="iconfont iconmima" type="password" v-model="form.password" placeholder="请输入新密码" @keyup.native.enter="$refs.passwordAgain.focus()"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input class="input-login" ref="passwordAgain" prefix-icon="iconfont iconmima" type="password" v-model="form.passwordAgain" placeholder="请再次输入新密码"></el-input>
                </el-form-item>
            </el-form>
        </div>
    </c-dialog>
    <el-dialog class="dialog-box" title="个性化定制" :visible.sync="dialogTableVisibleTools" width="1000px">
        <iframe class="dialog-iframe-tools" v-if="dialogTableVisibleTools" name = "iframeName1" src="../../../static/html/common/tools-list.html" frameborder="0"></iframe>
    </el-dialog>
</div>
</template>

<script>
import {
    mapGetters,
    mapActions
} from 'vuex'
import {
    requestChangePassword,
    requestUserClockIn,
    requestClockInState
} from '@/remote/'
export default {
    data() {
        return {
            clockState:false,
            dialogTableVisibleTools:false,

            form: {
                passwordOld: "",
                password: "",
                passwordAgain: ""
            },
            visibleDialog: false
        }
    },
    created() {
      //html，触发vue方法
      window['vueDefinedMyProp'] = (receiveParams) => {
        this.receiveParamsFromHtml(receiveParams)
      }
    },
    
    computed: {
        confirmDisabled() {
            const {
                form: {
                    passwordOld,
                    password,
                    passwordAgain
                }
            } = this;
            return passwordOld == "" || password == "" || passwordAgain == ""
        },
        ...mapGetters(['accountName'])
    },
    methods: {
        receiveParamsFromHtml(res) {
            this.$emit('fatherMethod',res);
        },
        signClick(){
            requestUserClockIn().then(res=>{
                if(res.success){
                    this.clockState = true
                    this.$message.success(res.message);
                }else{
                    this.$message.warning(res.message);
                }
            })
        },
        isTools(){
            this.dialogTableVisibleTools = true
        },
        onLogout() {
            // this.logout().then(res => {
            //     this.$message.success("已安全退出！");
            //     this.$router.push({
            //         name: 'login'
            //     });
            // });

            const vm = this;
            vm.$confirm('是否确定退出?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const loginData = JSON.parse(localStorage.getItem('loginData'))
                if (loginData !== null) {
                    if (loginData.jwt !== null) {
                        if (loginData.jwt.access_token !== null) {
                            var tokenInfo = loginData.jwt.access_token
                            this.logout({
                                token: loginData.jwt.access_token
                            }).then(res => {
                                this.$message.success("已安全退出！");
                                localStorage.removeItem('loginInfo')
                                localStorage.removeItem('loginData')
                                localStorage.clear();
                                vm.$router.push({
                                    // 'name': 'login'
                                    'name': 'welcome-login'
                                });
                            });
                        }
                    }
                } else {
                    console.log(loginData)

                }

            }).catch(() => {
                // vm.$message({
                //   type: 'info',
                //   message: '取消'
                // });
            });


        },
        onClickChangePass() {
            // 弹出修改密码窗口
            this.visibleDialog = true;
        },
        onConfirm() {
            const {
                form: {
                    passwordOld,
                    password,
                    passwordAgain
                }
            } = this;
            if (password != passwordAgain) {
                this.$message.error("两次输入的密码不一致！");
                return;
            }
            requestChangePassword({
                passwordOld,
                password,
                passwordAgain
            }).then(res => {
                this.$message.success("成功修改密码！");
                this.visibleDialog = false;
            });
        },
        ...mapActions(['ensureAccountInfo', 'logout'])
    },
    mounted() {
        //vue，触发html方法
        // window.frames['iframeName1'].lodaHtmlFn()
        
        this.ensureAccountInfo();
        requestClockInState().then(res=>{
            if(res.code == 1){
                this.clockState = true
            }else if(res.code == 0){
                this.clockState = false
            }else if(res.code == -1){
                this.$message.warning('打卡状态异常');
            }
        })
    },
    watch:{
        dialogTableVisibleTools(val){
            if(!val){
                this.$emit('fatherMethod',{name:'',type:''});
            }
        },
        visibleDialog(val){
            if(!val){
                this.form = {
                    passwordOld: "",
                    password: "",
                    passwordAgain: ""
                }
            }
        }
    }
}
</script>

<style scoped>
.actions {
    outline: 0;
    /* width: 329px; */
    height: 32px;
    /* background: rgba(1, 65, 172, 0.35); */
    border-radius: 16px;
    position: absolute;
    top: 27px;
    right: 20px;
    /* padding-left: 15px;
    padding-right: 15px; */
    display: flex;
    
    .success-clock{
        color: #fff !important;
    }
    .icon-clock {
        cursor:pointer;
        color: #CCE1FE;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
    }

    .el-button {
        color: #CCE1FE;
        font-size: 14px;
        font-weight: 400;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 0;
        flex: auto;
        margin-left: 15px;
        margin-right: 15px;
        .iconfont {
            font-size: 18px;
        }
    }
}

.form {
    width: 347px;
    padding: 80px;
    margin: auto;
}


</style>
<style lang="">
.password-box {
    background-color: rgb(197, 196, 196);
    color: #333;
    .el-input__inner{
        background: #919191;
    }
}
.menu-tools {
    display: flex;
    margin: 0 !important;
    .iconfont{
        font-size: 20px !important;
    }
}
.menu-pass {
    margin: 0  3px!important;
    .iconfont{
        font-size: 20px !important;
    }
}
.menu-logout {
    margin: 0 5px 0 4px!important;
    .iconfont{
        font-size: 20px !important; 
    }
}
.dialog-box .el-dialog__header{
    /* background: #02376d; */
    .el-dialog__title{
        /* color: #fff; */
    }
    .el-dialog__close {
        /* color: #fff; */
    }
}
.dialog-box .el-dialog__body{
    display: flex;
    justify-content: center;
    padding: 0 0 20px 0;
    /* background: #02376d; */
}
.dialog-box .dialog-iframe-tools {
    min-width: 900px;
    height: 570px;
}
</style>