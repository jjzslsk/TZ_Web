import Vue from 'vue'
import * as mutactionNames from './mutaction-names'
export default {
    [mutactionNames.gotInfo]: function(state, payload) {
        Object.entries(payload).forEach(([key, val]) => Vue.set(state.menus, key, val))
    },
    [mutactionNames.reset]: function(state) {
        state.menus = {};
    }
};
