<template>
<el-row>
    <el-col :span="8">
        <c-upload :file-list="fileListPoint" :post-action="urlImageUploadPoint" extension="jpeg|jpe|jpg|gif|png|webp" @success="onFileSuccessPoint" @error="onFileErrorPoint">
            <el-button type="primary">{{imageSrc?'重新上传':'点击上传'}}</el-button>
        </c-upload>
    </el-col>
    <el-col :span="8">
        <image-previewer :src="imageSrc"></image-previewer>
    </el-col>
    <el-col :span="8" v-show="imageSrc">
        <el-button type="text" @click="$emit('delete')">删除图片</el-button>
    </el-col>
</el-row>
</template>

<script>
import {
    urlImageUploadPoint
} from '@/remote/'
export default {
    name: 'ImageSelector',
    props: ['src'],
    data() {
        return {
            urlImageUploadPoint,
            fileListPoint: []
        }
    },
    computed: {
        imageSrc: {
            get() {
                return this.src;
            },
            set(val) {
                this.$emit("update:src", val);
            }
        }
    },
    methods: {
        onFileSuccessPoint(file) {
            const {
                response: {
                    // data: {
                    //     src
                    // }
                    data: src
                }
            } = file;
            this.imageSrc = src;
        },
        onFileErrorPoint(message) {
            switch (message) {
                case "extension":
                    this.$message.error('文件格式不对');
                    break;
                case "size":
                    this.$message.error('文件大小限制在10m以内');
                    break;
                default:
                    this.$message.error(`文件上传出错`);
            }
        }
    }
}
</script>
<style scoped>
.input {
    padding-top: 5em;
    background: #fff;
}
</style>
