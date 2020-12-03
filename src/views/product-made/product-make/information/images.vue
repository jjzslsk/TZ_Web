<template>
  <div class="content product-images-page">
    <div class="but">
      <!-- <el-button type="primary" size="small" @click="onAlert('onAlert')">编辑</el-button> -->
      <el-checkbox v-model="form.checkbox" label="同步" border size="mini"></el-checkbox>
      <el-button-group>
        <el-button icon="el-icon-refresh" size="mini"></el-button>
        <el-button icon="el-icon-full-screen" @click="dialogTableVisibleFull = true" size="mini"></el-button>
      </el-button-group>
    </div>
    <div class="img-box">
      <el-row :gutter="2">
        <el-col :span="12">
          <div class="img-item" v-if="isImages">
            <!-- <div class="title">{{isImages.title}}</div> -->
            <div class="img" @click="dialogTableVisible = true">
              <img :src="isImages.imgPath" alt srcset />
            </div>
            <div class="icon-left" @click="switchImg('left')">
              <i class="el-icon-arrow-left"></i>
            </div>
            <div class="icon-right" @click="switchImg('right')">
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
          <div class="img-item" v-else>
            <p class="img-on-text">暂无图片</p>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="img-item" v-if="isImages1">
            <div class="img" @click="dialogTableVisible1 = true">
              <img :src="isImages1.imgPath" alt srcset />
            </div>
            <div class="icon-left" @click="switchImg1('left')">
              <i class="el-icon-arrow-left"></i>
            </div>
            <div class="icon-right" @click="switchImg1('right')">
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
          <div class="img-item" v-else>
            <p class="img-on-text">暂无图片</p>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="2">
        <el-col :span="12">
          <div class="img-item" v-if="isImages2">
            <div class="img" @click="dialogTableVisible2 = true">
              <img :src="isImages2.imgPath" alt srcset />
            </div>
            <div class="icon-left" @click="switchImg2('left')">
              <i class="el-icon-arrow-left"></i>
            </div>
            <div class="icon-right" @click="switchImg2('right')">
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
          <div class="img-item" v-else>
            <p class="img-on-text">暂无图片</p>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="img-item" v-if="isImages3">
            <div class="img" @click="dialogTableVisible3 = true">
              <img :src="isImages3.imgPath" alt srcset />
            </div>
            <div class="icon-left" @click="switchImg3('left')">
              <i class="el-icon-arrow-left"></i>
            </div>
            <div class="icon-right" @click="switchImg3('right')">
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
          <div class="img-item" v-else>
            <p class="img-on-text">暂无图片</p>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="preview-full" v-if="dialogTableVisibleFull">
      <div class="but">
        <el-button
          type="primary"
          icon="el-icon-back"
          @click="dialogTableVisibleFull = false"
          size="small"
        >图片资料</el-button>
        <!-- <el-button icon="el-icon-refresh" size="small">同步</el-button> -->
        <div class>
          <el-checkbox v-model="form.checkbox" label="同步" border size="small"></el-checkbox>
          <el-button
            icon="el-icon-full-screen"
            @click="dialogTableVisibleFull = false"
            size="small"
          ></el-button>
        </div>
      </div>
      <div class="img-box-full">
        <el-row :gutter="2">
          <el-col :span="12">
            <el-row :gutter="0">
              <el-col :span="18">
                <div class="img-item">
                  <div class="img" @click="dialogTableVisible = true">
                    <img src="/static/images/img.png" alt srcset />
                  </div>
                  <div class="icon-left">
                    <i class="el-icon-arrow-left"></i>
                  </div>
                  <div class="icon-right">
                    <i class="el-icon-arrow-right"></i>
                  </div>
                </div>
              </el-col>
              <el-col :span="6">
                <el-table class="table-box" border height="300" :data="tableData">
                  <el-table-column prop="date" label="起报时间"></el-table-column>
                </el-table>
                <el-table class="table-box" border height="300" :data="tableData">
                  <el-table-column prop="date" label="预报时间"></el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row :gutter="0">
              <el-col :span="18">
                <div class="img-item">
                  <div class="img" @click="dialogTableVisible = true">
                    <img src="/static/images/img.png" alt srcset />
                  </div>
                  <div class="icon-left">
                    <i class="el-icon-arrow-left"></i>
                  </div>
                  <div class="icon-right">
                    <i class="el-icon-arrow-right"></i>
                  </div>
                </div>
              </el-col>
              <el-col :span="6">
                <el-table class="table-box" border height="300" :data="tableData">
                  <el-table-column prop="date" label="起报时间"></el-table-column>
                </el-table>
                <el-table class="table-box" border height="300" :data="tableData">
                  <el-table-column prop="date" label="预报时间"></el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-row :gutter="0">
              <el-col :span="18">
                <div class="img-item">
                  <div class="img" @click="dialogTableVisible = true">
                    <img src="/static/images/img.png" alt srcset />
                  </div>
                  <div class="icon-left">
                    <i class="el-icon-arrow-left"></i>
                  </div>
                  <div class="icon-right">
                    <i class="el-icon-arrow-right"></i>
                  </div>
                </div>
              </el-col>
              <el-col :span="6">
                <el-table class="table-box" border height="300" :data="tableData">
                  <el-table-column prop="date" label="起报时间"></el-table-column>
                </el-table>
                <el-table class="table-box" border height="300" :data="tableData">
                  <el-table-column prop="date" label="预报时间"></el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row :gutter="0">
              <el-col :span="18">
                <div class="img-item">
                  <div class="img" @click="dialogTableVisible = true">
                    <img src="/static/images/img.png" alt srcset />
                  </div>
                  <div class="icon-left">
                    <i class="el-icon-arrow-left"></i>
                  </div>
                  <div class="icon-right">
                    <i class="el-icon-arrow-right"></i>
                  </div>
                </div>
              </el-col>
              <el-col :span="6">
                <el-table class="table-box" border height="300" :data="tableData">
                  <el-table-column prop="date" label="起报时间"></el-table-column>
                </el-table>
                <el-table class="table-box" border height="300" :data="tableData">
                  <el-table-column prop="date" label="预报时间"></el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>
    
    <!-- 预览弹窗 -->
    <el-dialog class="preview" :fullscreen="true" :modal="false" :modal-append-to-body="false" title :visible.sync="dialogTableVisible">
      <div class="preview-main" v-if="isImages">
        <div class="preview-box">
          <img :src="isImages.imgPath" alt srcset />
          <div class="icon-left" @click="switchImg('left')">
            <i class="el-icon-arrow-left"></i>
          </div>
          <div class="icon-right" @click="switchImg('right')">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <!-- <div class="img-list">
          <div
            class="list-item"
            :class="[present == index ? 'activeClass' : '', '']"
            @click="clickImg(index)"
            v-for="(item,index) in imagesList"
            :key="index"
          >
            <img :src="item.imgPath" alt srcset />
          </div>
        </div> -->
      </div>
    </el-dialog>

    <el-dialog class="preview" :fullscreen="true" :modal="false" :modal-append-to-body="false" title :visible.sync="dialogTableVisible1">
      <div class="preview-main" v-if="isImages1">
        <div class="preview-box">
          <img :src="isImages1.imgPath" alt srcset />
          <div class="icon-left" @click="switchImg1('left')">
            <i class="el-icon-arrow-left"></i>
          </div>
          <div class="icon-right" @click="switchImg1('right')">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog class="preview" :fullscreen="true" :modal="false" :modal-append-to-body="false" title :visible.sync="dialogTableVisible2">
      <div class="preview-main" v-if="isImages2">
        <div class="preview-box">
          <img :src="isImages2.imgPath" alt srcset />
          <div class="icon-left" @click="switchImg2('left')">
            <i class="el-icon-arrow-left"></i>
          </div>
          <div class="icon-right" @click="switchImg2('right')">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog class="preview" :fullscreen="true" :modal="false" :modal-append-to-body="false" title :visible.sync="dialogTableVisible3">
      <div class="preview-main" v-if="isImages3">
        <div class="preview-box">
          <img :src="isImages3.imgPath" alt srcset />
          <div class="icon-left" @click="switchImg3('left')">
            <i class="el-icon-arrow-left"></i>
          </div>
          <div class="icon-right" @click="switchImg3('right')">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import {
  requestProductMakeImagesList,
  requestProductConfigImagesList
} from "@/remote/";
import {
  common,
  witchCommonList,
  withCommonLeftTree
} from "../../../mixins/index";
export default {
  mixins: [common, witchCommonList, withCommonLeftTree],
  data() {
    return {
      imagesItems:null,
      imagesList: null,

      imagesItems1:null,
      imagesList1: null,

      imagesItems2:null,
      imagesList2: null,

      imagesItems3:null,
      imagesList3: null,
      // [
      //   { url: "/static/images/img.png", id: "1" },
      //   { url: "/static/images/img.png", id: "2" },
      //   { url: "/static/images/img.png", id: "3" },
      //   { url: "/static/images/img.png", id: "4" }
      // ],
      makeImagesList:[
        {date:'2020-02-20 08:00',title:'风力等值线色斑图',},
      ],
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ],
      dialogTableVisible: false,
      dialogTableVisible1: false,
      dialogTableVisible2: false,
      dialogTableVisible3: false,
      dialogTableVisibleFull: false,
      form: {
        checkbox:true
      },
      isImages: null,
      isImages1: null,
      isImages2: null,
      isImages3: null,
      present: 0,
      present1: 0,
      present2: 0,
      present3: 0,
      isActive: null,
      clickClass: ""
    };
  },
  created() {
    
  },
  mounted() {
    requestProductConfigImagesList().then((res)=>{
      requestProductMakeImagesList({model:res.data[0].model0,range:res.data[0].scope0,ele:res.data[0].factor0,height:res.data[0].eleHeight0}).then((res) => {
        // this.imagesItems = res.data

        // this.imagesList = this.imagesItems[0]
        // this.isImages = this.imagesList[this.present];

        // this.imagesList1 = this.imagesItems[1]
        // this.isImages1 = this.imagesList1[this.present1];

        this.imagesList = res.data
        this.isImages = this.imagesList.length > 0? this.imagesList[this.present]:null;
      })
      requestProductMakeImagesList({model:res.data[1].model1,range:res.data[1].scope1,ele:res.data[1].factor1,height:res.data[1].eleHeight1}).then((res) => {
        this.imagesList1 = res.data
        this.isImages1 = this.imagesList1.length > 0? this.imagesList1[this.present1]:null;
      })
      requestProductMakeImagesList({model:res.data[2].model2,range:res.data[2].scope2,ele:res.data[2].factor2,height:res.data[2].eleHeight2}).then((res) => {
        this.imagesList2 = res.data
        this.isImages2 = this.imagesList2.length > 0? this.imagesList2[this.present2]:null;
      })
      requestProductMakeImagesList({model:res.data[3].model3,range:res.data[3].scope3,ele:res.data[3].factor3,height:res.data[3].eleHeight3}).then((res) => {
        this.imagesList3 = res.data
        this.isImages3 = this.imagesList3.length > 0? this.imagesList3[this.present3]:null;
      })

    })
  },
  methods: {
    clickImg(data) {
      console.log(data);
      this.present = data;
      this.isImages = this.imagesList[this.present];
    },
    switchImg(data) {
      if (data == "right" && this.present < this.imagesList.length - 1) {
        this.present += 1;
        console.log(this.present);
        this.isImages = this.imagesList[this.present];
      } else if (data == "left" && this.present !== 0) {
        this.present -= 1;
        this.isImages = this.imagesList[this.present];
      } else {
        this.imagesList[0];
      }
    },
    switchImg1(data) {
      if (data == "right" && this.present1 < this.imagesList1.length - 1) {
        this.present1 += 1;
        console.log(this.present1);
        this.isImages1 = this.imagesList1[this.present1];
      } else if (data == "left" && this.present1 !== 0) {
        this.present1 -= 1;
        this.isImages1 = this.imagesList1[this.present1];
      } else {
        this.imagesList1[0];
      }
    },
    switchImg2(data) {
      if (data == "right" && this.present2 < this.imagesList2.length - 1) {
        this.present2 += 1;
        console.log(this.present2);
        this.isImages2 = this.imagesList2[this.present2];
      } else if (data == "left" && this.present2 !== 0) {
        this.present2 -= 1;
        this.isImages2 = this.imagesList2[this.present2];
      } else {
        this.imagesList2[0];
      }
    },
    switchImg3(data) {
      if (data == "right" && this.present3 < this.imagesList3.length - 1) {
        this.present3 += 1;
        console.log(this.present3);
        this.isImages3 = this.imagesList3[this.present3];
      } else if (data == "left" && this.present3 !== 0) {
        this.present3 -= 1;
        this.isImages3 = this.imagesList3[this.present3];
      } else {
        this.imagesList3[0];
      }
    },
    onAlert(data) {
      //   this.$emit("dialogEmit", data);
    }
  }
};
</script>
<style lang='postcss' scoped>
.content {
  flex: 1 !important;
  height: 100%;
  .but {
    text-align: right;
  }
  .img-box {
    height: calc(100% - 33.17px);
    .el-row {
      height: 50%;
      .el-col{
        height: 100%;
        .img-item {
          height: 100%;
          position: relative;
          padding: 0 10px 0px 10px;
          .title {
            padding: 10px 0 5px 0;
            text-align: center;
            font-size: 13px;
            color: #606266;
          }
          .img {
            width: 100%;
            height: calc(100% - 29px);
            background: #409eff;
            img{
              width: 100%;
              height: 100%;
            }
          }
          .img-on-text {
            text-align: center;
            padding-top: 1rem;
            color: #909399;
            font-size: 13px;
          }
          .icon-left {
            position: absolute;
            z-index: 3;
            background: rgba(0, 0, 0, 0.11);
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            left: 0;
            top: 50%;
            width: 23px;
            height: 23px;
            i {
              height: 100%;
              width: 100%;
              position: absolute;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
          .icon-right {
            position: absolute;
            z-index: 3;
            background: rgba(0, 0, 0, 0.11);
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            right: 0;
            top: 50%;
            width: 23px;
            height: 23px;
            i {
              height: 100%;
              width: 100%;
              position: absolute;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }
      }
    }

  }
  .preview {
    .preview-main {
      width: 100%;
      height: 100%;
      .preview-box {
        width: 100%;
        height: 80%;
        /* padding: 0 2.5px; */
        img {
          width: 100%;
          height: 100%;
        }
        .icon-left {
          position: absolute;
          z-index: 3;
          background: rgba(0, 0, 0, 0.11);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          left: 0;
          top: 40%;
          width: 23px;
          height: 23px;
          i {
            height: 100%;
            width: 100%;
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        .icon-right {
          position: absolute;
          z-index: 3;
          background: rgba(0, 0, 0, 0.11);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          right: 0;
          top: 40%;
          width: 23px;
          height: 23px;
          i {
            height: 100%;
            width: 100%;
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
      .img-list {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 20%;
        .list-item {
          height: 100%;
          padding: 0 2.5px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .activeClass {
          border: #409eff 2px solid;
        }
      }
    }
  }
  .preview-full {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    z-index: 10;
    .but {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 30px;
    }
    .img-box-full {
      height: calc(100% - 60px);
      padding: 0 10px;
      .table-box {
        .el-table__header tr,
        .el-table__header th {
          padding: 0;
          height: 40px;
        }
        .el-table__body tr,
        .el-table__body td {
          padding: 0;
          height: 40px;
        }
        th {
          padding: 0 !important;
          height: 10px;
          ling-height: 10px;
        }
        td {
          padding: 0 !important;
          height: 10px;
          ling-height: 10px;
        }
      }
      .el-row {
        height: 50%;
        padding-bottom: 2.5px;
        .el-col {
          height: 100%;
        }
      }
      .img-item {
        height: 100%;
        position: relative;
        padding: 0 10px 0px 10px;
        .title {
          padding: 10px 0;
          text-align: center;
          font-size: 15px;
          color: #606266;
        }
        .img {
          /* height: calc(100% - 35px); */
          height: 100%;
          img {
            width: 100%;
            height: 200%;
          }
        }
        .icon-left {
          position: absolute;
          z-index: 3;
          background: rgba(0, 0, 0, 0.11);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          left: 0;
          top: 100%;
          width: 23px;
          height: 23px;
          i {
            height: 100%;
            width: 100%;
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        .icon-right {
          position: absolute;
          z-index: 3;
          background: rgba(0, 0, 0, 0.11);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          right: 0;
          top: 100%;
          width: 23px;
          height: 23px;
          i {
            height: 100%;
            width: 100%;
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
  }
}
</style>
<style lang='postcss'>
.table-box {
  .el-table__header tr,
  .el-table__header th {
    padding: 0;
    height: 30px;
  }
  .el-table__body tr,
  .el-table__body td {
    padding: 0;
    height: 30px;
  }
}
.product-images-page {
  height: calc(100% - 129px)!important;
  position: relative;
  .v-modal{
    position: absolute;
  }
  .el-dialog__wrapper{
    position: absolute;
  }
  .el-dialog__body{
    padding: 0;
    height: 96%;
  }
  .el-dialog__header{
    padding: 0;
  }
  .el-dialog{
    margin-top: 0 !important;
  }
}
</style>