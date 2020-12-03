<template>
<div class="login">
    <div class="main">
        <system-logo></system-logo>
         <div class="logo-box">
            <img src="../../assets/img/logo.png" class="logo">
            <span class="title-text">台州市县综合气象业务一体化平台</span>
        </div>
        <el-form class="form" ref="form" :model="form">
            <el-form-item class="user-box">
                <el-input class="input-login" prefix-icon="iconfont iconxiugaimima" v-model="form.uid" placeholder="请输入用户名" ref="oldPass-input" @keyup.native.enter="$refs.password.focus()">
                    <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
                </el-input>
            </el-form-item>
            <el-form-item class="user-box">
                <el-input class="input-login" ref="password" prefix-icon="iconfont iconmima" type="password" v-model="form.password" placeholder="请输入密码" @keyup.native.enter="onSubmit">
                    <i slot="prefix" class="el-input__icon el-icon-key"></i>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="signIn" type="" @click="onSubmit">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</div>
</template>

<script>
import {
    mapActions,mapGetters
} from 'vuex'
import {
    requestLogin,
    requestMyUserJob
} from '@/remote/'
import SystemLogo from './components/system-logo.vue'
export default {
    components: {
        SystemLogo
    },
    data() {
        return {
            form: {
                uid:'',
                password:''
            }
        }
    },
    mounted(){
        this.$nextTick(()=>{ //自动获取焦点 element组件autofocus失效
             this.$refs['oldPass-input'].$refs.input.focus()
         })
    },
    methods: {
        // onSubmit() {
        //     // debugger;
        //     const vm = this;
        //     // console.log('vm.form', vm.form);
        //     requestLogin(vm.form).then(res => {
        //         // res.data
        //         return this.gotAccountInfo({name:res.data[0].userName});
        //     }).then(res => {
        //         const rf = vm.$route.query.rf;
        //         if (rf) {
        //             vm.$router.push({
        //                 'path': decodeURIComponent(rf)
        //             });
        //         } else {
        //             vm.$router.push({
        //                 'name': 'welcome'
        //             });
        //         }
        //     })
        // },

        onSubmit() {
            const vm = this;
            // requestLogin(vm.form).then(res => {
                // if(res.success){
                    // localStorage.setItem('userinfo',JSON.stringify(res.data))
                    // const userinfo = JSON.parse(localStorage.getItem('userinfo'))
                    // vm.$router.push({
                    //     'name': 'welcome'
                    // });
                    //查询用户信息
                    // requestLogin(vm.form).then(res => {
                    //     if(res.success){

                    //     }
                    // })
                // }
            // })

            requestLogin(vm.form).then(res => {
            //     return vm.gotAccountInfo(res.data);
            // }).then(res => {
                if(res.success && res.data) {
                    // let param = {
                    //     userinfo:res.data
                    // }
                    // vm.gotAccountInfo(param)
                    //
                    localStorage.setItem('loginData', JSON.stringify(res.data))
                    const loginData = JSON.parse(localStorage.getItem('loginData'))

                    //获取岗位信息
                    requestMyUserJob({loginUserId:loginData.userId}).then(res=>{
                        localStorage.setItem('userJob', JSON.stringify(res.data))
                    })
                    //获取用户和菜单信息
                    vm.gotAccountInfo(res.data).then((res) => {
                        vm.getAccountInfo().then(res =>{
                            vm.getMenuInfo().then(res=>{
                                if(res.success && res.data){
                                    vm.$router.push({
                                        'name': 'integrated-management'
                                    });
                                }
                            })
                        });
                    })
                }

                // const rf = vm.$route.query.rf;
                // console.log('rf::',rf)

                // if (rf) {
                //     vm.$router.push({
                //         'path': decodeURIComponent(rf)
                //     });
                // } else {
                //     vm.$router.push({
                //         'name': 'welcome'
                //     });
                // }
            })

        },
        ...mapActions(['gotAccountInfo','getAccountInfo','getMenuInfo']),
        // ...mapGetters(['accountName'])
    },
}
</script>

<style scoped>
.login {
    background-image: url('../../assets/img/login-bg_new.jpg');
    background-color: rgb(0, 87, 156);
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: left bottom;
}
.logo-box{
    text-align:center;
    margin-bottom: 55px;
    .logo{
        width: 60px;
        height: 53px;
        color:rgba(255,255,255,1);
        vertical-align:middle;
        margin-right:10px;
    }
    .title-text{
        font-size:42px;
        font-family:Microsoft YaHei;
        font-weight:bold;
        color:rgba(255,255,255,1);
        vertical-align:middle;

    }
}
.main {
    position: relative;
    top: 50%;
    transform:translateY(-50%);
    /* margin-top: -314px;
    left: 50%;
    margin-left: -550px; */
}
.main h1 {
    text-align: center;
    color: #fff;
    font-size: 60px;
    margin: 0;
}

@media (max-width: 1090px) {
    .main {
        left: 0;
        margin-left: 0;
    }
}

.form {
    /* width: 347px;
    padding-top: 100px;
    margin: auto; */
    width:739px;
    height:103px;
    background:rgba(0,0,0,0.4);
    border-radius:9px;
    position:relative;
    top:50%;
    left:50%;
    transform:translateX(-50%);
    display:flex;
    padding:27px 43px;
    box-sizing:border-box;
    .signIn {
        display: block;
        width: 100%;
        height: 50px;
        /* margin-top: 23px; */
        margin-left:10px;
        font-size: 18px;
        font-family: MicrosoftYaHei-Bold;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        background: #FA9901;
        border: 0;
        border-radius: 4px;

        letter-spacing: 5px;
    }
     .user-box{
        width:280px;
        height:48px;
        line-height:48px;
        background:rgba(255,255,255,1);
        border-radius:4px;
        display:flex;
        margin-right:10px;
        color: #606266;
    }
}
</style>
<style>
.login .el-form-item__content{
    width: 100%;
}
</style>
