export default {
    menus: state => state.menus,
    buttons: state => {
        return Object.values(state.menus).reduce((p, c) => {
            if (c && c.buttons && c.buttons.map) {
                p.push(...c.buttons);
            }
            return p
        }, [])
    },
    logo: state => state.logo,
    logobg: state => state.logobg,
    after: state => state.after
};
