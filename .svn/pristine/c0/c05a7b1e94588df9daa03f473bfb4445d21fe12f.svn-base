import {mapGetters} from 'vuex'
export default {
    props: [
        'info', 'activity'
    ],
    computed: {
        authButtonsOfActivity() {
            if (this.menus && this.activity) {
                return this.menus[this.activity]
                    ? this.menus[this.activity].buttons
                    : [];
            } else {
                return this.authButtons;
            }
        },
        ...mapGetters(['menus', 'authButtons'])
    },
    render() {
        const {authButtonsOfActivity} = this;
        if (authButtonsOfActivity && authButtonsOfActivity.includes(this.info)) {
            if (this.$slots.default.length > 1) {
                return (<span>
                    {this.$slots.default}
                </span>)
            } else {
                return this.$slots.default
            }
        } else {
            return null
        }
    }
}
