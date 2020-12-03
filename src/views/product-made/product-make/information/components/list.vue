<template>
    <page-table class="factor-table-wrap" ref="table" :data='typeData.propertyList' v-if="typeData.propertyList" :formatPayload="formatPayload" :hidePagination="true" :span-method="spanMethod">
        <el-table-column prop="title" label="气候要素" width="80px"/>
        <el-table-column prop="modelType" label="模式类型" width="80px"/>
        <el-table-column v-for="(item,index) in modelTitleList" :prop="item.code" :label="item.name" :key="index" width="81px"/>
    </page-table>
</template>
<script>
// import {} from "@/remote/";
import {
    common,
    witchCommonList,
    withCommonLeftTree
} from "../../../../mixins/index";
export default {
  props: ['data'],
  mixins: [common, witchCommonList, withCommonLeftTree],
  data() {
    return {
      loginInfo:null,
      modelTitleList:[],
      typeData:{},
    };
  },
  mounted() {
      this.data.date.forEach((element,index) => {
        this.modelTitleList.push({code:`code${index}`,name:element})
      });
      this.typeData = this.data.data
  },
  methods: {
        spanMethod({
            row,
            column,
            rowIndex,
            columnIndex,
            rows
        }) {
            if (columnIndex == 0) {
                const funSpan = e => e.title == row.title;
                const spanLength = rows.filter(funSpan).length;
                if (spanLength > 1) {
                    if (rows.findIndex(funSpan) == rowIndex) {
                        return {
                            rowspan: spanLength,
                            colspan: 1
                        }
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    }
                }
            }
        },
    formatPayload(payload){
            const loginInfo = JSON.parse(localStorage.getItem('loginInfo',))
            this.loginInfo = loginInfo
            return payload.monthTime?  {
                'orgId':this.loginInfo.orgId,
            }:{
                'orgId':this.loginInfo.orgId,
            }
        },
    // formatPayload() {
    //     return this.query
    // },
  },
};
</script>
<style lang='postcss'>
.factor-table-wrap {
    .el-table {
        min-height: 400px;
    }
}
</style>
