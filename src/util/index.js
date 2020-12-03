import Vue from 'vue'
const showMessage = message => Vue.$message({
    message,
    type: 'error'
})
let proGoLogin;
export const catchError = function(error) {
    if (error.response) {
        const infos = {
            '400': () => {
                // Vue.$message({
                //     message: error.response.data.message || '请求参数异常',
                //     type: 'error'
                // });
                // Vue.$toast({
                //     position: 'top',
                //     message: error.response.data.message || '请求参数异常'
                //     // iconClass: 'icon icon-success'
                // })
                // MessageBox.alert(error.response.data.message || '请求参数异常').then(action => {
                //     console.log(action);
                // });
                showMessage(error.response.data.message || '请求参数异常')
            },
            '401': () => {
                // sessionStorage.removeItem('user')
                // Vue.$message({
                //     message: error.response.data.message || '密码错误或账号不存在！',
                //     type: 'warning',
                //     onClose: function() {
                //         location.reload();
                //     }
                // });
                // Vue.$toast({
                //     position: 'top',
                //     message: error.response.data.message || '密码错误或账号不存在！'
                //     // iconClass: 'icon icon-success'
                // })
                // MessageBox.alert(error.response.data.message || '密码错误或账号不存在！').then(action => {
                //     location.reload();
                // });
                if (!proGoLogin && mainVue.$route.name != 'welcome-login') {
                    showMessage(error.response.data.message || '请先登录')
                    proGoLogin = mainVue.$route.fullPath;
                    window.mainVue.$router.push({
                        name: 'welcome-login',
                        query: {
                            'rf': encodeURIComponent(mainVue.$route.fullPath)
                        }
                    }, res => {
                        proGoLogin = null;
                        return res;
                    }, err => {
                        proGoLogin = null;
                        return Promise.reject(err)
                    })
                }
                // debugger
            },
            '403': () => {
                // sessionStorage.removeItem('user')
                // Vue.$message({
                //     message: error.response.data.message || '无访问权限，请联系企业管理员',
                //     type: 'warning'
                // });
                // Vue.$toast({
                //     position: 'top',
                //     message: error.response.data.message || '无访问权限，请联系管理员！'
                //     // iconClass: 'icon icon-success'
                // })
                // MessageBox.alert(error.response.data.message || '无访问权限，请联系企业管理员！').then(action => {
                //     console.log(action);
                // });
                showMessage(error.response.data.message || '密码错误或账号不存在！')
            }
        }
        if (infos.hasOwnProperty(`${error.response.status}`)) {
            infos[`${error.response.status}`]()
        } else {
            // Vue.$message({
            //     message: error.response.data.message || '服务端异常，请联系技术支持',
            //     type: 'error'
            // });
            // Vue.$toast({
            //     position: 'top',
            //     message: error.response.data.message || '服务端异常，请联系技术支持。'
            //     // iconClass: 'icon icon-success'
            // })
            // MessageBox.alert(error.response.data.message || '服务端异常，请联系技术支持。').then(action => {
            //     console.log(action);
            // });
            showMessage(error.response.data.message || '服务端异常，请联系技术支持')
        }
    } else {
        if (error.message === 'Network Error') {
            showMessage(`网络错误，请稍后再试`)
        } else {
            showMessage(`请求异常，请联系技术支持(${error.message})`)
        }
    }
    return Promise.reject(error)
}


export const getColorOfArr = colorArr => colorArr.slice(0, 3).reduce((p, c) => {
    const d = c.toString(16)
    return p + "00".substr(d.length) + d
}, "#")
