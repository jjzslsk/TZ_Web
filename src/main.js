// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './app'
import router from './router'
import store from './store'
import 'normalize.css/normalize.css'
import Clipboard from 'clipboard';  
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/style.css'
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
import VueContextMenu from 'vue-contextmenu'
Vue.use(VueContextMenu)
import {
    Button,
    Menu,
    Submenu,
    MenuItem,
    MenuItemGroup,
    RadioGroup,
    Radio,
    Checkbox,
    DatePicker,
    TimeSelect,
    TimePicker,
    Row,
    Col,
    Popover,
    Dialog,
    Form,
    FormItem,
    Input,
    InputNumber,
    ButtonGroup,
    RadioButton,
    Card,
    Collapse,
    Cascader,
    CollapseItem,
    Table,
    TableColumn,
    Upload,
    Notification,
    Pagination,
    MessageBox,
    Message,
    Loading,
    Select,
    Option,
    Transfer,
    Container,
    Header,
    Aside,
    Main,
    Badge,
    Scrollbar,
    CheckboxButton,
    CheckboxGroup,
    Tabs,
    TabPane,
    Tree,
    Slider,
    Switch,
    Steps,
    Step,
    Image,
    Timeline,
    TimelineItem,
    Calendar,
    Divider,
    Progress,
    Tag,
    Tooltip
} from 'element-ui'
const VueUploadComponent = require('vue-upload-component');
Vue.component('file-upload', VueUploadComponent);
// import CommonComponents from '@/components/'
import * as CommonComponents from '@/components/'
Object.entries(CommonComponents).forEach(([k, v]) => {
    Vue.component(v.name || k, v)
})

import * as filter from '@/common/filter'
Object.entries(filter).forEach(([k, v]) => {
    Vue.filter(k, v)
})

// 加载组件
const components = [
    Menu,
    Submenu,
    Button,
    MenuItem,
    MenuItemGroup,
    RadioGroup,
    Radio,
    RadioButton,
    Checkbox,
    DatePicker,
    TimeSelect,
    TimePicker,
    Row,
    Col,
    Popover,
    Dialog,
    Form,
    FormItem,
    Input,
    InputNumber,
    ButtonGroup,
    Card,
    Cascader,
    Collapse,
    CollapseItem,
    Table,
    TableColumn,
    Upload,
    Pagination,
    Select,
    Option,
    Transfer,
    Container,
    Header,
    Aside,
    Main,
    Badge,
    Scrollbar,
    CheckboxButton,
    CheckboxGroup,
    Tabs,
    TabPane,
    Tree,
    Slider,
    Switch,
    Steps,
    Step,
    Image,
    Timeline,
    TimelineItem,
    Calendar,
    Divider,
    Progress,
    Tag,
    Tooltip
]
components.map((v, i) => {
    Vue.component(v.name, v)
})
Vue.use(Loading.directive)
Vue.prototype.$notify = Notification
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
Vue.prototype.$loading = Loading.service
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.Clipboard=Clipboard;

Vue.$message = Message

Vue.config.productionTip = false
Vue.config.devtools = true

/* eslint-disable no-new */
const mainVue = new Vue({
    el: '#app',
    router,
    store,
    methods: {
        showLoading() {
            return this.$loading({
                lock: true,
                background: 'rgba(0, 0, 0, 0)'
            })
        }
    },
    render: h => h(App)
})
window.mainVue = mainVue;

let loading;
mainVue.$on("loading", function(counts) {
    this.$nextTick(() => {
        loading = mainVue.showLoading(counts);
    })
});
mainVue.$on("all-loaded", function(counts) {
    this.$nextTick(() => {
        if (loading) {
            loading.close();
            loading = null;
        }
    })
});