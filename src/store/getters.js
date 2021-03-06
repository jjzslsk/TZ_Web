const mapSubmodulesGetters = function(submoduleName, getters) {
    if (typeof(getters.reduce) === 'function') {
        return getters.reduce((p, val) => {
            p[val] = (state, getters) => getters[`${submoduleName}/${val}`]
            return p
        }, {});
    } else {
        return Object.entries(getters).reduce((p, [key, val]) => {
            p[val] = (state, getters) => getters[`${submoduleName}/${key}`]
            return p
        }, {});
    }
}
export default {
    ...mapSubmodulesGetters('account', {
        "name": "accountName",
        "orgId": "accountOrgId"
    }),
    ...mapSubmodulesGetters('menu', {
        'menus': 'menus',
        'buttons': 'authButtons',
        'logo': 'mainLogo',
        'logobg': 'mainLogobg',
        'after': 'mainAfter'
    })
};
