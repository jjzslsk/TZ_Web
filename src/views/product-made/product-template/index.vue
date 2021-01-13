<template>
  <div class="product-made-home">
    <div class="wrap-box">
    <div class="left-box">
      <common-left-tree @success="submitSuccess" class="left-tree" title="产品导航" :searchText='searchText' :isHeader='true' :data="treeData" @click-item="onTreeClickItem" :defaultExpandAll="false">
        <div slot="head-search" class="head-search">
            <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchText"></el-input>
        </div>
      <div slot="append" class="">
        <div>
        <span class="title">分类操作：</span><common-left-tree-actions @success="submitSuccess" :lastItemClicked="lastItemClicked" @append="onTreeAppend" @edit="onTreeEdit" @delete="delProductClassify()"></common-left-tree-actions>
        </div>
        <div>
        <span class="title">产品操作：</span><common-left-tree-actions @success="submitSuccess" :lastItemClicked="lastItemClicked" @append="onTreeAppendMinor" @edit="onTreeEditMinor" @delete="templateProductClassify()"></common-left-tree-actions>
        </div>
      </div>
      </common-left-tree> 
    </div>
      <dialog-form @success="submitSuccess" :title="dialogTitle + '模板分类'" :visible.sync="visibleDialogFormLeftTree" :getPayload="()=>formLeftTree" :confirmDisabled="!formLeftTree.name||formLeftTree.name===undefined" remote="requestDialogFormProductClassInput" v-if="formLeftTree">
          <template>
              <el-form-item label="分类名称" label-width="120px">
                  <el-input v-model="formLeftTree.name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="上级分类" label-width="120px">
                  <el-select v-model="formLeftTree.pid" placeholder="请选择">
                      <el-option v-for="item in treeDataList" :label="item.label" :value="item.id" :key="item.id" v-if="item.moduleType == 'templateType'"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="排序" label-width="120px">
                  <el-input v-model="formLeftTree.sort" autocomplete="off"></el-input>
              </el-form-item>
          </template>
      </dialog-form>

      <dialog-form @success="submitSuccess" :title="dialogTitle + '产品模板'" :visible.sync="visibleDialogformLeftTreeMinor" :getPayload="()=>formItem" :confirmDisabled="!formItem.name||!formItem.type" remote="requestDialogFormProductTemplateInput" v-if="formItem">
          <template>
              <el-form-item label="所属分类" label-width="120px">
                  <el-select v-model="formItem.templateTypeId" placeholder="请选择">
                      <el-option v-for="item in treeDataList" :label="item.label" :value="item.id" :key="item.id" v-if="item.moduleType == 'templateType'"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="模板名称" label-width="120px">
                  <el-input v-model="formItem.name" autocomplete="off"></el-input>
              </el-form-item>
                <el-form-item label="数据来源" label-width="120px">
                  <el-checkbox-group v-model="checkList">
                    <el-checkbox v-for="item in sourceData" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="模板类型" label-width="120px">
                  <el-radio v-model="formItem.type" label="word">word</el-radio>
                  <el-radio v-model="formItem.type" label="txt">txt</el-radio>
                </el-form-item>
              <el-form-item label="排序" label-width="120px">
                  <el-input v-model="formItem.sort" autocomplete="off"></el-input>
              </el-form-item>
          </template>
      </dialog-form>

      <div class="center-box">
        <div class="top-title no-border">
          <div class="text">产品内容</div>
          <!-- <div class="text">{{topTitle || '产品内容'}}</div> -->
          <el-button type="primary" size="small" @click="saveModule()">保存模板</el-button>
        </div>
        <div v-if="isIframe" class="iframe-content-box">
          <page-office :url="docPath" ref="iframe" id="products"></page-office>
        </div>
        <div v-else-if="isText" class="content-box">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="textarea"
            show-word-limit
          >
          </el-input>
        </div>
        <div v-else class="content-box">
          <div class="weather-forecast-box"> 
            <div class="forecast-text">
              <div class="item-list">请选择产品分类下的产品进行编辑操作</div>
              <br><br><br><br><br><br><br><br><br><br><br><br>
            </div>
          </div>
        </div>
        <!-- <div v-else class="content-box">
          <div class="weather-forecast-box"> 
            <div class="forecast-title">天气预报</div>
            <div class="line-thick"></div>
            <div class="line-thin"></div>
            <div class="forecast-text">
              <div v-for="(item,index) in forecastList" :key="index" class="item-list">{{item.text}}</div>
            </div>
          </div>
        </div> -->
      </div>

      <div class="right-box">
        <div class="top-title">
          <div class="text">产品标签</div>
        </div>
        <div class="content-box">
          <div class="tab" v-if="!isIframe && !isText">
            <!-- <div class="item-list">请选择产品</div> -->
          </div>
          <div class="tab" v-else>
            <el-tabs v-if="lastItemClicked" v-model="tabsListValue" type="card" @tab-click="handleClick">
              <!-- <el-tab-pane :key="item.name"
              v-for="(item,index) in tabsList"
              :label="item.name"
              :name="item.name">
              <el-tree
              :data="item.children"
              show-checkbox
              default-expand-all
              node-key="id"
              ref="trees"
              highlight-current
              @check-change="handleCheckChange"
              :props="defaultProps">
              <span slot-scope="{data}">
                <span @click="copy($event,data)" class="copyBtn" :data-clipboard-text="copyData">{{data.name}}</span>
              </span>
              </el-tree>
              </el-tab-pane> -->
              <el-tab-pane :key="item.code"
              v-for="(item,index) in tabListData"
              :label="item.sourceName"
              :name="item.lableTypeCode">
              <el-tree
              ref="trees"
              :data="item.labelTree"
              show-checkbox
              node-key="code"
              highlight-current
              :props="defaultProps">
              <span slot-scope="{data}">
                <span @click="copy($event,data)" class="copyBtn">{{data.name}}</span>
              </span>
              </el-tree>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <!-- <div class="title-but">
          <el-button type="success" size="small" @click="generate()">生成标签</el-button>
          <el-button type="" size="small" @click="copyContent()">复制</el-button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import Clipboard from 'clipboard'; 
import {
    requestProductClassTreeDel,
    requestProductTemplateTreeDel,
    requestProductClassTreeList,
    requestProductLabelTreeList,
    requestProductSourceNameList,
    requestDialogFormProductTemplateInput,
    requestProductLabelTrees
} from "@/remote/";
import PageOffice from '@/components/page-office/'
import {
    common,
    witchCommonList,
    withCommonLeftTree
} from '../../mixins/index';
import {
    mapActions,mapGetters
} from 'vuex'
  export default {
    mixins: [common, witchCommonList, withCommonLeftTree],
    components: {
        PageOffice
    },
    data() {
      return {
        onAdd:false,
        dataCode:null,
        tabListData:[],
        defaultData:[], //选中项
        currentData:[],
        textarea:'',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        menuData:[],
        visibleDialogFormItemClassify: false,
        visibleDialogFormItemProduct: false,
        formItem: null,
        radioType:'word',
        checkList: [],
        isIframe:false,
        isText:false,
        topTitle:'',
        docPath: '', // 文档的地址
        searchText:"",
        tabsListValue: '',
        tabsList: [],
        sourceData:[],//数据来源
        treeData:[],   
        forecastList:[
          {
            text:"Weather_Content",
          },
          {
            text:"明天早晨最低气温：TaiZhou_MinTemp",
          },
          {
            text:"明天白天最高气温：TaiZhou_Max",
          },
          {
            text:"Weather_Content",
          },
          {
            text:"Weather_Content",
          }
        ],
        treeDataList:[],
      }
    },

    computed:{
      ...mapGetters(['accountOrgId']),
    },
    mounted(){
        this.requestData()
    },
    watch:{
      onAdd(vla){
        if(vla){
          let checkboxDataArrs = this.getKeys()
          checkboxDataArrs.splice(checkboxDataArrs.findIndex(item => item == this.dataCode), 1)
          this.setKeys(checkboxDataArrs)
          this.dataCode = null
        }else{

        }
      },
      checkList(vla){
        this.formItem.sourceId = vla.toString()
      },
        visibleDialogformLeftTreeMinor(vla){
          if(!vla){
            this.formItem.sourceId = []
            this.checkList = []
          }
        }
    },
    methods: {
      getKeys(){
        let keys = []
          this.$refs.trees.forEach((i,index)=>{
          this.$refs.trees[index].getCheckedKeys().forEach(i=>{
            keys.push(i)
          })
        })
        return keys
      },
      getNodes(){
        let nodes = []
          this.$refs.trees.forEach((i,index)=>{
          this.$refs.trees[index].getCheckedNodes().forEach(i=>{
            nodes.push(i)
          })
        })
        return nodes
      },
      setKeys(data){
        this.$refs.trees.forEach((i,index)=>{
          this.$refs.trees[index].setCheckedKeys(data);
        })
      },

      //去除空字符串
      trimSpace (array) {
        let arrays = array
              for(var i = 0 ;i<arrays.length;i++)
              {
                if(arrays[i] == "" || typeof(arrays[i]) == "undefined")
                {
                  arrays.splice(i,1);
                  i= i-1;
                }
              }
            return arrays
         },

    copy(e,data) {
      let vm = this
      if(!data.children){
             let checkboxDataArr = this.getKeys()
             let checkboxDataArrs = this.getKeys()
             let checkboxDatas = this.getKeys()
             this.dataCode = data.code
             let dataCode1 = true
             let checkboxData = checkboxDataArr.forEach((i,index)=>{
               if(i==data.code){
                 this.onAdd = true
                console.log('相同')
               }else{
                 if(this.onAdd == true){return}
                 this.onAdd = false
                console.log('不相同')
                if(dataCode1){
                  checkboxDatas.push(this.dataCode)
                  this.setKeys(checkboxDatas)
                  dataCode1 = false
                }
               }
              })

              const clipboard = new Clipboard(e.target, { text: () => data.code })
              clipboard.on('success', e => {
                vm.$message({ type: 'success', message: '复制成功' })
                clipboard.destroy()         // 释放内存
              })
              clipboard.on('error', e => {
                vm.$message({ type: 'waning', message: '该浏览器不支持自动复制' })
                clipboard.destroy()
              })
              clipboard.onClick(e)  // 事件绑定
          }
        },
        handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
        if(checked){
            this.currentData.push(data.code)
            this.lastItemClicked.labelCode = this.currentData.toString()
            // this.lastItemClicked.content = this.currentData.toString()
            // this.textarea = this.currentData.toString()

            // requestDialogFormProductTemplateInput(this.lastItemClicked).then((res=>{
            //   requestProductClassTreeList().then(res => {
            //       this.treeData = res.data.list
            //       this.treeDataList = []
            //       this.treeOfList(res.data.list)
            //     });
            // }))
        }else if(!checked){
           let arr = this.currentData.filter((item) => item !== data.code);
           this.currentData = arr
           this.lastItemClicked.labelCode = this.currentData.toString()
          //  this.lastItemClicked.content = this.currentData.toString()
            // this.textarea = this.currentData.toString()

            // requestDialogFormProductTemplateInput(this.lastItemClicked).then((res=>{
            //   requestProductClassTreeList().then(res => {
            //       this.treeData = res.data.list
            //       this.treeDataList = []
            //       this.treeOfList(res.data.list)
            //     });
            // }))
        }
        // this.form.userId = this.currentData
      },
      generate(){
        let txtData = this.currentData.toString()
        this.textarea = `${txtData}`
      },
      copyContent(){
        
      },
      handleClick(tab, event) {
        console.log('kkk',tab, event);
      },
      submitSuccess(){
          this.isText = false
          this.isIframe = false
          this.formItem = {},
          this.checkList = [],
          this.formLeftTree = {}
          this.lastItemClicked = undefined
          this.treeDataList = []
          this.onConfirmUpdate()
          this.requestData()
      },
      onConfirmUpdate(res) {
            console.log('2')
        },
      //初始化页面数据
      requestData(){
        requestProductClassTreeList().then(res => {
          this.treeData = res.data.list
          this.treeDataList = []
          this.treeOfList(res.data.list)
        });
        requestProductLabelTreeList().then(res => {
          this.tabsList = res.data.list
          let sourceData = []
          // function listOfTree(list){
          //   list.forEach(element => {
          //     sourceData.push(element)
          //     if(element.children){
          //       listOfTree(element.children)
          //     }
          //   });
          // }
          // listOfTree(res.data.list)
          // this.sourceData = sourceData
        });
        requestProductSourceNameList().then(res=>{
            this.sourceData = res.data
        })
      },
        ...mapActions(['gotAccountInfo','getAccountInfo','getMenuInfo']),
      treeOfList(tree){
        tree.map(item => {
          this.treeDataList.push(item)
          if(item.children){
            this.treeOfList(item.children)
          }
        })
      },
        // 增补节点（新增子节点）
        onTreeAppendMinor() {
            const {
                lastItemClicked
            } = this;
            // if (lastItemClicked == undefined) {
            //     this.$message.warning("请先选择要添加的父节点!");
            //     return;
            // }
            this.formItem = this.getFormItemLeftByInputItemMinor();
            this.visibleDialogformLeftTreeMinor = true;
            this.dialogTitle = '新增'
            console.log('新增11', this.formItem)
        },
        // 编辑分类节点
        onTreeEdit() {
          const {
            lastItemClicked
        } = this;
        if (lastItemClicked.moduleType !== 'templateType' && lastItemClicked.moduleType !== 'productType') {
                this.$message.warning("请选择正确的产品分类");
                return;
            }
            this.formLeftTree = this.getFormItemLeftByInputItem(lastItemClicked);
            this.visibleDialogFormLeftTree = true;
            this.dialogTitle = '编辑'
            console.log('编辑2', this.formLeftTree)
        },
      onTreeEditMinor() {
          const {
            lastItemClicked
        } = this;
        if (lastItemClicked.moduleType !== 'template') {
                this.$message.warning("请选择正确的产品");
                return;
            }
        this.formItem = this.getFormItemLeftByInputItemMinor(lastItemClicked);
        this.visibleDialogformLeftTreeMinor = true;
        this.dialogTitle = '编辑'
        console.log('编辑11', this.formItem)
      },
      delProductClassify() {
            const {
                lastItemClicked,
            } = this;
            if (lastItemClicked.moduleType !== 'templateType') {
                this.$message.warning("请选择正确的产品分类");
                return;
            }

            requestProductClassTreeDel({id: lastItemClicked.id}).then(res => {
                this.visibleDialog = false;
                res.message && this.$message.success(res.message);
                this.requestData()
            })
        },
        templateProductClassify() {
            const {
                lastItemClicked,
            } = this;
            if (lastItemClicked.moduleType !== 'template') {
                this.$message.warning("请选择正确的产品");
                return;
            }

            requestProductTemplateTreeDel({id: lastItemClicked.id}).then(res => {
                this.visibleDialog = false;
                res.message && this.$message.success(res.message);
                this.requestData()
            })
        },
      saveModule(){
        if(!this.lastItemClicked){
            this.$message.warning("请选择产品");
            return
        }
        if (this.lastItemClicked.type == 'word' || this.lastItemClicked.type == 'excel') {
          this.$refs.iframe.childClick(this.lastItemClicked);
        }else{
          this.lastItemClicked.content = this.textarea
          this.lastItemClicked.labelCode = ''
          let labelCodes = []
          this.$refs.trees.forEach((i,index)=>{
            labelCodes.push(this.$refs.trees[index].getCheckedKeys().toString() )
          })
          this.lastItemClicked.labelCode = labelCodes.toString()
          requestDialogFormProductTemplateInput(this.lastItemClicked).then((res=>{
             requestProductClassTreeList().then(res => {
                this.$message.success(res.message);
                this.treeData = res.data.list
                this.treeDataList = []
                this.treeOfList(res.data.list)
              });
          }))
        }
      },
      handleNodeClick(data) {
        let vm = this
        vm.defaultData = []
        if(data.moduleType == 'template'){
          this.$nextTick(() => {
              if(this.$refs.trees){this.$refs.trees[0].setCheckedKeys([]);}
          });

        //获取右侧产品标签数据
        requestProductLabelTrees({sourceIds:this.lastItemClicked.sourceId}).then(res=>{
              this.tabListData = res.data
              this.$nextTick(() => { //默认勾选
                  if(this.$refs.trees){
                    this.defaultData = this.lastItemClicked.labelCode.split(',')
                    this.$refs.trees.forEach((i,index)=>{
                      this.$refs.trees[index].setCheckedKeys(this.defaultData);
                    })
                  }
              });

              if(this.tabListData){//TAB默认选中 第一个
                this.tabsListValue = this.tabListData[0].lableTypeCode
              }

          })
        }
        
        console.log(data)
        vm.formItem = data
        vm.topTitle = ''
        vm.topTitle = data.label;
        if(data.type == 'word' && data.moduleType == 'template'){
          vm.isIframe = true
          vm.isText = false
          // vm.docPath = `http://222.216.5.171:8891/gxims//railway/showWordForecastMonth.action?productId=20200228164618013583871`;
          // vm.docPath = `/product/ssd-page-office/openProductWord?productInfoId=P20000`;
          vm.docPath = `http://10.137.4.30:8888/basin/main/openProductFile.action?templateId=`;
        } else if(data.type == 'txt' && data.moduleType == 'template'){
          this.textarea = this.lastItemClicked.content
          vm.isText = true
          vm.isIframe = false
        }else {
           vm.isText = false
           vm.isIframe = false
        }
      },
            getFormItemByInputItemClassify(item = {}) {
            this.getAccountInfo().then(res =>{//获取当前用户机构id
                if(res.success && res.data) {
                  this.formItem.orgId = res.data.orgId
                }
            });
            const {
                lastItemClicked
            } = this;
            const lastKeyItemClicked = lastItemClicked && lastItemClicked.id;
            console.log(lastItemClicked)
            return {
                // "XXXPROP_ORGAN_id": "",
                "remark": "123",
                "pid": "",
                "name": "",
                "sort": "",
                "orgId": "",
                // "XXXPROP_ORGAN_4": lastItemClicked && (lastItemClicked.XXXPROP_ORGAN_4 || 0) + 1 + "",
                // "XXXPROP_ORGAN_5": lastKeyItemClicked,
                // lastItemClicked,
                // ...item
            };
        },
        getFormItemLeftByInputItem(item) {
          const {
            lastItemClicked
            } = this;
            console.log('lastItemClicked1:',lastItemClicked)
            console.log("item1:",item)
            let itemPid = null
            if(lastItemClicked){
              itemPid = lastItemClicked.moduleType == 'templateType' ? lastItemClicked.id:null
            }
            return item ?  {
                id:item.id,
                name:item.label,
                sort:item.sort,
                pid:item.parentId,
                orgId:item.userOrgId
                } : {
                pid:itemPid,
                orgId:this.accountOrgId,
            };
        },
        getFormItemLeftByInputItemMinor(item) {
          const {
            lastItemClicked
            } = this;
            console.log('lastItemClicked2:',lastItemClicked)
            console.log("item2:",item)
            if(item && item.sourceId){
              this.checkList = item.sourceId.split(",")
            }
            let itemTypeId = null
            if(lastItemClicked){
              itemTypeId = lastItemClicked.moduleType == 'templateType' ? lastItemClicked.id:null
            }
            return item ?  {
                    name:item.label,
                    id:item.id,
                    sort:item.sort,
                    type:item.type,
                    templateTypeId:item.parentId,
                    orgId:this.accountOrgId,
                    // ...item,
              } : {
                name: '',
                sort: '',
                templateTypeId: itemTypeId,
                orgId:this.accountOrgId,
            };
        },
          getFormItemByInputItemProduct(item = {}) {
            const {
                lastItemClicked
            } = this;
            const lastKeyItemClicked = lastItemClicked && lastItemClicked.id;
            return {
                // "XXXPROP_ORGAN_id": "",
                "XXXPROP_ORGAN_1": "",
                "XXXPROP_ORGAN_2": "",
                "XXXPROP_ORGAN_3": "",
                "XXXPROP_ORGAN_4": lastItemClicked && (lastItemClicked.XXXPROP_ORGAN_4 || 0) + 1 + "",
                "XXXPROP_ORGAN_5": lastKeyItemClicked,
                "XXXPROP_ORGAN_6": "",
                lastItemClicked,
                ...item
            };
        },
    },
  }
</script>

<style lang='postcss' scoped>
  .product-made-home{
    background: #F6F6F6;
    padding: 15px 20px 0 0;
    height: 100%;
    box-sizing: border-box;
    .wrap-box{
      display: flex;
      justify-content: space-between;
      height: 100%;
      .left-box{
        width: 280px;
        position: relative;
        background: #fff;
        .content-box{
          padding: 10px 20px;
          .tree-box{
            margin-top: 23px;
          }
        }
        .tool-box{
          padding: 30px 20px;
          position: relative;
          bottom: 0px;
          .line-interval{
            width: 100%;
            height: 1px;
            background: #E4E7ED;
            margin-bottom:30px;
          }
          .classify-tool{
            display: flex;
            justify-content: space-between;
            height: 35px;
            line-height: 35px;
            .title{
              font-size:14px;
              font-family:Microsoft YaHei;
              color:rgba(96,98,102,1);
            }
            .icon-box{
              border:1px solid rgba(235, 238, 245, 1);
              border-radius:6px;
              width: 165px;
              .iconfont{
                display: inline-block;
                width: 30%;
                text-align: center;
                font-size:15px;
                border-right:1px solid #EBEEF5;
              }
              .iconfont:last-child{
                border-right:none;
              }
              .tianjia{
                color: #67C241;
              }
              .bianji{
                color: #409EFF
              }
              .shanchu{
                color: #F46D6A;
              }
            }
          }
          .product-tool{
            margin-top: 14px;
          }
        }
      }
      .center-box{
        flex: 1;
        background: #fff;
        margin-left: 18px;
        .content-box{
          padding: 0 30px 33px;
          .weather-forecast-box{
            background:rgba(242,246,252,1);
            border:1px solid rgba(204,204,204,1);
            border-radius:4px;
            padding:0 99px;
            .forecast-title{
              font-size:24px;
              font-family:Microsoft YaHei;
              color:rgba(64,158,255,1);
              padding:68px 20px 0px;
              text-align: center;
            }
            .line-thick{
              height:3px;
              background:rgba(64,158,255,1);
              margin-top: 20px;
            }
            .line-thin{
              height:1px;
              background:rgba(64,158,255,1);
              margin-top: 4px;
            }
            .forecast-text{
              margin-top: 43px;
              .item-list{
                font-size:16px;
                font-family:Microsoft YaHei;
                color:rgba(48,49,51,1);
                margin-bottom:10px;
              }
            }
          }
        }
      }
      .right-box{
        flex: 0.5;
        background: #fff;
        margin-left: 22px;
        .content-box{
        padding: 10px 20px 0 20px;
        height: calc(100%-81px);
        .tab{
          height:100%;
          }
        }
        .title-but {
          margin-top: 70px;
          text-align: center;
        }
      }
    }
    .top-title{
      padding: 20px;
      border-bottom: 1px solid #e4e7ed;
      display: flex;
      justify-content: space-between;
      .text{
        font-size:18px;
        font-family:Microsoft YaHei;
        font-weight:400;
        color:rgba(48,49,51,1);
      }
    }
    .iframe-content-box {
      position: relative;
      display: flex;
      flex-direction: column;
      flex: 1;
      margin: 0 15px;
      height: calc(100%-72px);
    }
    .no-border{
      border-bottom: none;
    }
  }

.title{
  font-size:14px;
  font-family:Microsoft YaHei;
  color:rgba(96,98,102,1);
}
.common-left {
  width: 100% !important;
  margin-right: 0; 
}
.common-left .el-card {
  border: 0px solid #ebeef5;
}
.common-left-tree-actions{
    display: inline-block;
    text-align: center;
    padding: 1em 0;
}
.left-box .text {
  margin-top: 15px;
}
</style>
<style lang='postcss'>
.product-made-home{
  .left-box{
    height: 100%;
    .common-left {
      height: 100%;
      .el-card{
        height: calc(100%-2px);
        .el-card__header{
          height: 55px;
        }
        .el-card__body{
          height: calc(100%-55px);
          .head-search{
            height: 40px;
          }
          .text{
              height: calc(100%-40px);
              .tree{
                height: calc(100%-152px);
              }
            }
        }
      }
        .el-input__inner{
        border-radius: 16px;
      }
    }
  }
  .center-box {
    .content-box{
        height: calc(100% - 105px);
        .el-textarea{
          height: 100%;
          textarea{
            height: 100%;
          }
        }
      }
  }
  .right-box {
        .el-tabs--card{
          height:100%;
          .el-tabs__header{
            height: 41px;
          }
          .el-tabs__content{
            height: calc(100%-58px);
            .el-tab-pane{
              height: 100%;
              .el-tree{
                height: 100%;
                overflow: auto;
              }
            }
          }
        }
  }
}
</style>