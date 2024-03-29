import {
    requestMenu
} from '@/remote/'
import * as mutactionNames from './mutaction-names'
export default {
    gotInfo: function({
        commit
    }, payload) {
        return commit(mutactionNames.gotInfo, payload);
    },
    getInfo: function({
        dispatch
    }, payload) {
        return requestMenu(payload).then(res => {
            // const transformMenuItems = items => {
            //     if (items) {
            //         items.forEach(item => {
            //             item.index = item.index ? item.index.replace(/{{activityId}}/g, payload.id) : item.index;
            //             transformMenuItems(item.submenu);
            //             return item;
            //         })
            //     }
            // }
            // transformMenuItems(res.data.menu);
            localStorage.setItem('headerMenu',JSON.stringify(res.data.list))
            return res;
        })
        // .then(res => dispatch('gotInfo', {
        //     [payload.id]: res.data
        // }))
    },
    reset: function({
        commit
    }) {
        commit(mutactionNames.reset)
    },
    // ensureMenuOfSystem: function({
    //     dispatch
    // }) {
    //     return dispatch('getInfo', {
    //         id: "system"
    //     })
    // }
};
