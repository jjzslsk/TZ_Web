<template>
<div class="list-table">
    <slot name="actions"></slot>
    <el-table :height="tableHeight" ref="table" :data="rows" border style="width: 100%" v-bind="$attrs">
        <slot></slot>
    </el-table>
    <el-pagination layout="prev, pager, next" @current-change="$emit('current-change',$event)" v-bind="$attrs" v-if="!hidePagination" />
</div>
</template>

<script>
export default {
        data() {
        return {
            tableHeight:null,
            incoming:140,
        };
    },
    props: ['rows', 'hidePagination','height'],
    mounted:function(){ },
  watch: {
    rows() {
      //表格自适应高度延时渲染
      setTimeout(() => {
        if (this.rows) {
          if (this.height) {
            this.incoming = this.height;
          } else {
            this.incoming = this.incoming;
          }
          // this.height? this.incoming = this.height:this.incoming = this.incoming
          this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - this.incoming;
          // 监听窗口大小变化
          window.onresize = function () {
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - this.incoming;
          };
          //this.$refs.table.$el.offsetTop：表格距离浏览器的高度 
          //140表示你想要调整的表格距离底部的高度（你可以自己随意调整），因为我们一般都有放分页组件的，所以需要给它留一个高度
        }
      }, 1100);
    },
  },
}
</script>

<style scoped>
</style>
