<template>
<table-block ref="table" :remote="remote" :height="height" :hidePagination="hidePagination" :formatPayload="formatPayloadInner" :span-method="spanMethod" :row-class-name="rowClassName" @current-change="onCurrentChange">
    <slot slot="actions" name="actions"></slot>
    <slot></slot>
</table-block>
</template>

<script>
import * as remote from '@/remote/'
export default {
    props: {
        'height':String,
        'remote': String,
        'hidePagination': Boolean,
        'formatPayload': {
            default: function() {
                return data => data
            }
        },
        'spanMethod': Function,
        'rowClassName': Function
    },
    data() {
        return {
            proTable: null,
            tableResolve: null
        }
    },
    watch: {
        "$route.query": {
            handler: function() {
                this.fetchData();
            },
            // immediate: true
        },
        "$refs.table": function(val) {
            if (val) {
                this.tableResolve(val);
            }
        }
    },
    computed: {
        formatPayloadInner() {
            return data => this.formatPayload({
                ...data,
                ...this.$route.query
            })
        }
    },
    methods: {
        getComponentTable() {
            const {
                proTable
            } = this;
            if (this.$refs.table) {
                return Promise.resolve(this.$refs.table);
            } else {
                if (!proTable) {
                    this.proTable = new Promise((resolve, reject) => {
                        this.tableResolve = resolve;
                    })
                }
                return this.proTable
            }
        },
        fetchData() {
            this.getComponentTable().then(table => {
                table.fetchData();
            })
        },
        onCurrentChange(page) {
            this.$router.replace({
                query: {
                    ...this.$route.query,
                    currentPage: page
                }
            })
        }
    }
}
</script>

<style lang="css" scoped>
</style>
