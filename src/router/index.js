import Vue from 'vue'
import Router from 'vue-router'
import fullPath from '@/router/full-path'
Vue.use(Router)
const router = new Router({
    routes: fullPath
})
router.beforeEach((to, from, next) => {
    if (to.name === "outlink") {
        // window.location.href = to.params.out
        window.open(to.params.out)
        next(false)
    } else {
        console.log('matched1',to.matched)
        if (to.matched.length === 0) {
            // Vue.$message.error("找不到该页面")
            Vue.$message.warning("正在开发中")
            if (from.name) {
                next(false)
            } else {
                next({
                    name: 'welcome'
                });
            }
        } else {
            if (/{{activityId}}/.test(to.fullPath)) {
                const {
                    name,
                    params,
                    query
                } = to;
                next({
                    name,
                    params: {
                        ...params,
                        activityId: from.params.activityId
                    },
                    query
                });
            } else {
                next();
            }
        }
    }
})
export default router
