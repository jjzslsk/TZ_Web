<template>
<el-aside class="common-left">
    <el-card class="box-card" shadow="never">
        <div slot="header" v-if="isHeader" class="clearfix">
            <span class="primary">{{title}}</span>
        </div>
        <slot name="head-search"></slot>
        <div class="text">
            <div class="tree">
                <c-tree class="tree-item" :remote="remote" :data='data' :searchText='searchText' :defaultExpandAll='defaultExpandAll' :keys-expanded-default="keysExpandedDefault" :key-current-node="keyCurrentNode" @select-item="data=>$emit('select-item',data)" @click-item="data=>$emit('click-item',data)" @select-path="onTreeSelectPath">
                </c-tree>
            </div>
            <slot name="append"></slot>
        </div>
    </el-card>
</el-aside>
</template>

<script>
export default {
    props: ['title','remote','data','defaultExpandAll','isHeader','searchText'],
    data() {
        const keysExpandedDefault = this.$route.query.leftTreeKeyPath || [];
        const keyCurrentNode = keysExpandedDefault[keysExpandedDefault.length - 1];
        return {
            keysExpandedDefault,
            keyCurrentNode
        }
    },
    methods: {
        onTreeSelectPath(keyPath) {
            this.$router.replace({
                query: {
                    leftTreeKeyPath: keyPath
                }
            })
        }
    }
}
</script>

<style lang="css" scoped>
</style>
