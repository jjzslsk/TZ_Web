<template>
<div class="common-left-tree-actions">
    <el-button-group>
        <el-button type="success" icon="el-icon-plus" size="mini" @click="onTreeAppend" v-if="actions.includes('append')"></el-button>
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="onTreeEdit" v-if="actions.includes('edit')"></el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="onTreeDelete" v-if="actions.includes('delete')"></el-button>

        <!-- <el-button type="success" icon="el-icon-plus" size="mini" @click="onTreeAppendMinor" v-if="actions.includes('appendMinor')"></el-button>
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="onTreeEditMinor" v-if="actions.includes('editMinor')"></el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="onTreeDeleteMinor" v-if="actions.includes('deleteMinor')"></el-button> -->
    </el-button-group>
</div>
</template>

<script>
export default {
    props: {
        'actions': {
            default: () => ['append', 'edit', 'delete','appendMinor', 'editMinor', 'deleteMinor']
        },
        'lastItemClicked': Object
    },

    methods: {
        // 增补节点（添加子节点）
        onTreeAppend() {
            // const {
            //     lastItemClicked
            // } = this;
            // if (lastItemClicked == undefined) {
            //     this.$message.warning("请先选择要添加结点的父结点!");
            //     return;
            // }
            this.$emit('append');
        },
        // 编辑节点
        onTreeEdit() {
            const {
                lastItemClicked
            } = this;
            if (lastItemClicked == undefined) {
                this.$message.warning("请先选择要编辑的结点!");
                return;
            }
            this.$emit('edit');
        },
        // 删除节点
        onTreeDelete() {
            console.log('onTreeDelete');
            const {
                lastItemClicked
            } = this;
            if (lastItemClicked == undefined) {
                this.$message.warning("请先选择要删除的结点!");
                return;
            }
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$emit('delete');
            });
        },
    }
}
</script>

<style lang="css" scoped>
.common-left-tree-actions{
    text-align: center;
    padding: 1em 0;
}
</style>
