import commonLeftTree from '../components/common-left-tree.vue';
import commonLeftTreeActions from '../components/common-left-tree-actions.vue';
export const common = {
    components: {commonLeftTree, commonLeftTreeActions}
}
import * as remote from '@/remote/'
import {
    requestMonitorAllList,
    requestGeojsonOfKey
} from '@/remote/';
import {
    transformAlarmsInfo,
    transformAreaCode
} from "@/common/tools/"

// 包含 search
export const withCommonSearch = {
    data() {
        return {
            query: {}
        };
    },
    watch: {
        "$route.query": {
            handler: function(data) {
                this.query = {
                    ...this.query,
                    ...data
                };
            },
            immediate: true
        }
    },
    methods: {
        search() {
            this.$router.replace({
                query: this.query
            });
        }
    }
};

// 包含pagelist
export const witchCommonList = {
    mixins: [withCommonSearch],
    data() {
        return {
            typeIndex: 'index',
            visibleDialogFormItem: false,
            formItem: null
        };
    },
    watch: {
        currentPage(data) {
            console.log(data)
        },
        pageSize(data) {
            console.log(data)
        },
        pageIndex(data) {
            console.log(data)
        }
    },

    methods: {
        // 序号
        // typeIndex(index){
        // console.log('index:',index)
        // console.log('currentPage:',this.currentPage)
        // console.log('pageSize:',this.pageSize)
        // return index + (this.currentPage-1)*this.pageSize +1;
        // return index
        // },
        // indexMethod (index) {
        //     console.log('index:',index)
        //     console.log('index:',this.index)
        //     console.log('index:',this.index)
        // let curpage = this.page.pagination.pageData.page   //单前页码，具体看组件取值
        // let limitpage = this.page.pagination.pageData.limit    //每页条数，具体是组件取值
        // return (index+1) + (curpage-1)*limitpage
        // },
        // 格式化参数函数
        formatPayload(data) {
            // const userInfo = JSON.parse(localStorage.getItem('loginData',))
            const payload = {
                pageIndex: data.currentPage || 1,
                pageSize: 10,
                // id:userInfo.userId,
                ...data
            };
            console.log('payload:', payload)

            if (payload.leftTreeKeyPath) {
                payload.parentId = payload.leftTreeKeyPath[payload.leftTreeKeyPath.length - 1];
                delete payload.leftTreeKeyPath;
            }
            return this.formatPayloadLeft(payload);
        },
        formatPayloadLeft(payload) { return payload },
        inputItem(item) {
            this.formItem = this.getFormItemByInputItem(item);
            this.visibleDialogFormItem = true;
            console.log('formItem:', this.formItem)
        },
        onConfirmUpdate(res) {
            this.$refs.table.fetchData();
        },
        onConfirmDelete({
            id
        }) {
            this.actionOfListDelItem({
                id
            }).then(res => {
                this.$message.success("删除成功!");
                this.$refs.table.fetchData();
                this.$emit("success", res);
                this.submitSuccess()
            });
        }
    }
}
// 包含左侧菜单
export const withCommonLeftTree = {
    data() {
        return {
            visibleDialogFormLeftTree: false,
            visibleDialogformLeftTreeMinor: false,
            visibleDialogTree: false,
            visibleDialogConsult: false,
            visibleDialogAlert: false,
            formLeftTree: null,
            formTabTree: null,
            formConsult: null,
            formAlert: null,
            formLeftTreeMinor: null,
            lastItemClicked: null,
            dialogTitle: null
        };
    },
    methods: {
        onTreeClickItem(item) {
            console.log('click-tree-item', item);
            this.lastItemClicked = item;
            this.$router.replace({
                query: {
                    id: item.id
                }
            })
            this.handleNodeClick(item)
        },
        onConfirmUpdate(res) {
            this.$refs.table.fetchData();
        },
        onAlert() {
            // this.formAlert = true;
            // this.visibleDialogAlert = true;
        },
        // 增补节点（新增子节点）
        onTreeAppend() {
            this.formLeftTree = this.getFormItemLeftByInputItem();
            this.visibleDialogFormLeftTree = true;
            this.dialogTitle = '新增'
            console.log('新增', this.formLeftTree)
        },
        // 编辑节点
        onTreeEdit() {
            const {
                lastItemClicked
            } = this;
            this.formLeftTree = this.getFormItemLeftByInputItem(lastItemClicked);
            this.visibleDialogFormLeftTree = true;
            this.dialogTitle = '编辑'
            console.log('编辑', this.formLeftTree)
        },
        // 删除节点
        onTreeDelete(data) {
            const vm = this;
            remote[data]({id: vm.lastItemClicked.id}).then(res => {
                vm.visibleDialog = false;
                res.message && vm.$message.success(res.message);
                vm.$emit("success", res);
                this.submitSuccess()
            })
            // vm.$emit("success", 'res');
            // this.$message({
            //     type: 'success',
            //     message: '删除成功!'
            // });
        },
        // 增补节点（新增子节点）
        onTreeAppendMinor() {
            // const {
            //     lastItemClicked
            // } = this;
            // if (lastItemClicked == undefined) {
            //     this.$message.warning("请先选择要添加的父节点!");
            //     return;
            // }
            // this.formItem = this.getFormItemLeftByInputItemMinor(lastItemClicked);
            // this.visibleDialogformLeftTreeMinor = true;
            // this.dialogTitle = '新增'
            // console.log('新增1', this.formItem)
        },
        // 编辑节点
        onTreeEditMinor() {
            // const {
            //     lastItemClicked
            // } = this;
            // this.formItem = this.getFormItemLeftByInputItemMinor(lastItemClicked);
            // this.visibleDialogformLeftTreeMinor = true;
            // this.dialogTitle = '编辑'
            // console.log('编辑1', this.formItem)
        },
        // 删除节点
        onTreeDeleteMinor(data) {
            const vm = this;
            remote[data]({id: vm.lastItemClicked.id}).then(res => {
                vm.visibleDialog = false;
                res.message && vm.$message.success(res.message);
                vm.$emit("success", res);
                this.submitSuccess()
            })
        }
    }
}

export const taizhou = {
    methods: {
        onMapReady({
            map,
            bundle
        }) {
            const vm = this;
            vm.map = map;
            vm.bundle = bundle;
            this.onMapReadyQuery({
                map,
                bundle
            });
        },
        onMapReadyQuery() {},

        fetchBlankBase() {
            const bundle = this.bundle;
            // 获取省市县区县边界数据。
            bundle.getBaseGeoArr().forEach(key => requestGeojsonOfKey({
                key
            }).then(res => {
                bundle.gotGeojsonOfCollection({
                    key,
                    geojson: res.data
                });
            }))
        }
    }
}

export const withWarning = {
    watch: {
        '$route.query': {
            handler(val) {
                this.fetchData();
            },
            deep: true,
            immediate: true
        }
    },
    methods:{
        syncWarning({
            bundle,
            prop
        }) {
            const {
                lastData
            } = this;
            if (lastData) {
                const list = lastData[prop];
                bundle.clearWarning();
                this.addWarning({
                    bundle,
                    list
                });
            }
        },
        addWarning({
            bundle,
            list
        }) {
            const vm = this;
            const infos = list
                .map(e => {
                    const effectAreaCodes = (e.effectArea || "").split(',')
                    Object.assign(e, transformAlarmsInfo(e))
                    e.from = "warning";
                    const info = effectAreaCodes.map(code => ({
                        ...transformAreaCode(code),
                        ...e
                    }));
                    return info
                }).flat().filter(e => e.lon);
            bundle.addWarning(infos);
        },
        fetchData() {
            const {
                query
            } = this;
            const {
                timeRange,
                ...p,
            } = query
            const [
                startTime,
                endTime
            ] = timeRange || []

            requestMonitorAllList({
                ...p,
                startTime,
                endTime
            }).then(res => {
                this.lastData = res.data;

                this.syncWarningData()
            })
        }
    }
}
