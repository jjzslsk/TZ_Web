<template>
  <div class="content">
    <el-row class="phrase">
      <el-col  v-for="(item,index) in tableData" :key="index" :span="6">
        <el-table @cell-dblclick="rowClick" height="700" :data="item.itemList" style="width: 100%">
          <el-table-column prop="name" :label="item.type"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  requestProductMakePhrase,
} from "@/remote/";
export default {
  data() {
    return {
      tableData:[],
    };
  },
  mounted(){
    requestProductMakePhrase().then(res=>{
      this.tableData = res.data.list
      this.tableData.forEach(item=>{
        item.itemList = []
        item.list.map(i=>{
          item.itemList.push({name:i})
        })
      })
    })
  },
  methods:{
    rowClick(row){
       this.$emit('emitPhraes',row.name);
    },
  }
};
</script>
<style lang='postcss' scoped>
.content {
  .phrase {
    .el-table {
      .cell {
      }
    }
  }
}
</style>
<style lang='postcss'>
.content {
  .phrase {
    padding: 20px;
    .el-table {
      .cell {
        text-align: center;
      }
      td {
          border-bottom: 0px solid #ebeef5 ;
        }
    }
  }
}
</style>