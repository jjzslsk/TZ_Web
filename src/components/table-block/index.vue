<template>
<list-table :rows="rows" :height="height" :total="rowCount" :hidePagination="hidePagination" :page-size="pageSize" :currentPage="currentPage" :span-method="spanMethodInner" v-bind="$attrs" @current-change="onCurrentChange">
    <slot slot="actions" name="actions"></slot>
    <slot></slot>
</list-table>
</template>

<script>
import * as remote from '@/remote/'
export default {
    props: {
        'remote': String,
        'data':Object,
        'height':String,
        'hidePagination': Boolean,
        'formatPayload': {
            default: function() {
                return data => data
            }
        },
        'spanMethod': Function
    },
    data() {
        return {
            rows: [],
            currentPage: 1,
            pageSize: 10,
            rowCount: 0
        }
    },
    computed: {
        spanMethodInner() {
            const {
                spanMethod
            } = this;
            return spanMethod && (info => spanMethod({
                ...info,
                rows: this.rows
            }))
        }
    },
    mounted() {
        this.fetchData();
    },
    // watch: {
    //     "$route.query": {
    //         handler: function() {
    //             this.fetchData();
    //         },
    //         immediate: true
    //     }
    // },
    methods: {
        fetchData() {
                const payload = this.formatPayload({});
                if(this.data){
                    let res = this.data
                    this.rows = res.data.list;
                    this.currentPage = res.data.pageIndex;
                    if (typeof(payload.currentPage) !== "undefined" && payload.currentPage != res.data.pageIndex) {
                        this.$emit('current-change', this.currentPage);
                    }
                    this.pageSize = res.data.pageSize;
                    this.rowCount = res.data.rowCount;
                }else{
                    remote[this.remote](payload).then(res => {
                        this.rows = res.data.list;
                        this.currentPage = res.data.pageIndex;
                        if (typeof(payload.currentPage) !== "undefined" && payload.currentPage != res.data.pageIndex) {
                            this.$emit('current-change', this.currentPage);
                        }
                        this.pageSize = res.data.pageSize;
                        this.rowCount = res.data.rowCount;
                    })
                }

        },
        onCurrentChange(page) {
            this.$emit('current-change', page);
        }
    }
}
</script>

<style lang="css" scoped>
</style>
