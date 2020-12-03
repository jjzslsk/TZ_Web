import * as mutactionNames from './mutaction-names'
export default {
    [mutactionNames.gotInfo]: function(state, payload) {
        // console.log('lsk:',mutactionNames.gotInfo)
        // console.log(state)
        // console.log(payload)
        // let test = Object.assign(state, payload)
        // console.log('payload::1',payload)
        // state.name = payload.userId;
        // state.promises.name = payload.userId;

        localStorage.setItem('loginInfo', JSON.stringify(payload))
        Object.assign(state, payload)
    },
    [mutactionNames.reset]: function(state) {
        state.name = null;
        state.promises.name = null;
    }
};
