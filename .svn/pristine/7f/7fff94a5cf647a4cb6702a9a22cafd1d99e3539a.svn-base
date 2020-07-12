import {
    requestMyAccountInfo
} from '@/remote/'
import * as mutactionNames from './mutaction-names'
export default {
    gotInfo: function({
        commit,
        state
    }, payload) {
        commit(mutactionNames.gotInfo, payload);
    },
    getInfo: function({
        dispatch,
        state
    }) {
        const loginData = JSON.parse(localStorage.getItem('loginData',))
        // const userData = {
        //     userId:loginData.userId,
            // Authorization:loginData.jwt.access_token
        // }
        const pro = requestMyAccountInfo({id:loginData.userId}).then(res => {
            state.promises.name = null
            if(res.success && res.data) {
            //    localStorage.setItem('loginInfo',JSON.stringify(res.data))
            //    const loginInfo = JSON.parse(localStorage.getItem('loginInfo',))
            //    console.log('requestMyAccountInfo:',loginInfo)
            }
            // localStorage.setItem('loginInfo',JSON.stringify(res.data))
            //    const loginInfo = JSON.parse(localStorage.getItem('loginInfo',))
            //    console.log('requestMyAccountInfo:',loginInfo)
            // // return res
            return dispatch('gotInfo', res.data)
        }).catch(err => {
            state.promises.name = null
            return Promise.reject(err)
        })
        state.promises.name = pro
        return pro
    },
    reset: function({
        commit
    }) {
        commit(mutactionNames.reset);
    },
    ensureInfo: function({
        dispatch,
        state
    }) {
        if (state.promises.name) {
            return state.promises.name
        } else if (state.name) {
            return Promise.resolve(state)
        } else {
            return dispatch('getInfo')
        }
        // return Promise.resolve(state)
    }
};
