<template>
<div>
    <el-tree v-if="data" :data="data" class="c-tree" ref="tree" node-key="id" :current-node-key="keyCurrentNode" highlight-current :default-expanded-keys="keysExpandedDefault" :show-checkbox="showCheckbox"
      :default-expand-all="defaultExpandAll" :default-checked-keys="defaultCheckedKeys" :props="propsTree" @node-click="handleNodeClick" :filter-node-method="filterNodeMethod">

    </el-tree>

    <el-tree v-else class="c-tree" ref="tree" :data="dataInner" node-key="id" :current-node-key="keyCurrentNode" highlight-current :default-expanded-keys="keysExpandedDefault" :show-checkbox="showCheckbox" :default-expand-all="false"
      :default-checked-keys="defaultCheckedKeys" :props="propsTree" @node-click="handleNodeClick" :lazy="lazy" :load="onLoadTree" :filter-node-method="filterNodeMethod">
    </el-tree>
</div>
</template>

<script>
import * as remote from '@/remote/'
export default {
    props: {
        "remote": String,
        "data": Array,
        "searchText": String,
        "keysExpandedDefault": Array,
        "keyCurrentNode": String,
        "showCheckbox": Boolean,
        "defaultCheckedKeys": String,
        "defaultExpandAll": Boolean,
        "lazy": {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            propsTree: {},
            dataInner: []
        }
    },
    computed: {
        fetchAction() {
            return remote[this.remote];
        }
    },
    watch: {
        searchText(val) {
            this.$refs.tree.filter(val);
        }
    },
    mounted() {
        const {
            lazy
        } = this;
        if (!lazy) {
            this.fetchAction().then(res => {
                this.dataInner = res.data.list;
            })
        }
    },
    methods: {
        filterNodeMethod(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        handleNodeClick(data, node) {
            const {
                id,
                ifLeaf
            } = data;
            if (ifLeaf) {
                // debugger
                const tree = this.$refs.tree;
                // const currentNode = tree.getCurrentNode();
                // if (currentNode) {
                // }
                if (tree) {
                    const nodePath = tree.getNodePath(node);
                    const keyPath = nodePath.reduce((p, c) => {
                        p.push(c.id);
                        return p;
                    }, []);
                    // debugger
                    this.$emit('select-path', keyPath);
                }
                this.$emit('select-item', data);
            }
            this.$emit('click-item', data);
        },
        onLoadTree(node, resolve) {
            if (this.data) return
            this.fetchAction({
                node
            }).then(res => {
                const {
                    data
                } = res;
                const {
                    keyCurrentNode
                } = this;

                const [item] = data.filter((item) => item.id == keyCurrentNode)
                if (item) {
                    this.$emit('select-item', item);
                    this.$emit('click-item', item);
                }
                resolve(data);
            });
        },
    }
}
</script>

<style lang="css" scoped>
</style>
