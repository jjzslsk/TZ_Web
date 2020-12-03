<template>
  <div class="content content-phrase" ref="colDom">
    <el-row class="phrase">
      <el-col v-for="(item,index) in tableData" :key="index" :span="6">
        <el-table @cell-dblclick="rowClick" :height="colHeight" :data="item.itemList" style="width: 100%">
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
      colHeight:null,
    };
  },
  mounted(){
    this.colHeight= this.$refs.colDom.offsetHeight - 20
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
<style lang='postcss' scoped>
.content {
  height: calc(100% - 129px)!important;
  .phrase {
    height: 100%;
  }
}
</style>
<style lang="postcss">
.content-phrase{
  .el-col {
    height: 100%;
    background:red!important;
    .el-table {
      .cell {
        text-align: center;
      }
      th {
        padding-top: 0;
      }
      td {
          border-bottom: 0px solid #ebeef5 ;
        }
    }
  }
}
</style>