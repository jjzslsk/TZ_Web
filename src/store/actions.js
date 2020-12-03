import {
    requestLogout
} from '@/remote/'
const mapSubmodulesActions = function(submoduleName, actions) {
    const actionsMap = Object.entries(actions).reduce((p, [key, val]) => {
        p[val] = function({
            dispatch
        }, ...args) {
            return dispatch(`${submoduleName}/${key}`, ...args)
        }
        return p
    }, {});
    return actionsMap;
}
export default {
    logout({
        dispatch
    },token) {
        return requestLogout(token).then(res => {
            return Promise.all([dispatch('account/reset'), dispatch('menu/reset')])
        })
    },
    getAuthButtonsOfActivity({
        getters
    }, {
        id
    }) {
        return getters.menus[id] || []
    },
    ...mapSubmodulesActions('account', {
        'gotInfo': 'gotAccountInfo',
        'getInfo': 'getAccountInfo',
        'ensureInfo': 'ensureAccountInfo'
    }),
    ...mapSubmodulesActions('menu', {
        'getInfo': 'getMenuInfo',
        'ensureMenuOfSystem': 'ensureMenuOfSystem'
    })
}
